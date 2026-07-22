-- BOOK TO LEARN & RUN: ID 로그인, 관리자 회원/도서 관리 마이그레이션
-- 기존 테이블을 삭제하지 않고 필요한 열, 함수, 정책만 추가/교체합니다.

begin;

alter table public.profiles add column if not exists login_id text;

-- 예전 username 열을 사용한 적이 있다면 값을 보존합니다.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'username'
  ) then
    execute 'update public.profiles set login_id = coalesce(login_id, username) where login_id is null';
  end if;
end $$;

update public.profiles
set login_id = lower(trim(login_id)),
    name = regexp_replace(trim(name), '\s+', ' ', 'g')
where login_id is not null or name is not null;

-- 기존 계정에 아이디가 없다면 충돌하지 않는 임시 아이디를 부여합니다.
update public.profiles
set login_id = 'user_' || left(replace(id::text, '-', ''), 12)
where login_id is null or login_id = '';

alter table public.profiles alter column login_id set not null;

create unique index if not exists profiles_login_id_normalized_key
  on public.profiles (lower(trim(login_id)));
create unique index if not exists profiles_name_normalized_key
  on public.profiles (lower(regexp_replace(trim(name), '\s+', ' ', 'g')));

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_login_id_format_check'
  ) then
    alter table public.profiles
      add constraint profiles_login_id_format_check
      check (login_id ~ '^[a-z][a-z0-9_]{3,19}$');
  end if;
end $$;

-- 관리자 계정은 이 이메일 하나로 지정합니다.
update public.profiles p
set role = case
  when lower(u.email) = 'umjunsick6015@gmail.com' then 'admin'
  else 'member'
end
from auth.users u
where u.id = p.id;

-- 신규 Auth 계정의 metadata에서 아이디와 이름을 받아 profile을 만듭니다.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  normalized_login_id text;
  normalized_name text;
begin
  normalized_login_id := lower(trim(coalesce(new.raw_user_meta_data ->> 'login_id', '')));
  normalized_name := regexp_replace(trim(coalesce(new.raw_user_meta_data ->> 'name', '')), '\s+', ' ', 'g');

  if normalized_login_id !~ '^[a-z][a-z0-9_]{3,19}$' then
    raise exception 'invalid login id';
  end if;
  if normalized_name = '' or length(normalized_name) > 30 then
    raise exception 'invalid name';
  end if;

  insert into public.profiles (id, login_id, name, role)
  values (
    new.id,
    normalized_login_id,
    normalized_name,
    case when lower(new.email) = 'umjunsick6015@gmail.com' then 'admin' else 'member' end
  )
  on conflict (id) do update
  set login_id = excluded.login_id,
      name = excluded.name,
      role = excluded.role;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 아이디 로그인 시 Supabase Auth에 넘길 이메일을 찾습니다.
create or replace function public.resolve_login_email(input_login_id text)
returns text
language sql
stable
security definer
set search_path = public, auth
as $$
  select u.email::text
  from public.profiles p
  join auth.users u on u.id = p.id
  where lower(p.login_id) = lower(trim(input_login_id))
  limit 1;
$$;

revoke all on function public.resolve_login_email(text) from public;
grant execute on function public.resolve_login_email(text) to anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- 관리자 회원 목록. Auth 비밀번호는 원문 저장되지 않으므로 반환 대상이 아닙니다.
create or replace function public.admin_list_users()
returns table (
  user_id uuid,
  login_id text,
  name text,
  email text,
  role text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  email_confirmed_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'admin access required';
  end if;

  return query
  select p.id, p.login_id, p.name, u.email::text, p.role::text,
         u.created_at, u.last_sign_in_at, u.email_confirmed_at
  from public.profiles p
  join auth.users u on u.id = p.id
  order by u.created_at desc;
end;
$$;

revoke all on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;

create or replace function public.admin_set_user_role(target_user_id uuid, next_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin access required';
  end if;
  if target_user_id = auth.uid() then
    raise exception '자기 자신의 관리자 권한은 변경할 수 없습니다';
  end if;
  if next_role not in ('member', 'admin') then
    raise exception 'invalid role';
  end if;

  update public.profiles set role = next_role, updated_at = now()
  where id = target_user_id;
end;
$$;

revoke all on function public.admin_set_user_role(uuid, text) from public, anon;
grant execute on function public.admin_set_user_role(uuid, text) to authenticated;

-- 관리자 화면에서 수정하는 도서 필드입니다.
alter table public.books add column if not exists short_description text;
alter table public.books add column if not exists loan_status text not null default '대출 가능';
alter table public.books add column if not exists location text;
alter table public.books add column if not exists call_number text;
alter table public.books add column if not exists return_date date;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.books'::regclass
      and conname = 'books_loan_status_check'
  ) then
    alter table public.books add constraint books_loan_status_check
      check (loan_status in ('대출 가능', '대출 중', '예약 가능'));
  end if;
end $$;

alter table public.profiles enable row level security;
alter table public.books enable row level security;

drop policy if exists "admins can view all profiles" on public.profiles;
create policy "admins can view all profiles"
  on public.profiles for select to authenticated
  using (public.is_admin());

drop policy if exists "admins can insert books" on public.books;
create policy "admins can insert books"
  on public.books for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admins can update books" on public.books;
create policy "admins can update books"
  on public.books for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins can delete books" on public.books;
create policy "admins can delete books"
  on public.books for delete to authenticated
  using (public.is_admin());

grant select on public.books to anon, authenticated;
grant insert, update, delete on public.books to authenticated;
grant select on public.profiles to authenticated;

commit;
