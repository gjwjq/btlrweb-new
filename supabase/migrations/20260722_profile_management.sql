-- 관리자 회원 이름 수정 및 회원 본인 이름 수정

create or replace function public.admin_update_user_name(
  target_user_id uuid,
  next_name text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_name text;
begin
  if not public.is_admin() then
    raise exception 'admin access required';
  end if;

  normalized_name := regexp_replace(trim(coalesce(next_name, '')), '\s+', ' ', 'g');
  if normalized_name = '' or length(normalized_name) > 30 then
    raise exception '이름은 1~30자로 입력해 주세요';
  end if;

  update public.profiles
  set name = normalized_name,
      updated_at = now()
  where id = target_user_id;

  if not found then
    raise exception '회원을 찾을 수 없습니다';
  end if;
exception
  when unique_violation then
    raise exception '이미 사용 중인 이름입니다';
end;
$$;

revoke all on function public.admin_update_user_name(uuid, text) from public, anon;
grant execute on function public.admin_update_user_name(uuid, text) to authenticated;

create or replace function public.update_my_name(next_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_name text;
begin
  if auth.uid() is null then
    raise exception 'login required';
  end if;

  normalized_name := regexp_replace(trim(coalesce(next_name, '')), '\s+', ' ', 'g');
  if normalized_name = '' or length(normalized_name) > 30 then
    raise exception '이름은 1~30자로 입력해 주세요';
  end if;

  update public.profiles
  set name = normalized_name,
      updated_at = now()
  where id = auth.uid();

  if not found then
    raise exception '회원 정보를 찾을 수 없습니다';
  end if;
exception
  when unique_violation then
    raise exception '이미 사용 중인 이름입니다';
end;
$$;

revoke all on function public.update_my_name(text) from public, anon;
grant execute on function public.update_my_name(text) to authenticated;
