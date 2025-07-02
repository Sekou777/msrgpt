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
const data_prompt_dto_1 = require("./data-prompt.dto");
const openai_service_1 = require("./openai.service");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var OptionEnum;
(function (OptionEnum) {
    OptionEnum["SCAN"] = "scan";
    OptionEnum["FOOTPRINT"] = "footprint";
    OptionEnum["ENUM"] = "enum";
})(OptionEnum || (OptionEnum = {}));
let OpenaiController = class OpenaiController {
    openaiService;
    constructor(openaiService) {
        this.openaiService = openaiService;
    }
    async sendPrompt(dataPrompt, res, req) {
        try {
            console.log(req.user);
            if (OptionEnum.SCAN != dataPrompt.option && OptionEnum.FOOTPRINT != dataPrompt.option && OptionEnum.ENUM != dataPrompt.option) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    error: true,
                    message: "Option invalide. Les ooptions valides sont 'scan', 'footPrint' ou 'enum'."
                });
            }
            let DataPromptOption;
            if (dataPrompt.option == OptionEnum.SCAN) {
                DataPromptOption = "Faire un scanning";
            }
            else if (dataPrompt.option == OptionEnum.FOOTPRINT) {
                DataPromptOption = "Faire un footprint";
            }
            else if (dataPrompt.option == OptionEnum.ENUM) {
                DataPromptOption = "Faire une enumération";
            }
            const fullPrompt = `Option sélectionnée : ${DataPromptOption}. Action : ${dataPrompt.prompt}.\nRetourne uniquement la commande à exécuter sans aucun commentaire ni explication.`;
            return this.openaiService.sendPrompt(fullPrompt, req.user.userId, res);
        }
        catch (error) {
            console.error("Erreur lors de l'envoi du pompt:", error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Echec d'envoi du prompt" });
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