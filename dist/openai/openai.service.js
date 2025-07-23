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
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const prompt_usage_entity_1 = require("../prompt/prompt_usage.entity");
let OpenaiService = class OpenaiService {
    promptRespository;
    userRespository;
    usageRespository;
    openai;
    promptNumber;
    constructor(promptRespository, userRespository, usageRespository) {
        this.promptRespository = promptRespository;
        this.userRespository = userRespository;
        this.usageRespository = usageRespository;
        this.openai = new openai_1.OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.promptNumber = 0;
    }
    promptCount() {
        return this.promptNumber + 1;
    }
    async sendPrompt(prompt, userId) {
        try {
            const verifyUser = await this.userRespository.findOne({
                where: { id: userId },
            });
            if (!verifyUser) {
                throw new Error("Utilisateur non trouvé");
            }
            let usage = await this.usageRespository.findOne({
                where: {
                    user: { id: userId },
                    date: new Date().toISOString().split('T')[0]
                },
                relations: ['user']
            });
            if (usage && usage.comptage_prompt >= 5) {
                throw new Error("Vous avez atteint la limite des 5 prompts par jour.");
            }
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4.1",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            });
            if (!completion.choices?.[0]?.message?.content) {
                throw new Error("Réponse OpenAI invalide");
            }
            const aiReponse = completion.choices[0].message.content;
            const newPrompt = await this.promptRespository.create({
                message: prompt,
                reponse: aiReponse,
            });
            await this.promptRespository.save(newPrompt);
            if (usage) {
                usage.comptage_prompt += 1;
            }
            else {
                usage = this.usageRespository.create({
                    user: verifyUser,
                    comptage_prompt: 1,
                    date: new Date().toISOString().split('T')[0]
                });
            }
            await this.usageRespository.save(usage);
            return {
                error: false,
                message: " Prompt enregistré avec succès",
                prompt: prompt,
                data: aiReponse,
                limite: `Vous avez utilisé ${usage.comptage_prompt} prompts aujourd'hui. Il vous reste ${5 - usage.comptage_prompt} prompts pour aujourd'hui.`,
            };
        }
        catch (error) {
            console.log("Error:", error);
            throw error;
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