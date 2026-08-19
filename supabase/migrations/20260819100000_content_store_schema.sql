-- F-01 content store: keyed copy, pages registry, nav slots, articles, media URLs.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.site_copy (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now(),
  constraint site_copy_key_format check (
    key ~ '^osk\.[a-z0-9]+(_[a-z0-9]+)*(\.[a-z0-9]+(_[a-z0-9]+)*)+$'
  )
);

create table public.pages (
  slug text primary key,
  path text not null unique,
  kind text not null,
  visibility text not null,
  constraint pages_kind_check check (kind in ('content', 'stub', 'form')),
  constraint pages_visibility_check check (visibility in ('hidden', 'displayed', 'pinned'))
);

create table public.nav_slots (
  id text primary key,
  parent_id text references public.nav_slots (id) on delete cascade,
  placement text not null,
  sort_order int not null,
  label_key text not null references public.site_copy (key) on delete restrict,
  href_key text not null references public.site_copy (key) on delete restrict,
  constraint nav_slots_placement_check check (placement in ('primary', 'footer', 'chrome'))
);

create unique index nav_slots_placement_parent_sort_idx
  on public.nav_slots (placement, coalesce(parent_id, ''), sort_order);

create table public.articles (
  slug text primary key,
  visibility text not null,
  published_at timestamptz not null,
  sort_order int not null,
  title_key text not null references public.site_copy (key) on delete restrict,
  summary_key text not null references public.site_copy (key) on delete restrict,
  body_key text not null references public.site_copy (key) on delete restrict,
  constraint articles_visibility_check check (visibility in ('hidden', 'displayed', 'pinned'))
);

create table public.media (
  id text primary key,
  kind text not null,
  page_slug text references public.pages (slug) on delete cascade,
  article_slug text references public.articles (slug) on delete cascade,
  sort_order int not null,
  url text not null,
  alt_key text not null references public.site_copy (key) on delete restrict,
  constraint media_kind_check check (kind in ('gallery', 'article')),
  constraint media_parent_xor check (
    (page_slug is not null and article_slug is null)
    or (page_slug is null and article_slug is not null)
  )
);

-- ---------------------------------------------------------------------------
-- RLS helper
-- ---------------------------------------------------------------------------

create or replace function public.is_site_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'site_editor', false);
$$;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.site_copy enable row level security;
alter table public.pages enable row level security;
alter table public.nav_slots enable row level security;
alter table public.articles enable row level security;
alter table public.media enable row level security;

-- site_copy: anon + authenticated read all; site_editor write
create policy "site_copy_select_anon"
  on public.site_copy for select to anon using (true);

create policy "site_copy_select_authenticated"
  on public.site_copy for select to authenticated using (true);

create policy "site_copy_insert_site_editor"
  on public.site_copy for insert to authenticated
  with check (public.is_site_editor());

create policy "site_copy_update_site_editor"
  on public.site_copy for update to authenticated
  using (public.is_site_editor()) with check (public.is_site_editor());

create policy "site_copy_delete_site_editor"
  on public.site_copy for delete to authenticated
  using (public.is_site_editor());

-- pages: hide hidden rows from anon/authenticated readers
create policy "pages_select_anon"
  on public.pages for select to anon using (visibility <> 'hidden');

create policy "pages_select_authenticated"
  on public.pages for select to authenticated using (visibility <> 'hidden');

create policy "pages_insert_site_editor"
  on public.pages for insert to authenticated
  with check (public.is_site_editor());

create policy "pages_update_site_editor"
  on public.pages for update to authenticated
  using (public.is_site_editor()) with check (public.is_site_editor());

create policy "pages_delete_site_editor"
  on public.pages for delete to authenticated
  using (public.is_site_editor());

-- nav_slots: full read for anon + authenticated
create policy "nav_slots_select_anon"
  on public.nav_slots for select to anon using (true);

create policy "nav_slots_select_authenticated"
  on public.nav_slots for select to authenticated using (true);

create policy "nav_slots_insert_site_editor"
  on public.nav_slots for insert to authenticated
  with check (public.is_site_editor());

create policy "nav_slots_update_site_editor"
  on public.nav_slots for update to authenticated
  using (public.is_site_editor()) with check (public.is_site_editor());

create policy "nav_slots_delete_site_editor"
  on public.nav_slots for delete to authenticated
  using (public.is_site_editor());

-- articles: hide hidden from anon/authenticated
create policy "articles_select_anon"
  on public.articles for select to anon using (visibility <> 'hidden');

create policy "articles_select_authenticated"
  on public.articles for select to authenticated using (visibility <> 'hidden');

create policy "articles_insert_site_editor"
  on public.articles for insert to authenticated
  with check (public.is_site_editor());

create policy "articles_update_site_editor"
  on public.articles for update to authenticated
  using (public.is_site_editor()) with check (public.is_site_editor());

create policy "articles_delete_site_editor"
  on public.articles for delete to authenticated
  using (public.is_site_editor());

-- media: gallery rows always visible; article-linked only when article not hidden
create policy "media_select_anon"
  on public.media for select to anon
  using (
    article_slug is null
    or exists (
      select 1 from public.articles a
      where a.slug = media.article_slug and a.visibility <> 'hidden'
    )
  );

create policy "media_select_authenticated"
  on public.media for select to authenticated
  using (
    article_slug is null
    or exists (
      select 1 from public.articles a
      where a.slug = media.article_slug and a.visibility <> 'hidden'
    )
  );

create policy "media_insert_site_editor"
  on public.media for insert to authenticated
  with check (public.is_site_editor());

create policy "media_update_site_editor"
  on public.media for update to authenticated
  using (public.is_site_editor()) with check (public.is_site_editor());

create policy "media_delete_site_editor"
  on public.media for delete to authenticated
  using (public.is_site_editor());

-- ---------------------------------------------------------------------------
-- Storage bucket (empty; gallery URLs remain static paths for now)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('osk-media', 'osk-media', true)
on conflict (id) do update set public = excluded.public;

create policy "osk_media_select_anon"
  on storage.objects for select to anon
  using (bucket_id = 'osk-media');

create policy "osk_media_select_authenticated"
  on storage.objects for select to authenticated
  using (bucket_id = 'osk-media');

create policy "osk_media_insert_site_editor"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'osk-media' and public.is_site_editor());

create policy "osk_media_update_site_editor"
  on storage.objects for update to authenticated
  using (bucket_id = 'osk-media' and public.is_site_editor())
  with check (bucket_id = 'osk-media' and public.is_site_editor());

create policy "osk_media_delete_site_editor"
  on storage.objects for delete to authenticated
  using (bucket_id = 'osk-media' and public.is_site_editor());
