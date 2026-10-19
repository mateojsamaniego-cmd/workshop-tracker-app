-- 001: tabla de órdenes de trabajo (con RLS y policies en el mismo archivo)

-- Función genérica para mantener updated_at. search_path fijo por seguridad.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.orders (
  id            uuid primary key default gen_random_uuid(),
  -- Token del enlace público: 64 caracteres hex (~244 bits aleatorios).
  -- Se arma con dos UUID v4 para no depender de la extensión pgcrypto.
  public_token  text not null unique
                default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  plate         text not null check (length(btrim(plate)) > 0),
  client_name   text not null check (length(btrim(client_name)) > 0),
  client_phone  text,                                   -- NUNCA se expone al público
  vehicle       text not null check (length(btrim(vehicle)) > 0),  -- ej. "Chevrolet Sail 2018"
  description   text,                                   -- trabajo a realizar
  estimated_delivery date,                              -- fecha estimada de entrega (visible al cliente)
  status        text not null default 'received'
                check (status in ('received', 'in_progress', 'waiting_parts', 'ready', 'delivered')),
  created_by    uuid references auth.users (id) default auth.uid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index orders_status_idx     on public.orders (status);
create index orders_plate_idx      on public.orders (plate);
create index orders_created_at_idx on public.orders (created_at desc);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

-- Todo usuario autenticado es personal del taller (el registro público está desactivado).
-- No hay policy de DELETE a propósito: las órdenes no se borran desde la app.
create policy "staff puede ver ordenes"
  on public.orders for select to authenticated using (true);

create policy "staff puede crear ordenes"
  on public.orders for insert to authenticated with check (true);

create policy "staff puede actualizar ordenes"
  on public.orders for update to authenticated using (true) with check (true);

-- El rol anon no recibe ninguna policy: no puede leer ni escribir la tabla.
