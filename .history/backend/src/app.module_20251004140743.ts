import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OobeModule } from './oobe/oobe.module';

@Module({
  imports: [OobeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
