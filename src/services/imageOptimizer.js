import * as imageCompression from 'browser-image-compression';

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.5, // 500KB max size
    maxWidthOrHeight: 800, // 800px max width/height
    useWebWorker: true, // Use multi-threading
  };

  try {
    // If running in an environment where browser-image-compression module is not fully loaded,
    // this handles the default export structure differences.
    const compressor = imageCompression.default || imageCompression;
    const compressedFile = await compressor(file, options);
    
    // Convert to Base64 for local storage mocking
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  } catch (error) {
    console.error('Erro ao comprimir imagem:', error);
    throw error;
  }
};
