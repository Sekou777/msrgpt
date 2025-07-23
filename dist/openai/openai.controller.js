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
exports.OpenaiController = void 0;
const common_1 = require("@nestjs/common");
const openai_service_1 = require("./openai.service");
const data_prompt_dto_1 = require("./data-prompt.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var Option;
(function (Option) {
    Option["Scan"] = "Scan";
    Option["Footprint"] = "Footprint";
    Option["Enum"] = "Enum";
})(Option || (Option = {}));
let OpenaiController = class OpenaiController {
    openaiService;
    constructor(openaiService) {
        this.openaiService = openaiService;
    }
    async sendPrompt(dataprompt, res, req) {
        try {
            console.log(dataprompt);
            console.log(Option.Scan.toString());
            if (dataprompt.option != Option.Scan.toString() && dataprompt.option != Option.Footprint.toString()
                && dataprompt.option != Option.Enum.toString()) {
                console.log('ereur de saisir');
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    error: true,
                    message: "erreur de saisie, veuillez entrer l'un de ses mots: Scan, Footprint ou Enum"
                });
            }
            let DataPromptOption;
            if (dataprompt.option == "Scan") {
                DataPromptOption = "faire un scanning ";
            }
            else if (dataprompt.option == "Footprint") {
                DataPromptOption = "faire un footprinting";
            }
            else if (dataprompt.option == "Enum") {
                DataPromptOption = "faire une Enumeration";
            }
            const fullPrompt = `Option sélectionnée : ${DataPromptOption}. Action : ${dataprompt.prompt}.\nRetourne uniquement la commande à exécuter sans aucun commentaire ni explication.`;
            const response = await this.openaiService.sendPrompt(fullPrompt, req.user.userId);
            return res.status(common_1.HttpStatus.OK).json(response);
        }
        catch (error) {
            console.error("Erreur lors de l'envoi du pompt:", error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: "Echec d'envoi du prompt"
            });
        }
    }
};
exports.OpenaiController = OpenaiController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/chat'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [data_prompt_dto_1.DataPromptDto, Object, Object]),
    __metadata("design:returntype", Promise)
], OpenaiController.prototype, "sendPrompt", null);
exports.OpenaiController = OpenaiController = __decorate([
    (0, common_1.Controller)('openai'),
    __metadata("design:paramtypes", [openai_service_1.OpenaiService])
], OpenaiController);
//# sourceMappingURL=openai.controller.js.map