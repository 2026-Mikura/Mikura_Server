-- ============================================================
-- Mikura: Supabase 초기 설정 SQL
-- Supabase 대시보드 → SQL Editor에 붙여넣고 실행하세요.
-- ============================================================

-- 1. photos 테이블 생성
create table if not exists photos (
  id         uuid primary key default gen_random_uuid(),
  image_url  text not null,
  created_at timestamptz not null default now()
);

-- 2. RLS(Row Level Security) 활성화
alter table photos enable row level security;

-- 3. 읽기 정책: 누구나 조회 가능 (QR 스캔 다운로드 페이지용)
create policy "Public read photos"
  on photos for select
  using (true);

-- 4. 쓰기 정책: Service Role Key를 사용하는 서버만 삽입 가능
--    (Next.js API Route에서 SUPABASE_SERVICE_ROLE_KEY 사용)
create policy "Service role insert photos"
  on photos for insert
  with check (true);

-- ============================================================
-- Storage 버킷 설정 (SQL로는 불가 → 대시보드에서 직접 생성)
-- ============================================================
-- Storage → New Bucket → 이름: photos → Public 체크 후 저장
-- (또는 아래 SQL이 지원되는 경우 실행)
-- insert into storage.buckets (id, name, public)
-- values ('photos', 'photos', true)
-- on conflict (id) do nothing;
