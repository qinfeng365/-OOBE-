"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OobeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let OobeService = class OobeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createOobePageDto) {
        return this.prisma.oobePage.create({ data: createOobePageDto });
    }
    findAll() {
        return this.prisma.oobePage.findMany();
    }
    findOne(id) {
        return this.prisma.oobePage.findUnique({ where: { id } });
    }
    update(id, updateOobePageDto) {
        return this.prisma.oobePage.update({
            where: { id },
            data: updateOobePageDto,
        });
    }
    remove(id) {
        return this.prisma.oobePage.delete({ where: { id } });
    }
};
exports.OobeService = OobeService;
exports.OobeService = OobeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OobeService);
//# sourceMappingURL=oobe.service.js.map