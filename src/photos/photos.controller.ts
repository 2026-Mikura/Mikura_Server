import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Res,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  /** 사진 업로드 → UUID + 다운로드 URL 반환 */
  @Post('upload')
  @HttpCode(201)
  async upload(@Body() body: { imageData: string }) {
    if (!body.imageData?.startsWith('data:image/')) {
      throw new BadRequestException('유효한 이미지 데이터가 아닙니다');
    }

    const session = await this.photosService.upload(body.imageData);
    const publicUrl = process.env.PUBLIC_URL ?? 'http://localhost:3000';

    return {
      id: session.id,
      downloadUrl: `${publicUrl}/photos/${session.id}/download`,
    };
  }

  /** 포토북 메모 저장 */
  @Patch(':id/memo')
  @HttpCode(200)
  async updateMemo(
    @Param('id') id: string,
    @Body() body: { memo: string },
  ) {
    await this.photosService.updateMemo(id, body.memo ?? '');
    return { ok: true };
  }

  /** QR 스캔 → 이미지 파일 다운로드 */
  @Get(':id/download')
  async download(@Param('id') id: string, @Res() res: Response) {
    const session = await this.photosService.findOne(id);

    // "data:image/jpeg;base64,XXX" → 바이너리 변환
    const matches = session.imageData.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw new BadRequestException('저장된 이미지 형식이 올바르지 않습니다');
    }

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const ext = mimeType.includes('png') ? 'png' : 'jpg';

    res.setHeader('Content-Type', mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="mikura_${id.slice(0, 8)}.${ext}"`,
    );
    res.send(buffer);
  }
}
