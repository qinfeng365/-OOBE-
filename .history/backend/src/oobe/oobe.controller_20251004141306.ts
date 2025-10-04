import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { OobeService } from './oobe.service';
import { CreateOobePageDto } from './dto/create-oobe-page.dto';
import { UpdateOobePageDto } from './dto/update-oobe-page.dto';

@Controller('oobe-pages')
export class OobeController {
  constructor(private readonly oobeService: OobeService) {}

  @Post()
  create(@Body() createOobePageDto: CreateOobePageDto) {
    return this.oobeService.create(createOobePageDto);
  }

  @Get()
  findAll() {
    return this.oobeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.oobeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOobePageDto: UpdateOobePageDto) {
    return this.oobeService.update(id, updateOobePageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oobeService.remove(+id);
  }
}
