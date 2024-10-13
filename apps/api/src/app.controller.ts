import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    throw new Error('test');
  }
  @Get('2')
  getHello2() {
    return this.appService.getHello2();
  }
}
