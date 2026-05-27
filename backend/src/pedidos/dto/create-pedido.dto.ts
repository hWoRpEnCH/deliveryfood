import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsMongoId,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ItemPedidoDto } from './item-pedido.dto';

export class CreatePedidoDto {
  @IsMongoId()
  usuario_id!: string;

  @IsMongoId()
  restaurante_id!: string;

  @IsOptional()
  @IsDateString()
  data_pedido?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens!: ItemPedidoDto[];
}
