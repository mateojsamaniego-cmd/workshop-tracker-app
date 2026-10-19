import Sheet from './Sheet'
import { formatDateTime } from '../lib/format'

// Ventana flotante con la foto en grande y la descripción de lo que se hizo
export default function PhotoViewer({ photo, photoUrl, onClose }) {
  return (
    <Sheet open={Boolean(photo)} onClose={onClose} title="Trabajo realizado">
      {photo && (
        <>
          <img src={photoUrl(photo.storage_path)} alt={photo.description || 'Foto del trabajo'} className="w-full rounded-xl object-contain" />
          <p className="mt-4 text-body leading-relaxed whitespace-pre-line text-black/90">
            {photo.description || <span className="text-black/40">Sin descripción.</span>}
          </p>
          <p className="mt-2 text-caption text-black/40">{formatDateTime(photo.created_at)}</p>
        </>
      )}
    </Sheet>
  )
}
