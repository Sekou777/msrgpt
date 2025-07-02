import { User } from 'src/users/user.entity';
export declare class Prompt {
    id: string;
    message: string;
    reponse: string;
    created_at: string;
    comptage_prompt: number;
    user: User;
}
