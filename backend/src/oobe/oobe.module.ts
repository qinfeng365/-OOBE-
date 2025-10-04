import { Module } from '@nestjs/common';
import { OobeController } from './oobe.controller';
import { OobeService } from './oobe.service';

@Module({
  controllers: [OobeController],
  providers: [OobeService]
})
export class OobeModule {}
