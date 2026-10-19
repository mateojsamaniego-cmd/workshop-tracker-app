// Arma el enlace de WhatsApp. Si el número empieza con 0 se asume Ecuador (+593).
export function buildWhatsappUrl(phone, message) {
  const text = encodeURIComponent(message)
  let digits = (phone ?? '').replace(/\D/g, '')
  if (digits.startsWith('0')) digits = `593${digits.slice(1)}`

  // Sin teléfono válido, WhatsApp deja elegir el contacto
  return digits.length >= 10
    ? `https://wa.me/${digits}?text=${text}`
    : `https://wa.me/?text=${text}`
}
