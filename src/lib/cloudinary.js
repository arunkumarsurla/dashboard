const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

/**
 * Upload a base64 or File object to Cloudinary via unsigned upload preset.
 * Returns the secure URL string.
 */
export async function uploadToCloudinary(file, folder = 'mkl-admin') {
  const formData = new FormData()

  if (typeof file === 'string' && file.startsWith('data:')) {
    // base64 string
    formData.append('file', file)
  } else {
    formData.append('file', file)
  }

  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Cloudinary upload failed')
  }

  const data = await res.json()
  return data.secure_url
}

/**
 * Upload multiple images (base64 or File), return array of URLs.
 */
export async function uploadMultiple(files, folder = 'mkl-admin') {
  const results = await Promise.allSettled(
    files.map(f => uploadToCloudinary(f, folder))
  )
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)
}

/**
 * Compress an image File to a max width / quality via canvas, returning base64.
 */
export function compressImage(file, maxWidth = 800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width  = maxWidth
        canvas.height = img.height * (maxWidth / img.width)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
