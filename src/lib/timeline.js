// Une historial de estados, notas y fotos en una sola lista ordenada por fecha (más antiguo primero)
export function buildTimeline({ history = [], notes = [], photos = [] }) {
  const items = [
    ...history.map((h, i) => ({ type: 'status', key: `s-${h.changed_at}-${i}`, at: h.changed_at, status: h.status, first: i === 0 })),
    ...notes.map((n, i) => ({ type: 'note', key: `n-${n.id ?? n.created_at}-${i}`, at: n.created_at, note: n })),
    ...photos.map((p, i) => ({ type: 'photo', key: `p-${p.id ?? p.storage_path}-${i}`, at: p.created_at, photo: p })),
  ]
  return items.sort((a, b) => new Date(a.at) - new Date(b.at))
}
