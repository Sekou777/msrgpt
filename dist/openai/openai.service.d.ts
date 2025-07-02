import { Response } from 'express';
import { Prompt } from 'src/prompt/prompt.entity';
import { Prompt_usage } from 'src/prompt/prompt_usage.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
export declare class OpenaiService {
    private readonly promptRepository;
    private readonly userRepository;
    private readonly usageRepository;
    private openai;
    private promptNumber;
    constructor(promptRepository: Repository<Prompt>, userRepository: Repository<User>, usageRepository: Repository<Prompt_usage>);
    promptCompt(): number;
    sendPrompt(prompt: string, userId: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
