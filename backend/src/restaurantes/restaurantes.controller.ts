import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { RestaurantesService } from './restaurantes.service';

@Controller('restaurantes')
export class RestaurantesController {
  constructor(private readonly restaurantesService: RestaurantesService) {}

  @Post()
  create(@Body() dto: CreateRestauranteDto) {
    return this.restaurantesService.create(dto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.restaurantesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRestauranteDto) {
    return this.restaurantesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantesService.remove(id);
  }
}
