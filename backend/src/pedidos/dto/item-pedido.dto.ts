import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ItemPedidoDto {
  @IsString()
  @IsNotEmpty()
  produto!: string;

  @IsNumber()
  @Min(0)
  preco!: number;

  @IsNumber()
  @Min(1)
  qtd!: number;
}
