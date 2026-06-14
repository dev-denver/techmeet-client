-- ------------------------------------------------------------
-- profiles: 계약 정보 (계약형태/사업자정보/계좌정보) 컬럼 추가
-- ------------------------------------------------------------
alter table public.profiles
  add column if not exists contract_type text
    check (contract_type in ('business', 'individual')),       -- 계약 형태 (사업자/3.3%)
  add column if not exists business_name text,                  -- 사업자명
  add column if not exists business_number text,                -- 사업자 번호 (000-00-00000)
  add column if not exists business_address text,               -- 사업장 주소
  add column if not exists business_registration_file_path text, -- 사업자등록증 파일 경로
  add column if not exists business_registration_file_name text, -- 사업자등록증 원본 파일명
  add column if not exists bank_name text,                      -- 은행명
  add column if not exists bank_account_number text,            -- 계좌번호
  add column if not exists bank_account_image_path text,        -- 계좌 이미지 파일 경로
  add column if not exists bank_account_image_name text;        -- 계좌 이미지 원본 파일명

-- ------------------------------------------------------------
-- Storage: contract-documents 버킷 (사업자등록증, 계좌 이미지)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('contract-documents', 'contract-documents', false)
  on conflict do nothing;

create policy "본인 계약서류 업로드" on storage.objects
  for insert with check (
    bucket_id = 'contract-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "본인 계약서류 다운로드" on storage.objects
  for select using (
    bucket_id = 'contract-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "본인 계약서류 삭제" on storage.objects
  for delete using (
    bucket_id = 'contract-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
