-- 006: descripción de fotos e historial de estados (para la línea de tiempo)

-- 1. Cada foto lleva la descripción de lo que se realizó.
--    Se deja nullable para no romper fotos anteriores; la app la exige en las nuevas.
alter table public.order_photos
  add column description text check (description is null or length(btrim(description)) > 0);

-- 2. Historial de estados: una fila por cada cambio (y una al crear la orden)
create table public.order_status_history (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id) on delete restrict,
  status     text not null,
  changed_by uuid references auth.users (id),
  changed_at timestamptz not null default now()
);

create index order_status_history_order_id_idx on public.order_status_history (order_id, changed_at);

alter table public.order_status_history enable row level security;

create policy "staff puede ver historial"
  on public.order_status_history for select to authenticated using (true);

-- Sin policies de escritura: solo el trigger registra cambios, nadie los edita desde la app.

create or replace function public.log_order_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.order_status_history (order_id, status, changed_by)
    values (new.id, new.status, auth.uid());
  end if;
  return new;
end;
$$;

revoke all on function public.log_order_status() from public, anon, authenticated;

create trigger orders_log_status
  after insert or update of status on public.orders
  for each row execute function public.log_order_status();

-- Punto de partida para las órdenes que ya existen (solo datos de prueba en desarrollo)
insert into public.order_status_history (order_id, status, changed_at)
select id, status, created_at from public.orders;

-- 3. La función pública agrega la descripción de las fotos y el historial de estados
create or replace function public.get_order_by_token(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
begin
  if p_token is null or p_token !~ '^[0-9a-f]{64}$' then
    return null;
  end if;

  select * into v_order from public.orders where public_token = p_token;
  if not found then
    return null;
  end if;

  return jsonb_build_object(
    'plate_masked', case when length(v_order.plate) > 3
                         then repeat('*', length(v_order.plate) - 3) || right(v_order.plate, 3)
                         else '***' end,
    'vehicle',     v_order.vehicle,
    'estimated_delivery', v_order.estimated_delivery,
    'description', v_order.description,
    'status',      v_order.status,
    'created_at',  v_order.created_at,
    'updated_at',  v_order.updated_at,
    'notes', coalesce((
      select jsonb_agg(jsonb_build_object('body', n.body, 'created_at', n.created_at) order by n.created_at)
      from public.order_notes n
      where n.order_id = v_order.id and n.visible_to_client
    ), '[]'::jsonb),
    'photos', coalesce((
      select jsonb_agg(jsonb_build_object('storage_path', p.storage_path, 'description', p.description, 'created_at', p.created_at)
                       order by p.created_at)
      from public.order_photos p
      where p.order_id = v_order.id
    ), '[]'::jsonb),
    'history', coalesce((
      select jsonb_agg(jsonb_build_object('status', h.status, 'changed_at', h.changed_at) order by h.changed_at)
      from public.order_status_history h
      where h.order_id = v_order.id
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_order_by_token(text) from public;
grant execute on function public.get_order_by_token(text) to anon, authenticated;
