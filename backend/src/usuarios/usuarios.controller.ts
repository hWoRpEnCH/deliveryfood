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
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { FavoritoDto } from './dto/favorito.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.create(dto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.usuariosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }

  @Post(':id/favoritos')
  favoritar(@Param('id') id: string, @Body() dto: FavoritoDto) {
    return this.usuariosService.favoritar(id, dto.restaurante_id);
  }

  @Delete(':id/favoritos/:restauranteId')
  desfavoritar(@Param('id') id: string, @Param('restauranteId') restauranteId: string) {
    return this.usuariosService.desfavoritar(id, restauranteId);
  }
}
