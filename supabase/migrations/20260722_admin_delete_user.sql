-- 관리자 화면에서 Supabase Auth 회원을 완전히 삭제하는 함수

create or replace function public.admin_delete_user(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'admin access required';
  end if;

  if target_user_id = auth.uid() then
    raise exception '자기 자신의 관리자 계정은 삭제할 수 없습니다';
  end if;

  if not exists (select 1 from auth.users where id = target_user_id) then
    raise exception '삭제할 회원을 찾을 수 없습니다';
  end if;

  delete from public.favorites where user_id = target_user_id;
  delete from public.loans where user_id = target_user_id;
  delete from public.reservations where user_id = target_user_id;
  delete from public.profiles where id = target_user_id;
  delete from auth.users where id = target_user_id;
end;
$$;

revoke all on function public.admin_delete_user(uuid) from public, anon;
grant execute on function public.admin_delete_user(uuid) to authenticated;
