import { DataPromptDto } from './data-prompt.dto';
import { OpenaiService } from './openai.service';
import { Response } from 'express';
export declare class OpenaiController {
    private readonly openaiService;
    constructor(openaiService: OpenaiService);
    sendPrompt(dataPrompt: DataPromptDto, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
}
