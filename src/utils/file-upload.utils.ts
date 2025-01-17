import { extname } from 'path';
import { nanoid } from 'nanoid';
import { BadRequestException } from '@nestjs/common';

export const editFileName = (req, file, callback) => {
  const fileExtName = extname(file.originalname);
  callback(null, `${nanoid(64)}${fileExtName}`);
};

export const fileFilter = (req: any, file: any, callback: any) => {
  if (
    !file.originalname.match(
      /\.(pdf|docx|xlsx|png|jpeg|jpg|mp4|mkv|avi|mpeg|flv)$/
    )
  ) {
    return callback(
      new BadRequestException('Formato de archivo irreconosible'),
      false
    );
  }
  callback(null, true);
};
