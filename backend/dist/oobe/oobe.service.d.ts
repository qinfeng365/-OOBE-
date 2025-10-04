import { PrismaService } from '../prisma.service';
import { CreateOobePageDto } from './dto/create-oobe-page.dto';
import { UpdateOobePageDto } from './dto/update-oobe-page.dto';
export declare class OobeService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createOobePageDto: CreateOobePageDto): import("@prisma/client").Prisma.Prisma__OobePageClient<{
        pageNumber: number;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        pageNumber: number;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__OobePageClient<{
        pageNumber: number;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateOobePageDto: UpdateOobePageDto): import("@prisma/client").Prisma.Prisma__OobePageClient<{
        pageNumber: number;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__OobePageClient<{
        pageNumber: number;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
