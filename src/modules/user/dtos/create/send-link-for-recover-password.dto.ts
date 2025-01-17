import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendLinkForRecoverPasswordDto {
  @ApiProperty()
  @IsString()
  email: string;
}
