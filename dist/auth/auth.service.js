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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
const bcrypt = require("bcrypt");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const app_service_1 = require("../app.service");
let AuthService = class AuthService {
    userRepository;
    jwtService;
    appService;
    constructor(userRepository, jwtService, appService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.appService = appService;
    }
    genereOTp(length = 6) {
        let Codeotp = "";
        for (let i = 0; i < length; i++) {
            Codeotp += Math.floor(Math.random() * 10);
        }
        return Codeotp;
    }
    async verifyOTP(codeOTP, email, res) {
        if (!email.endsWith('@gmail.com')) {
            console.log(email);
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                error: true,
                message: "Uniquement des email de gmail"
            });
        }
        try {
            const userVerify = await this.userRepository.findOne({ where: { email } });
            if (!userVerify) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    error: true,
                    message: "Mail fourni invalide !"
                });
            }
            if (userVerify.codeOTP !== codeOTP) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    error: true,
                    message: "le code otp invalide !"
                });
            }
            const updateData = this.userRepository.update(userVerify.id, {
                emailVerify: true,
                codeOTP: ""
            });
            if (!updateData) {
                return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: true,
                    message: " Une erreur est survenue !"
                });
            }
            return res.status(common_1.HttpStatus.OK).json({
                error: false,
                message: "Verification effectuée avec succes."
            });
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: `Erreur survenue:  ${error.message}`
            });
        }
    }
    async createUser(fullname, pseudo, email, password, res) {
        if (!email.endsWith('@gmail.com')) {
            console.log(email);
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                error: true,
                message: "Uniquement des email de gmail"
            });
        }
        try {
            const verifyEmail = await this.userRepository.findOne({ where: {
                    email: email
                } });
            console.log("user verify: ", verifyEmail);
            if (verifyEmail) {
                return res.status(common_1.HttpStatus.CONFLICT).json({
                    error: true,
                    message: "Email existe déjà"
                });
            }
            const verifyUser = await this.userRepository.findOne({ where: {
                    fullname: fullname
                } });
            console.log("user verify: ", verifyUser);
            if (verifyUser) {
                return res.status(common_1.HttpStatus.CONFLICT).json({
                    error: true,
                    message: "User existe déjà"
                });
            }
            const verifyPseudo = await this.userRepository.findOne({ where: {
                    pseudo: pseudo
                } });
            console.log("pseudo verify: ", verifyPseudo);
            if (verifyPseudo) {
                return res.status(common_1.HttpStatus.CONFLICT).json({
                    error: true,
                    message: "Pseudo existe déjà"
                });
            }
            const saltOrRounds = 10;
            console.log('send password: ', password);
            const passwordUser = password;
            const hash = await bcrypt.hash(passwordUser, saltOrRounds);
            password = hash;
            const codeOTP = this.genereOTp();
            const saveData = this.userRepository.create({ fullname, pseudo, email, password, codeOTP });
            const saveUser = await this.userRepository.save(saveData);
            if (!saveUser) {
                return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: true,
                    message: 'Enregistrement non effectué !'
                });
            }
            await this.appService.sendEmail(email, codeOTP);
            delete saveData.password;
            delete saveData.codeOTP;
            return res.status(common_1.HttpStatus.CREATED).json({
                error: false,
                message: 'Enregistrement effectué.',
                data: saveData
            });
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: `Erreur survenue:  ${error.message}`
            });
        }
    }
    async connexionUser(email, password, res) {
        if (!email.endsWith('@gmail.com')) {
            console.log(email);
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                error: true,
                message: "Uniquement des email "
            });
        }
        try {
            const verifyMail = await this.userRepository.findOne({ where: {
                    email: email
                } });
            if (!verifyMail) {
                return res.status(common_1.HttpStatus.CONFLICT).json({
                    error: false,
                    message: "Email inexitant !"
                });
            }
            const isMatch = await bcrypt.compare(password, verifyMail.password);
            if (!isMatch) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    error: false,
                    message: "Connexion echoué ! réessayer "
                });
            }
            const payload = { sub: verifyMail.id, username: verifyMail.pseudo };
            const token = await this.jwtService.signAsync(payload);
            return res.status(common_1.HttpStatus.OK).json({
                error: false,
                message: 'Conneion réussi',
                token: token
            });
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: `Erreur survenue:  ${error.message}`
            });
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        app_service_1.AppService])
], AuthService);
//# sourceMappingURL=auth.service.js.map