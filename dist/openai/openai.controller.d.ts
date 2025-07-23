import { OpenaiService } from './openai.service';
import { DataPromptDto } from './data-prompt.dto';
import { Response } from 'express';
export declare class OpenaiController {
    private readonly openaiService;
    constructor(openaiService: OpenaiService);
    sendPrompt(dataprompt: DataPromptDto, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
}
