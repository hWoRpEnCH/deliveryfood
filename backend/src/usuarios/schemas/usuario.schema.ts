import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema({ timestamps: true, collection: 'usuarios' })
export class Usuario {
  @Prop({ required: true, trim: true })
  nome!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  senha!: string;

  @Prop({ trim: true })
  imagem?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Restaurante' }], default: [] })
  restaurantes_favoritos!: Types.ObjectId[];
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
