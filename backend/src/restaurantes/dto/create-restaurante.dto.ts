import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CardapioItemDto {
  @IsString()
  @IsNotEmpty()
  produto!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNumber()
  @Min(0)
  preco!: number;

  @IsString()
  @IsNotEmpty()
  categoria!: string;

  @IsOptional()
  @IsString()
  imagem?: string;

  @IsOptional()
  @IsBoolean()
  disponivel?: boolean;
}

export class CreateRestauranteDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsString()
  @IsNotEmpty()
  categoria!: string;

  @IsNumber()
  @Min(0)
  taxa_entrega!: number;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  imagem?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  tempo_entrega?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pedido_minimo?: number;

  @IsOptional()
  @IsBoolean()
  aberto?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardapioItemDto)
  cardapio?: CardapioItemDto[];
}
