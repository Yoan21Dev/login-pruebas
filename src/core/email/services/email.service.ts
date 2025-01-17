import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailOptions } from '../types/email-service.type';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendEmail(sendEmailOptions: SendEmailOptions) {
    const mailSent = await this.mailerService.sendMail(sendEmailOptions);

    return mailSent;
  }
}
