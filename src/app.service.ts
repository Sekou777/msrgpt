import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly mailService: MailerService) {}
  getHello(): string {
    return 'Hello World!';
  }

 
  async sendEmail(to: string, codeOTP: string): Promise<void> {
    await this.mailService.sendMail({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: 'Confimation code otp',
      text: `Votre code de confirmation est : ${codeOTP}`,
    });
  }
}
