import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { Restaurante, RestauranteDocument } from './schemas/restaurante.schema';

@Injectable()
export class RestaurantesService {
  constructor(
    @InjectModel(Restaurante.name)
    private readonly restauranteModel: Model<RestauranteDocument>,
  ) {}

  async create(dto: CreateRestauranteDto): Promise<RestauranteDocument> {
    const restaurante = new this.restauranteModel(dto);
    return restaurante.save();
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<RestauranteDocument>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.search) {
      filter.nome = { $regex: query.search, $options: 'i' };
    }
    if (query.categoria) {
      filter.categoria = { $regex: query.categoria, $options: 'i' };
    }

    const [data, total] = await Promise.all([
      this.restauranteModel.find(filter).skip(skip).limit(limit).exec(),
      this.restauranteModel.countDocuments(filter),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: string): Promise<RestauranteDocument> {
    const restaurante = await this.restauranteModel.findById(id).exec();
    if (!restaurante) {
      throw new NotFoundException('Restaurante não encontrado');
    }
    return restaurante;
  }

  async update(id: string, dto: UpdateRestauranteDto): Promise<RestauranteDocument> {
    const restaurante = await this.restauranteModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!restaurante) {
      throw new NotFoundException('Restaurante não encontrado');
    }
    return restaurante;
  }

  async remove(id: string): Promise<void> {
    const result = await this.restauranteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Restaurante não encontrado');
    }
  }
}
