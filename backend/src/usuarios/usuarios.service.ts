import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { RestaurantesService } from '../restaurantes/restaurantes.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<UsuarioDocument>,
    private readonly restaurantesService: RestaurantesService,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<UsuarioDocument> {
    const exists = await this.usuarioModel.findOne({ email: dto.email.toLowerCase() });
    if (exists) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const usuario = new this.usuarioModel({
      ...dto,
      email: dto.email.toLowerCase(),
      senha: senhaHash,
    });
    const saved = await usuario.save();
    return this.findOne(saved._id.toString());
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<UsuarioDocument>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.search) {
      filter.$or = [
        { nome: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.usuarioModel
        .find(filter)
        .select('-senha')
        .populate('restaurantes_favoritos', 'nome categoria taxa_entrega')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.usuarioModel.countDocuments(filter),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string): Promise<UsuarioDocument> {
    this.ensureValidId(id);

    const usuario = await this.usuarioModel
      .findById(id)
      .select('-senha')
      .populate('restaurantes_favoritos', 'nome categoria taxa_entrega')
      .exec();

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return usuario;
  }

  async update(id: string, dto: UpdateUsuarioDto): Promise<UsuarioDocument> {
    this.ensureValidId(id);

    if (dto.email) {
      const duplicate = await this.usuarioModel.findOne({
        email: dto.email.toLowerCase(),
        _id: { $ne: id },
      });
      if (duplicate) {
        throw new ConflictException('E-mail já cadastrado');
      }
    }

    const update: Partial<Usuario> & { senha?: string } = { ...dto };
    if (dto.email) update.email = dto.email.toLowerCase();
    if (dto.senha) update.senha = await bcrypt.hash(dto.senha, 10);

    const usuario = await this.usuarioModel
      .findByIdAndUpdate(id, update, { new: true })
      .select('-senha')
      .populate('restaurantes_favoritos', 'nome categoria taxa_entrega')
      .exec();

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return usuario;
  }

  async remove(id: string): Promise<void> {
    this.ensureValidId(id);

    const result = await this.usuarioModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async favoritar(usuarioId: string, restauranteId: string): Promise<UsuarioDocument> {
    this.ensureValidId(usuarioId);
    this.ensureValidId(restauranteId);

    await this.restaurantesService.findOne(restauranteId);

    const usuario = await this.usuarioModel.findById(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const objectId = new Types.ObjectId(restauranteId);
    const already = usuario.restaurantes_favoritos.some((id) => id.equals(objectId));

    if (!already) {
      usuario.restaurantes_favoritos.push(objectId);
      await usuario.save();
    }

    return this.findOne(usuarioId);
  }

  async desfavoritar(usuarioId: string, restauranteId: string): Promise<UsuarioDocument> {
    this.ensureValidId(usuarioId);
    this.ensureValidId(restauranteId);

    const usuario = await this.usuarioModel.findById(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    usuario.restaurantes_favoritos = usuario.restaurantes_favoritos.filter(
      (id) => !id.equals(new Types.ObjectId(restauranteId)),
    );
    await usuario.save();

    return this.findOne(usuarioId);
  }

  private ensureValidId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de usuário inválido');
    }
  }
}
