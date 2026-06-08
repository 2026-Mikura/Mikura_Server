import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoSession } from './photo.entity';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoSession])],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
