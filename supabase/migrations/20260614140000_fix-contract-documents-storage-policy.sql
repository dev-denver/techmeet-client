-- ------------------------------------------------------------
-- Storage: contract-documents 버킷/정책 idempotent 보정
-- (버킷은 생성되었으나 RLS 정책이 누락된 환경 대응)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('contract-documents', 'contract-documents', false)
  on conflict do nothing;

drop policy if exists "본인 계약서류 업로드" on storage.objects;
create policy "본인 계약서류 업로드" on storage.objects
  for insert with check (
    bucket_id = 'contract-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "본인 계약서류 다운로드" on storage.objects;
create policy "본인 계약서류 다운로드" on storage.objects
  for select using (
    bucket_id = 'contract-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "본인 계약서류 삭제" on storage.objects;
create policy "본인 계약서류 삭제" on storage.objects
  for delete using (
    bucket_id = 'contract-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
