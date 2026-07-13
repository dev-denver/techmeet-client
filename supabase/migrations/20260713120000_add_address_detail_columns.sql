-- 주소 검색 결과(도로명주소)와 사용자가 직접 입력하는 상세주소(동/호수 등)를 별도 컬럼으로 분리 저장.
-- 기존에는 하나의 address 문자열로 합쳐 저장해 재조회 시 상세주소를 복원할 수 없었음.

alter table public.profiles
  add column address_detail text,
  add column business_address_detail text;
