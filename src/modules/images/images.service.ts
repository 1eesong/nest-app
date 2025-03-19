import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { S3Service } from '../s3/s3.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private S3Service: S3Service,
  ) {}

  async uploadImage(file: Express.Multer.File) {
    const filePath = 'image';
    const resultUrl = await this.S3Service.uploadFile(file, 'image');
    const image = this.imageRepository.create({
      imageUrl: resultUrl,
      filePath,
    });
    await this.imageRepository.save(image);
    return { resultUrl };
  }
}
