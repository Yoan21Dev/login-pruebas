import { EmailTemplatesType } from './templates.type';

export type SendEmailOptions = {
  template: EmailTemplatesType;
  to: string;
  cc?: Array<string>;
  from: string;
  subject: string;
  context: { [name: string]: any };
};
