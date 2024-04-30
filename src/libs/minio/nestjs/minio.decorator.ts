import { Inject } from '@nestjs/common';
import { MinioConstants } from './minio.constants';

export const InjectMinioClient = (): ReturnType<typeof Inject> => Inject(MinioConstants.clientToken);

export const InjectMinioOpts = (): ReturnType<typeof Inject> => Inject(MinioConstants.optionsToken);
