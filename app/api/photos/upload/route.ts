// =============================================================
// 파일 위치: mikura-server/app/api/photos/upload/route.ts
// 역할: POST /api/photos/upload
//       프론트엔드로부터 base64 이미지를 받아
//       Supabase Storage에 저장하고 DB에 URL을 기록한 뒤
//       UUID와 다운로드 페이지 URL을 반환합니다.
// =============================================================

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const BUCKET = "photos";

// OPTIONS 요청 (CORS preflight) 처리
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  // 1. 요청 본문 파싱
  let imageData: string;
  try {
    const body = await req.json();
    imageData = body?.imageData;
  } catch {
    return NextResponse.json(
      { error: "요청 본문을 JSON으로 파싱할 수 없습니다." },
      { status: 400 }
    );
  }

  // 2. 입력값 검증
  if (!imageData || typeof imageData !== "string") {
    return NextResponse.json(
      { error: "imageData(string) 필드가 필요합니다." },
      { status: 400 }
    );
  }

  // 3. "data:image/png;base64,XXXX" 형태의 데이터 URL 파싱
  //    정규식으로 mimeType과 실제 base64 문자열을 분리
  const match = imageData.match(/^data:(.+?);base64,(.+)$/);
  if (!match) {
    return NextResponse.json(
      { error: "imageData 형식이 올바르지 않습니다. (data:image/...;base64,... 형태여야 함)" },
      { status: 400 }
    );
  }

  const mimeType = match[1]; // e.g. "image/png"
  const base64Payload = match[2];
  const ext = mimeType.split("/")[1] ?? "png"; // "png" | "jpeg" | ...

  // 4. base64 → Buffer 변환
  const buffer = Buffer.from(base64Payload, "base64");

  // 5. Supabase Storage에 업로드
  //    파일명: <timestamp>_<random>.ext (충돌 방지)
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(fileName, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) {
    console.error("[upload] Storage 업로드 실패:", uploadError.message);
    return NextResponse.json(
      { error: "이미지 업로드에 실패했습니다." },
      { status: 500 }
    );
  }

  // 6. Storage에서 public URL 획득
  const { data: urlData } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(fileName);
  const imageUrl = urlData.publicUrl;

  // 7. photos 테이블에 레코드 삽입
  //    id는 Supabase가 gen_random_uuid()로 자동 생성
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("photos")
    .insert({ image_url: imageUrl })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("[upload] DB 삽입 실패:", insertError?.message);
    // Storage에 올라간 파일은 롤백 시도 (최선)
    await supabaseAdmin.storage.from(BUCKET).remove([fileName]);
    return NextResponse.json(
      { error: "DB 저장에 실패했습니다." },
      { status: 500 }
    );
  }

  // 8. 프론트엔드에 UUID와 다운로드 페이지 URL 반환
  const downloadUrl = `${SITE_URL}/download/${inserted.id}`;
  return NextResponse.json(
    { id: inserted.id, downloadUrl },
    { status: 201 }
  );
}
