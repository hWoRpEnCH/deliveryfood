import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PedidoDocument = HydratedDocument<Pedido>;

@Schema({ _id: false })
export class ItemPedido {
  @Prop({ required: true })
  produto!: string;

  @Prop({ required: true, min: 0 })
  preco!: number;

  @Prop({ required: true, min: 1 })
  qtd!: number;
}

export const ItemPedidoSchema = SchemaFactory.createForClass(ItemPedido);

export const PEDIDO_STATUS = [
  'pendente',
  'preparando',
  'entrega',
  'entregue',
  'cancelado',
] as const;

export type PedidoStatus = (typeof PEDIDO_STATUS)[number];

@Schema({ timestamps: true, collection: 'pedidos' })
export class Pedido {
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Restaurante', required: true })
  restaurante_id!: Types.ObjectId;

  @Prop({ required: true, default: () => new Date() })
  data_pedido!: Date;

  @Prop({ type: [ItemPedidoSchema], required: true })
  itens!: ItemPedido[];

  @Prop({ required: true, min: 0 })
  valor_total!: number;

  @Prop({
    enum: PEDIDO_STATUS,
    default: 'pendente',
  })
  status!: PedidoStatus;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);
