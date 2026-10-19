-- 004: única puerta de entrada del público (rol anon) a los datos de una orden.
-- Devuelve solo lo estrictamente necesario: SIN client_phone, client_name ni IDs internos.
-- La placa se devuelve enmascarada (solo los últimos 3 caracteres) para que el cliente reconozca su auto.

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
  -- Descarta de inmediato tokens con formato inválido
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
      select jsonb_agg(jsonb_build_object('body', n.body, 'created_at', n.created_at)
                       order by n.created_at)
      from public.order_notes n
      where n.order_id = v_order.id and n.visible_to_client
    ), '[]'::jsonb),
    'photos', coalesce((
      select jsonb_agg(jsonb_build_object('storage_path', p.storage_path, 'created_at', p.created_at)
                       order by p.created_at)
      from public.order_photos p
      where p.order_id = v_order.id
    ), '[]'::jsonb)
  );
end;
$$;

-- Por defecto Postgres permite ejecutar a PUBLIC; se restringe explícitamente.
revoke all on function public.get_order_by_token(text) from public;
grant execute on function public.get_order_by_token(text) to anon, authenticated;
