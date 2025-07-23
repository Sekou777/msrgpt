import { Prompt } from 'src/prompt/prompt.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Prompt_usage } from 'src/prompt/prompt_usage.entity';
export declare class OpenaiService {
    private readonly promptRespository;
    private readonly userRespository;
    private readonly usageRespository;
    private openai;
    private promptNumber;
    constructor(promptRespository: Repository<Prompt>, userRespository: Repository<User>, usageRespository: Repository<Prompt_usage>);
    promptCount(): number;
    sendPrompt(prompt: string, userId: string): Promise<{
        error: boolean;
        message: string;
        prompt: string;
        data: string;
        limite: string;
    }>;
}
