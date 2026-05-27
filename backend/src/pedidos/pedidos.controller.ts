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
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PedidosQueryDto } from './dto/pedidos-query.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  create(@Body() dto: CreatePedidoDto) {
    return this.pedidosService.create(dto);
  }

  @Get()
  findAll(@Query() query: PedidosQueryDto) {
    return this.pedidosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePedidoDto) {
    return this.pedidosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidosService.remove(id);
  }
}
