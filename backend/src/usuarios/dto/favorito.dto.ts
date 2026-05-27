import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FavoritoDto {
  @IsMongoId()
  @IsNotEmpty()
  restaurante_id!: string;
}
