-- profiles.contract_type에 'employee'(정규직) 값 추가
-- 정규직은 은행/계좌번호/계좌이미지만 입력 가능 (사업자 정보 불필요, 앱 레벨에서 검증)

alter table public.profiles
  drop constraint if exists profiles_contract_type_check;

alter table public.profiles
  add constraint profiles_contract_type_check
  check (contract_type in ('business', 'individual', 'employee'));
