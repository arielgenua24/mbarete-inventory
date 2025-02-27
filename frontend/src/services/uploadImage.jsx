import ImageKit from "imagekit-javascript";
import Compressor from 'compressorjs';

const imagekit = new ImageKit({
  publicKey: "public_JJwG1EFYua4sXmfsyaNxIizE/DQ=",
  urlEndpoint: "https://ik.imagekit.io/arielgenua",
});

// Función para comprimir una imagen
const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6, // Calidad de compresión (0.6 = 60%, ajusta según necesites)
        maxWidth: 1024, // Ancho máximo (opcional)
        maxHeight: 1024, // Alto máximo (opcional)
        mimeType: "image/jpeg", // Tipo de archivo de salida (puedes usar 'image/png' si prefieres)
        success(compressedFile) {
          resolve(compressedFile);
        },
        error(err) {
          console.error("Error al comprimir la imagen:", err);
          reject(err);
        },
      });
    });
  };



async function uploadImages(image1, image2, image3) {
    const imagesURls = [];

  // Usa el endpoint de autenticación en modo de pruebas
  const authenticationEndpoint = "http://localhost:3001/auth";
  // Para producción (si el backend y el frontend están en el mismo dominio)
  // const authenticationEndpoint = "/auth"; o /backend/auth

  // Función auxiliar para obtener parámetros de autenticación
  const getAuthParams = async () => {
    const authResponse = await fetch(authenticationEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!authResponse.ok) {
      throw new Error(`Error en autenticación: ${authResponse.statusText}`);
    }

    return await authResponse.json();
  };

  // Función auxiliar para subir una imagen
  const uploadFile = async (file) => {
    // eslint-disable-next-line no-useless-catch
    try {
      // Obtenemos parámetros de autenticación frescos para esta imagen
      const authData = await getAuthParams();

      return new Promise((resolve, reject) => {
        imagekit.upload({
          file: file, // archivo de tipo File
          fileName: file.name, // usamos el nombre original o lo que desees
          tags: ["tag1"], // puedes modificar o eliminar etiquetas según tus necesidades
          token: authData.token,
          signature: authData.signature,
          expire: authData.expire,
        }, function(err, result) {
          if (err) {
            console.error("Error al subir la imagen:", err);
            return reject(err);
          }

          // Opcional: genera una URL transformada (por ejemplo, para redimensionar)
          const transformedUrl = imagekit.url({
            src: result.url,
            transformation: [{ height: 300, width: 400 }],
          });
          console.log("URL transformada:", transformedUrl);
          resolve(result);
        });
      });
    } catch (error) {
      throw error;
    }
  };

  try {
    // Comprimimos las imágenes antes de subirlas
    const compressedImage1 = await compressImage(image1);
    const compressedImage2 = await compressImage(image2);
    const compressedImage3 = await compressImage(image3);

    // Subimos las imágenes comprimidas de forma concurrente
    const uploadResults = await Promise.all([
      uploadFile(compressedImage1),
      uploadFile(compressedImage2),
      uploadFile(compressedImage3),
    ]);

    return uploadResults;
  } catch (error) {
    console.error("Error en la autenticación o al subir imágenes:", error);
    throw error;
  }
}

export default uploadImages;