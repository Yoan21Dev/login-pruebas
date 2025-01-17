import { ApiProperty } from '@nestjs/swagger';

export class UploadImageUserDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  image?: Express.Multer.File;
}
