import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OobeModule } from './oobe/oobe.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [OobeModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
