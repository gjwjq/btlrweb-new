-- 도서 표지 이미지 업로드용 공개 Storage 버킷

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'book-covers',
  'book-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can view book covers" on storage.objects;
create policy "public can view book covers"
  on storage.objects for select
  to public
  using (bucket_id = 'book-covers');

drop policy if exists "admins can upload book covers" on storage.objects;
create policy "admins can upload book covers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'book-covers' and public.is_admin());

drop policy if exists "admins can update book covers" on storage.objects;
create policy "admins can update book covers"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'book-covers' and public.is_admin())
  with check (bucket_id = 'book-covers' and public.is_admin());

drop policy if exists "admins can delete book covers" on storage.objects;
create policy "admins can delete book covers"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'book-covers' and public.is_admin());