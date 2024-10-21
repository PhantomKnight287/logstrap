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
import { ScheduleModule } from '@nestjs/schedule';
import { EncryptionService } from './services/encryption/encryption.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ['../../.env'],
      isGlobal: true,
    }),
    ProjectsModule,
    // These keys are of my local logstrap instance :)
    LogsTrapModule.forRoot({
      apiKey:
        'key_9ae71fa03dbd60a88eadfc9e95f0de358c630eefcff4807d74fa8b559bb63533',
      projectId: 'pj_dc5m03j76kbrku4ahn64ober',
      endpoint: 'http://localhost:5000',
      exclude: [
        {
          method: RequestMethod.POST,
          path: `/projects/(.*)/logs`,
        },
      ],
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, EncryptionService],
  exports: [],
})
export class AppModule {}
