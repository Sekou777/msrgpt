import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly mailService: MailerService) {}
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * 
   * from: 'NotificationS MSRGPT <noreply@ilimigroup.com>',      to: 'testt@gmail.com',
      subject: `Confimation code otp`,
      text: message,
   */
  async sendEmail(to: string, codeOTP: string): Promise<void> {
    await this.mailService.sendMail({
      from: 'NotificationS MSRGPT <noreply@sgppconseils.com>',
      to: to,
      subject: 'Confimation code otp',
      text: `Votre code de confirmation est : ${codeOTP}`,
    });
  }
}
