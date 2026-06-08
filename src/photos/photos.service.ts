import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotoSession } from './photo.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(PhotoSession)
    private readonly repo: Repository<PhotoSession>,
  ) {}

  async upload(imageData: string): Promise<PhotoSession> {
    const session = this.repo.create({ imageData, memo: null });
    return this.repo.save(session);
  }

  async updateMemo(id: string, memo: string): Promise<void> {
    const session = await this.repo.findOneBy({ id });
    if (!session) throw new NotFoundException('사진을 찾을 수 없어요');
    session.memo = memo;
    await this.repo.save(session);
  }

  async findOne(id: string): Promise<PhotoSession> {
    const session = await this.repo.findOneBy({ id });
    if (!session) throw new NotFoundException('사진을 찾을 수 없어요');
    return session;
  }
}
