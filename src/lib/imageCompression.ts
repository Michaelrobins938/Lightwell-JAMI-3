import imageCompression from 'browser-image-compression';

export async function compressImage(file: File, options = {}) {
  try {
    return await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      ...options,
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}