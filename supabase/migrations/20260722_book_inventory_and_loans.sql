-- 도서별 재고 수량과 실제 대출 기록을 Supabase에서 관리합니다.

begin;

alter table public.books
  add column if not exists total_quantity integer not null default 1,
  add column if not exists available_quantity integer not null default 1;

update public.books
set total_quantity = greatest(coalesce(total_quantity, 1), 1),
    available_quantity = greatest(least(coalesce(available_quantity, 1), greatest(coalesce(total_quantity, 1), 1)), 0);

update public.books
set loan_status = case
  when available_quantity > 0 then '대출 가능'
  else '대출 중'
end;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.books'::regclass
      and conname = 'books_total_quantity_check'
  ) then
    alter table public.books
      add constraint books_total_quantity_check check (total_quantity >= 1);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.books'::regclass
      and conname = 'books_available_quantity_check'
  ) then
    alter table public.books
      add constraint books_available_quantity_check
      check (available_quantity between 0 and total_quantity);
  end if;
end $$;

create or replace function public.sync_book_inventory_status()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  borrowed_count integer;
begin
  if tg_op = 'INSERT' then
    new.total_quantity := greatest(coalesce(new.total_quantity, 1), 1);
    new.available_quantity := new.total_quantity;
  elsif new.total_quantity is distinct from old.total_quantity then
    borrowed_count := old.total_quantity - old.available_quantity;
    if new.total_quantity < borrowed_count then
      raise exception '현재 대출 중인 수량보다 전체 수량을 적게 설정할 수 없습니다';
    end if;
    new.available_quantity := new.total_quantity - borrowed_count;
  end if;

  new.loan_status := case
    when new.available_quantity > 0 then '대출 가능'
    else '대출 중'
  end;
  return new;
end;
$$;

drop trigger if exists sync_book_inventory_status on public.books;
create trigger sync_book_inventory_status
  before insert or update of total_quantity, available_quantity
  on public.books
  for each row execute function public.sync_book_inventory_status();

create table if not exists public.book_loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text not null references public.books(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'returned')),
  borrowed_at timestamptz not null default now(),
  due_at timestamptz not null default (now() + interval '14 days'),
  returned_at timestamptz
);

create unique index if not exists book_loans_one_active_per_user_book
  on public.book_loans (user_id, book_id)
  where status = 'active';

create index if not exists book_loans_active_book_idx
  on public.book_loans (book_id)
  where status = 'active';

alter table public.book_loans enable row level security;

drop policy if exists "members can view own book loans" on public.book_loans;
create policy "members can view own book loans"
  on public.book_loans for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

grant select on public.book_loans to authenticated;
revoke insert, update, delete on public.book_loans from anon, authenticated;

create or replace function public.borrow_book(target_book_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  new_loan_id uuid;
  new_due_at timestamptz;
begin
  if current_user_id is null then
    raise exception '로그인이 필요합니다';
  end if;
  if public.is_admin() then
    raise exception '관리자 계정은 도서를 대출할 수 없습니다';
  end if;
  if exists (
    select 1 from public.book_loans
    where user_id = current_user_id
      and book_id = target_book_id
      and status = 'active'
  ) then
    raise exception '이미 대출 중인 도서입니다';
  end if;

  update public.books
  set available_quantity = available_quantity - 1
  where id = target_book_id
    and available_quantity > 0;

  if not found then
    if not exists (select 1 from public.books where id = target_book_id) then
      raise exception '도서 정보를 찾을 수 없습니다';
    end if;
    raise exception '현재 대출 가능한 수량이 없습니다';
  end if;

  insert into public.book_loans (user_id, book_id)
  values (current_user_id, target_book_id)
  returning id, due_at into new_loan_id, new_due_at;

  return jsonb_build_object(
    'loanId', new_loan_id,
    'dueAt', new_due_at
  );
end;
$$;

revoke all on function public.borrow_book(text) from public, anon;
grant execute on function public.borrow_book(text) to authenticated;

create or replace function public.return_book(target_loan_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_book_id text;
begin
  if current_user_id is null then
    raise exception '로그인이 필요합니다';
  end if;

  select book_id into target_book_id
  from public.book_loans
  where id = target_loan_id
    and user_id = current_user_id
    and status = 'active'
  for update;

  if target_book_id is null then
    raise exception '대출 정보를 찾을 수 없습니다';
  end if;

  update public.book_loans
  set status = 'returned', returned_at = now()
  where id = target_loan_id;

  update public.books
  set available_quantity = least(total_quantity, available_quantity + 1)
  where id = target_book_id;
end;
$$;

revoke all on function public.return_book(uuid) from public, anon;
grant execute on function public.return_book(uuid) to authenticated;

commit;