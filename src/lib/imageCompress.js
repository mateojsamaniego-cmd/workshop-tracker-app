const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_ORIGINAL_BYTES = 15 * 1024 * 1024
const TARGET_BYTES = 300 * 1024
const MAX_SIDE = 1600

function canvasToBlob(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
}

// Valida y comprime en el navegador (JPEG, lado máximo 1600 px, objetivo ~300 KB).
// Lanza Error con un mensaje en español listo para mostrar al usuario.
export async function compressImage(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Formato no permitido. Usa una foto JPG, PNG o WebP.')
  }
  if (file.size > MAX_ORIGINAL_BYTES) {
    throw new Error('La foto pesa más de 15 MB.')
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  // Baja la calidad por pasos hasta llegar al peso objetivo
  let quality = 0.8
  let blob = await canvasToBlob(canvas, quality)
  while (blob && blob.size > TARGET_BYTES && quality > 0.4) {
    quality -= 0.1
    blob = await canvasToBlob(canvas, quality)
  }

  if (!blob) throw new Error('No se pudo procesar la foto.')
  return blob
}
