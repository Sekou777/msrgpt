import { Prompt } from 'src/prompt/prompt.entity';
import { Prompt_usage } from 'src/prompt/prompt_usage.entity';
export declare class User {
    id: string;
    fullname: string;
    pseudo: string;
    email: string;
    password: string;
    telNumber: string;
    countPrompt: number;
    lastPromptDate: Date;
    isActive: boolean;
    created_at: string;
    codeOTP: string;
    emailVerify: boolean;
    prompts: Prompt[];
    prompt_usage: Prompt_usage[];
}
