import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateOobePageDto {
  @IsInt()
  @IsNotEmpty()
  pageNumber: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}