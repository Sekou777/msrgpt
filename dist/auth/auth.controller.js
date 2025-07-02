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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const auth_service_1 = require("./auth.service");
const connexion_user_dto_1 = require("./connexion-user.dto");
const auth_service_revision_1 = require("./auth.service.revision");
const app_service_1 = require("../app.service");
let AuthController = class AuthController {
    authService;
    authServiceRevision;
    appService;
    constructor(authService, authServiceRevision, appService) {
        this.authService = authService;
        this.authServiceRevision = authServiceRevision;
        this.appService = appService;
    }
    CreateUser(userData, res) {
        return this.authService.createUser(userData.fullname, userData.pseudo, userData.email, userData.password, res);
    }
    loginUser(userData, res) {
        return this.authService.connexionUser(userData.email, userData.password, res);
    }
    otpVerify(dataUser, res) {
        console.log("email:", dataUser["email"]);
        return this.authService.verifyOTP(dataUser["codeOTP"], dataUser["email"], res);
    }
    generateOTP(name) {
        const otp = this.authServiceRevision.genereOpt(8);
        console.log("otp:", otp);
        return {
            otp: otp,
            message: `L'OTP a été généré pour ${name}`
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('inscription'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "CreateUser", null);
__decorate([
    (0, common_1.Post)('connexion'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [connexion_user_dto_1.connexionUserDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Post)('otp/verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "otpVerify", null);
__decorate([
    (0, common_1.Post)('otp/generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "generateOTP", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        auth_service_revision_1.authServiceRevision,
        app_service_1.AppService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map