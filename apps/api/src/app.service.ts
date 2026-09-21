import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthStatus(): { status: string; uptime: number; timestamp: string } {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
