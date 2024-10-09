import { LogsTrapService } from '@logstrap/nest';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly logger: LogsTrapService) {}
  getHello() {
    this.logger.log('sup buddy');
    return {
      ok: 'idk',
    };
  }
  getHello2() {
    this.logger.warn('sup buddy 2');
    this.logger.warn('sup buddy 2');
    this.logger.warn('sup buddy 2');
    this.logger.warn('sup buddy 2');
    this.logger.warn('sup buddy 2');
    this.logger.warn('sup buddy 2');

    return {
      ok: 'idk',
    };
  }
}
