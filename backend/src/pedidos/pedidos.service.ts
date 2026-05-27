import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { Restaurante, RestauranteDocument } from '../restaurantes/schemas/restaurante.schema';
import { Usuario, UsuarioDocument } from '../usuarios/schemas/usuario.schema';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PedidosQueryDto } from './dto/pedidos-query.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { ItemPedido, Pedido, PedidoDocument } from './schemas/pedido.schema';

@Injectable()
export class PedidosService {
  constructor(
    @InjectModel(Pedido.name) private readonly pedidoModel: Model<PedidoDocument>,
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<UsuarioDocument>,
    @InjectModel(Restaurante.name)
    private readonly restauranteModel: Model<RestauranteDocument>,
  ) {}

  private calcularSubtotalItens(itens: ItemPedido[]): number {
    return itens.reduce((acc, item) => acc + item.preco * item.qtd, 0);
  }

  private async calcularValorTotal(
    itens: ItemPedido[],
    restauranteId: string,
  ): Promise<number> {
    const restaurante = await this.restauranteModel.findById(restauranteId).exec();
    if (!restaurante) {
      throw new NotFoundException('Restaurante não encontrado');
    }
    return this.calcularSubtotalItens(itens) + restaurante.taxa_entrega;
  }

  private async validarReferencias(usuarioId: string, restauranteId: string): Promise<void> {
    const [usuario, restaurante] = await Promise.all([
      this.usuarioModel.findById(usuarioId).exec(),
      this.restauranteModel.findById(restauranteId).exec(),
    ]);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (!restaurante) {
      throw new NotFoundException('Restaurante não encontrado');
    }
  }

  async create(dto: CreatePedidoDto): Promise<PedidoDocument> {
    await this.validarReferencias(dto.usuario_id, dto.restaurante_id);

    const valor_total = await this.calcularValorTotal(dto.itens, dto.restaurante_id);

    const pedido = new this.pedidoModel({
      usuario_id: dto.usuario_id,
      restaurante_id: dto.restaurante_id,
      data_pedido: dto.data_pedido ? new Date(dto.data_pedido) : new Date(),
      itens: dto.itens,
      valor_total,
    });

    return pedido.save();
  }

  async findAll(query: PedidosQueryDto): Promise<PaginatedResult<PedidoDocument>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.usuario_id) filter.usuario_id = query.usuario_id;
    if (query.restaurante_id) filter.restaurante_id = query.restaurante_id;

    const [data, total] = await Promise.all([
      this.pedidoModel
        .find(filter)
        .populate('usuario_id', 'nome email')
        .populate('restaurante_id', 'nome categoria taxa_entrega')
        .sort({ data_pedido: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.pedidoModel.countDocuments(filter),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: string): Promise<PedidoDocument> {
    const pedido = await this.pedidoModel
      .findById(id)
      .populate('usuario_id', 'nome email')
      .populate('restaurante_id', 'nome categoria taxa_entrega')
      .exec();

    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    return pedido;
  }

  async update(id: string, dto: UpdatePedidoDto): Promise<PedidoDocument> {
    const pedido = await this.pedidoModel.findById(id).exec();
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }

    const usuarioId = dto.usuario_id ?? pedido.usuario_id.toString();
    const restauranteId = dto.restaurante_id ?? pedido.restaurante_id.toString();
    const itens = dto.itens ?? pedido.itens;

    await this.validarReferencias(usuarioId, restauranteId);

    const valor_total = await this.calcularValorTotal(itens, restauranteId);

    const updated = await this.pedidoModel
      .findByIdAndUpdate(
        id,
        {
          ...(dto.usuario_id && { usuario_id: dto.usuario_id }),
          ...(dto.restaurante_id && { restaurante_id: dto.restaurante_id }),
          ...(dto.data_pedido && { data_pedido: new Date(dto.data_pedido) }),
          ...(dto.itens && { itens: dto.itens }),
          ...(dto.status && { status: dto.status }),
          valor_total,
        },
        { new: true },
      )
      .populate('usuario_id', 'nome email')
      .populate('restaurante_id', 'nome categoria taxa_entrega')
      .exec();

    return updated!;
  }

  async remove(id: string): Promise<void> {
    const result = await this.pedidoModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Pedido não encontrado');
    }
  }
}
