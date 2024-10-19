import { LogsTrapService } from '@logstrap/nest';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly logger: LogsTrapService) {}
  getHello() {
    return {
      ok: 'idk',
    };
  }
  getHello2() {
    return {
      ok: 'idk',
    };
  }
}
