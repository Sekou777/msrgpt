import { MailerService } from '@nestjs-modules/mailer';
export declare class AppService {
    private readonly mailService;
    constructor(mailService: MailerService);
    getHello(): string;
    sendEmail(to: string, codeOTP: string): Promise<void>;
}
