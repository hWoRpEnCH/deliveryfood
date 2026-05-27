import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      database: this.getDatabaseStatus(),
    };
  }

  @Get('ready')
  ready() {
    const database = this.getDatabaseStatus();

    if (database !== 'connected') {
      throw new ServiceUnavailableException(`Database is ${database}`);
    }

    return {
      status: 'ready',
      database,
    };
  }

  private getDatabaseStatus() {
    switch (this.connection.readyState) {
      case 0:
        return 'disconnected';
      case 1:
        return 'connected';
      case 2:
        return 'connecting';
      case 3:
        return 'disconnecting';
      default:
        return 'unknown';
    }
  }
}
