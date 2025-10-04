import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOobePageDto } from './dto/create-oobe-page.dto';
import { UpdateOobePageDto } from './dto/update-oobe-page.dto';

@Injectable()
export class OobeService {
  constructor(private prisma: PrismaService) {}

  create(createOobePageDto: CreateOobePageDto) {
    return this.prisma.oobePage.create({ data: createOobePageDto });
  }

  findAll() {
    return this.prisma.oobePage.findMany();
  }

  findOne(id: number) {
    return this.prisma.oobePage.findUnique({ where: { id } });
  }

  update(id: number, updateOobePageDto: UpdateOobePageDto) {
    return this.prisma.oobePage.update({
      where: { id },
      data: updateOobePageDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} oobePage`;
  }
}
