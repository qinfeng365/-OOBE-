import { PartialType } from '@nestjs/mapped-types';
import { CreateOobePageDto } from './create-oobe-page.dto';

export class UpdateOobePageDto extends PartialType(CreateOobePageDto) {}