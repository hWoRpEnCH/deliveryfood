import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PEDIDO_STATUS } from '../schemas/pedido.schema';
import { ItemPedidoDto } from './item-pedido.dto';

export class UpdatePedidoDto {
  @IsOptional()
  @IsMongoId()
  usuario_id?: string;

  @IsOptional()
  @IsMongoId()
  restaurante_id?: string;

  @IsOptional()
  @IsDateString()
  data_pedido?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens?: ItemPedidoDto[];

  @IsOptional()
  @IsString()
  @IsIn(PEDIDO_STATUS)
  status?: string;
}
