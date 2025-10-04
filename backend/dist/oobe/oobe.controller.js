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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OobeController = void 0;
const common_1 = require("@nestjs/common");
const oobe_service_1 = require("./oobe.service");
const create_oobe_page_dto_1 = require("./dto/create-oobe-page.dto");
const update_oobe_page_dto_1 = require("./dto/update-oobe-page.dto");
let OobeController = class OobeController {
    oobeService;
    constructor(oobeService) {
        this.oobeService = oobeService;
    }
    create(createOobePageDto) {
        return this.oobeService.create(createOobePageDto);
    }
    findAll() {
        return this.oobeService.findAll();
    }
    findOne(id) {
        return this.oobeService.findOne(id);
    }
    update(id, updateOobePageDto) {
        return this.oobeService.update(id, updateOobePageDto);
    }
    remove(id) {
        return this.oobeService.remove(id);
    }
};
exports.OobeController = OobeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_oobe_page_dto_1.CreateOobePageDto]),
    __metadata("design:returntype", void 0)
], OobeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OobeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OobeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_oobe_page_dto_1.UpdateOobePageDto]),
    __metadata("design:returntype", void 0)
], OobeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OobeController.prototype, "remove", null);
exports.OobeController = OobeController = __decorate([
    (0, common_1.Controller)('oobe-pages'),
    __metadata("design:paramtypes", [oobe_service_1.OobeService])
], OobeController);
//# sourceMappingURL=oobe.controller.js.map