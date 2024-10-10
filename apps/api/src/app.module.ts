import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './resources/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './resources/projects/projects.module';
import { LogsTrapModule } from '@logstrap/nest';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ['../../.env'],
      isGlobal: true,
    }),
    ProjectsModule,
    LogsTrapModule.forRoot({
      apiKey: 'key_unzrxstuw5',
      projectId: 'pj_dc5m03j76kbrku4ahn64ober',
      endpoint: 'http://localhost:5000',
      exclude: [
        {
          method: RequestMethod.POST,
          path: `/projects/(.*)`,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
