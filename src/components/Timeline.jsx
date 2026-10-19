import StatusPill from './StatusPill'
import { getStatus } from '../lib/orderStatus'
import { formatDayHeader, formatTime } from '../lib/format'
import { IconCamera, IconChat, IconLock } from './icons'

// Línea de tiempo vertical agrupada por día. Muestra cambios de estado, notas y fotos con su hora.
export default function Timeline({ items, photoUrl, onPhotoClick, showVisibility = false }) {
  if (items.length === 0) return <p className="py-2 text-body-sm text-black/40">Aún no hay actividad.</p>

  return (
    <ol>
      {items.map((item, index) => {
        const day = formatDayHeader(item.at)
        const showDay = index === 0 || formatDayHeader(items[index - 1].at) !== day
        const isLast = index === items.length - 1

        return (
          <li key={item.key}>
            {showDay && <p className="pt-4 pb-2 pl-10 text-caption font-medium text-black/40 first-letter:uppercase">{day}</p>}

            <div className="relative flex gap-4 pb-6">
              {/* Línea vertical que une los eventos */}
              {!isLast && <span className="absolute top-7 bottom-0 left-[11px] w-px bg-black/10" aria-hidden="true" />}

              <Marker item={item} />

              <div className="min-w-0 flex-1">
                <p className="text-caption text-black/40">{formatTime(item.at)}</p>

                {item.type === 'status' && (
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-body text-black/80">
                    {item.first ? 'Orden registrada como' : 'Estado cambiado a'}
                    <StatusPill status={item.status} />
                  </div>
                )}

                {item.type === 'note' && (
                  <>
                    <p className="mt-1 text-body text-black/90">{item.note.body}</p>
                    {showVisibility && !item.note.visible_to_client && (
                      <p className="mt-1 flex items-center gap-1 text-caption text-black/40">
                        <IconLock size={14} /> Solo interna
                      </p>
                    )}
                  </>
                )}

                {item.type === 'photo' && (
                  <button type="button" onClick={() => onPhotoClick(item.photo)} className="mt-2 block w-full text-left">
                    <img
                      src={photoUrl(item.photo.storage_path)}
                      alt={item.photo.description || 'Foto del trabajo'}
                      loading="lazy"
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                    />
                    {item.photo.description && <p className="mt-2 line-clamp-2 text-body text-black/90">{item.photo.description}</p>}
                  </button>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function Marker({ item }) {
  const base = 'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full'
  if (item.type === 'status') {
    return (
      <span className={`${base} bg-pure-white`}>
        <span className={`h-3 w-3 rounded-full ${getStatus(item.status).dot}`} />
      </span>
    )
  }
  return (
    <span className={`${base} bg-black/[0.05] text-black/50`}>
      {item.type === 'photo' ? <IconCamera size={14} /> : <IconChat size={14} />}
    </span>
  )
}
