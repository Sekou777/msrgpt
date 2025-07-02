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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(userData, res) {
        if (!userData.email.includes('@gmail.com')) {
            console.log(userData.email);
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                error: true,
                message: "Uniquement des email de gmail"
            });
        }
        try {
            const verifyEmail = await this.userRepository.findOne({ where: {
                    email: userData.email
                } });
            console.log("user verify: ", verifyEmail);
            if (verifyEmail) {
                return res.status(common_1.HttpStatus.CONFLICT).json({
                    error: true,
                    message: "Email existe déjà"
                });
            }
            const verifyPseudo = await this.userRepository.findOne({ where: {
                    pseudo: userData.pseudo
                } });
            console.log("user verify: ", verifyEmail);
            if (verifyPseudo) {
                return res.status(common_1.HttpStatus.CONFLICT).json({
                    error: true,
                    message: "Pseudo existe déjà"
                });
            }
            const saltOrRounds = 10;
            console.log('send password: ', userData.password);
            const password = userData.password;
            const hash = await bcrypt.hash(password, saltOrRounds);
            userData.password = hash;
            console.log('password hash: ', userData.password);
            const dataSave = await this.userRepository.save(userData);
            if (!dataSave) {
                console.log(dataSave);
                return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: true,
                    message: `Erreur survenue lors de l'enregistrement à la base de données`
                });
            }
            return res.status(common_1.HttpStatus.OK).json({
                error: false,
                message: "Valeur enregistrée avec succès",
                data: dataSave
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
    async getAllUser() {
        const dataUsers = await this.userRepository.find();
        const countUser = await this.userRepository.count();
        return {
            error: false,
            message: "Valeur enregistrée avec succès",
            data: dataUsers,
            nbUsers: countUser
        };
    }
    async updateProfile(userData) {
        const dataUser = await this.userRepository.findBy({ id: userData.idUsers });
        console.log(dataUser);
        dataUser[0].fullname = userData.fullname ?? dataUser[0].fullname;
        dataUser[0].pseudo = userData.pseudo ?? dataUser[0].pseudo;
        dataUser[0].email = userData.email ?? dataUser[0].email;
        dataUser[0].telNumber = userData.telNumber ?? dataUser[0].telNumber;
        const saveData = await this.userRepository.save(dataUser[0]);
        return {
            error: false,
            message: "Utilisateur mis a jour avec succes",
            data: saveData
        };
    }
    async deleteProfile(idUsers) {
        const deleteProfile = await this.userRepository.delete({ id: idUsers });
        console.log("Utilisateur supprimé: ", deleteProfile);
        return {
            error: false,
            message: "Utilisateurs supprimé avec succes"
        };
    }
    async UserInfo(id, res) {
        try {
            const userInfo = await this.userRepository.findOne({
                where: { id: id },
            });
            if (!userInfo) {
                return res.status(common_1.HttpStatus.NOT_FOUND).json({
                    error: true,
                    message: "Utilisateur non trouvé"
                });
            }
            return res.status(common_1.HttpStatus.OK).json({
                error: false,
                message: "Informations utilisateur récupérées avec succès",
                data: userInfo
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: `Erreur lors de la récupération des informations utilisateur: ${error.message}`
            });
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map