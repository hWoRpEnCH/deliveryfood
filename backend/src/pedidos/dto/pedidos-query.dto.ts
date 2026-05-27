import { IsMongoId, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class PedidosQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsMongoId()
  usuario_id?: string;

  @IsOptional()
  @IsMongoId()
  restaurante_id?: string;
}
