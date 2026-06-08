import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosModule } from './photos/photos.module';
import { PhotoSession } from './photos/photo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'mikura',
      entities: [PhotoSession],
      synchronize: true, // 개발용: 엔티티 변경 시 자동으로 테이블 생성/수정
    }),
    PhotosModule,
  ],
})
export class AppModule {}
