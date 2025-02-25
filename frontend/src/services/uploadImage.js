import ImageKit from "imagekit-javascript";

const imagekit = new ImageKit({
  publicKey: "public_JJwG1EFYua4sXmfsyaNxIizE/DQ=",
  urlEndpoint: "https://ik.imagekit.io/arielgenua",
});

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
    // Subimos las 3 imágenes de forma concurrente
    const uploadResults = await Promise.all([
      uploadFile(image1),
      uploadFile(image2),
      uploadFile(image3)
    ]);

    console.log("Imagenes subidas:", uploadResults);
    return uploadResults;
  } catch (error) {
    console.error("Error en la autenticación o al subir imágenes:", error);
    throw error;
  }
}

export default uploadImages;