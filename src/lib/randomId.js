// crypto.randomUUID solo existe en contextos seguros (https o localhost). Al probar desde el
// celular por http://192.168.x.x no está disponible, así que se usa getRandomValues, que sí lo está.
export function randomId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()

  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}
