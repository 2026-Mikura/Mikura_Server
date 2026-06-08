// =============================================================
// 파일 위치: mikura-server/app/download/[uuid]/page.tsx
// 역할: QR 스캔 후 관람객이 도달하는 다운로드 페이지
//       서버 컴포넌트에서 Supabase DB를 조회하고
//       클라이언트 컴포넌트로 이미지 URL을 넘깁니다.
// =============================================================

import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import DownloadClient from "./DownloadClient";

interface Props {
  // Next.js 15: params는 Promise로 전달됨
  params: Promise<{ uuid: string }>;
}

export default async function DownloadPage({ params }: Props) {
  const { uuid } = await params;

  // UUID 형식 검증 (간단한 정규식)
  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_REGEX.test(uuid)) notFound();

  // Supabase DB에서 해당 UUID의 레코드 조회
  const { data, error } = await supabaseAdmin
    .from("photos")
    .select("id, image_url, created_at")
    .eq("id", uuid)
    .single();

  if (error || !data) notFound();

  return <DownloadClient imageUrl={data.image_url} photoId={data.id} />;
}
