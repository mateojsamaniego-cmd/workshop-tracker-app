-- 005: bucket "fotos" y sus policies

-- Bucket PÚBLICO: las fotos se sirven por URL directa. La protección es que los nombres
-- son UUID aleatorios (no adivinables) y solo se descubren mediante get_order_by_token.
-- Límite 1 MB (las fotos se comprimen a ~300 KB en el navegador) y solo imágenes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 1048576, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Solo el personal autenticado puede subir y listar. Sin policies de UPDATE/DELETE.
create policy "staff puede subir fotos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos');

create policy "staff puede listar fotos"
  on storage.objects for select to authenticated
  using (bucket_id = 'fotos');
