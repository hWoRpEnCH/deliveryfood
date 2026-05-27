import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurante, RestauranteSchema } from '../restaurantes/schemas/restaurante.schema';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema';
import { Pedido, PedidoSchema } from './schemas/pedido.schema';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pedido.name, schema: PedidoSchema },
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Restaurante.name, schema: RestauranteSchema },
    ]),
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
