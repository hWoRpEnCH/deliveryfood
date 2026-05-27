import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CardapioItemDocument = HydratedDocument<CardapioItem>;

@Schema({ _id: true })
export class CardapioItem {
  @Prop({ required: true, trim: true })
  produto!: string;

  @Prop({ trim: true })
  descricao?: string;

  @Prop({ required: true, min: 0 })
  preco!: number;

  @Prop({ required: true, trim: true })
  categoria!: string;

  @Prop()
  imagem?: string;

  @Prop({ default: true })
  disponivel!: boolean;
}

export const CardapioItemSchema = SchemaFactory.createForClass(CardapioItem);

export type RestauranteDocument = HydratedDocument<Restaurante>;

@Schema({ timestamps: true, collection: 'restaurantes' })
export class Restaurante {
  @Prop({ required: true, trim: true })
  nome!: string;

  @Prop({ required: true, trim: true })
  categoria!: string;

  @Prop({ required: true, min: 0 })
  taxa_entrega!: number;

  @Prop({ trim: true })
  descricao?: string;

  @Prop()
  imagem?: string;

  @Prop({ trim: true })
  endereco?: string;

  @Prop({ default: '30-45 min' })
  tempo_entrega!: string;

  @Prop({ min: 0, default: 0 })
  pedido_minimo!: number;

  @Prop({ default: true })
  aberto!: boolean;

  @Prop({ type: [CardapioItemSchema], default: [] })
  cardapio!: CardapioItem[];
}

export const RestauranteSchema = SchemaFactory.createForClass(Restaurante);
