-- 003: fotos de cada orden (metadatos; el archivo vive en Storage, bucket "fotos")

create table public.order_photos (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders (id) on delete restrict,
  -- Ruta dentro del bucket, ej. "<order_id>/<uuid>.jpg"
  storage_path text not null unique check (length(btrim(storage_path)) > 0),
  created_by   uuid references auth.users (id) default auth.uid(),
  created_at   timestamptz not null default now()
);

create index order_photos_order_id_idx on public.order_photos (order_id, created_at);

alter table public.order_photos enable row level security;

create policy "staff puede ver fotos"
  on public.order_photos for select to authenticated using (true);

create policy "staff puede registrar fotos"
  on public.order_photos for insert to authenticated with check (true);
