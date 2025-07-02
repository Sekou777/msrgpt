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
exports.OpenaiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const openai_1 = require("openai");
const prompt_entity_1 = require("../prompt/prompt.entity");
const prompt_usage_entity_1 = require("../prompt/prompt_usage.entity");
const user_entity_1 = require("../users/user.entity");
const typeorm_2 = require("typeorm");
let OpenaiService = class OpenaiService {
    promptRepository;
    userRepository;
    usageRepository;
    openai;
    promptNumber;
    constructor(promptRepository, userRepository, usageRepository) {
        this.promptRepository = promptRepository;
        this.userRepository = userRepository;
        this.usageRepository = usageRepository;
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.promptNumber = 0;
    }
    promptCompt() {
        return this.promptNumber + 1;
    }
    async sendPrompt(prompt, userId, res) {
        try {
            const verifyUser = await this.userRepository.findOne({
                where: { id: userId },
            });
            if (!verifyUser) {
                return res.status(common_1.HttpStatus.FORBIDDEN).json({
                    error: true,
                    message: "Utilisateur non trouvé"
                });
            }
            let usage = await this.usageRepository.findOne({
                where: {
                    user: { id: userId },
                    date: new Date().toISOString().split('T')[0]
                },
                relations: ['user']
            });
            if (usage && usage.comptage_prompt >= 5) {
                return res.status(common_1.HttpStatus.FORBIDDEN).json({
                    error: true,
                    message: "Vous avez atteint la limite de 5 prompts par jour."
                });
            }
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4.1',
                messages: [{ role: 'user', content: prompt }],
            });
            if (!response.choices?.[0]?.message?.content) {
                return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: true,
                    message: 'Réponse OpenAI invalide'
                });
            }
            const aiResponse = response.choices[0].message.content;
            const newPrompt = this.promptRepository.create({
                message: prompt,
                reponse: aiResponse
            });
            await this.promptRepository.save(newPrompt);
            if (usage) {
                usage.comptage_prompt += 1;
            }
            else {
                usage = this.usageRepository.create({
                    user: verifyUser,
                    date: new Date().toISOString().split('T')[0],
                    comptage_prompt: 1,
                });
            }
            await this.usageRepository.save(usage);
            return res.status(common_1.HttpStatus.OK).json({
                error: false,
                message: "réquete exécutée avec succès",
                prompt: prompt,
                data: aiResponse,
                limite: `Vous avez utilisé ${usage.comptage_prompt} prompts aujourd'hui. Il vous reste ${5 - usage.comptage_prompt} prompts pour aujourd'hui.`,
            });
        }
        catch (error) {
            console.error('Erreur:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: `Erreur: ${error.message}`
            });
        }
    }
};
exports.OpenaiService = OpenaiService;
exports.OpenaiService = OpenaiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(prompt_entity_1.Prompt)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(prompt_usage_entity_1.Prompt_usage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OpenaiService);
//# sourceMappingURL=openai.service.js.map