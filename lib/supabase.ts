import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 환경변수가 없습니다. " +
      ".env.local 파일을 확인하세요."
  );
}

// Service Role 클라이언트: RLS를 우회해 서버 측 API Route에서만 사용
// 절대 브라우저에 노출하지 말 것
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
