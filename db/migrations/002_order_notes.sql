-- 002: notas de cada orden (con RLS y policies en el mismo archivo)

create table public.order_notes (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders (id) on delete restrict,
  body              text not null check (length(btrim(body)) > 0),
  -- false = nota interna del taller; no aparece en la página pública
  visible_to_client boolean not null default true,
  created_by        uuid references auth.users (id) default auth.uid(),
  created_at        timestamptz not null default now()
);

create index order_notes_order_id_idx on public.order_notes (order_id, created_at);

alter table public.order_notes enable row level security;

create policy "staff puede ver notas"
  on public.order_notes for select to authenticated using (true);

create policy "staff puede crear notas"
  on public.order_notes for insert to authenticated with check (true);

-- Sin UPDATE ni DELETE: las notas son un registro histórico.
