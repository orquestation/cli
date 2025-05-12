import fs from "fs";
import path from "path";

// persistFile(
//   "C:\\Users\\Adrian\\projectos\\software-development-annotation\\src\\folder2\\index.js",
//   "hola"
// );
export default async function persistFile(filePath, content) {
  console.log({ filePath, content });
  try {
    // 1. Obtiene el directorio de la ruta del archivo.
    const directory = path.dirname(filePath);

    // 2. Verifica si el directorio existe usando existsSync.
    if (!fs.existsSync(directory)) {
      // 3. Si el directorio no existe, lo crea de forma recursiva.
      try {
        await fs.promises.mkdir(directory, { recursive: true }); // Usamos la versión de promesas aquí
        console.log(`Directorio creado: ${directory}`);
      } catch (mkdirError) {
        // 4. Si la creación del directorio falla, lanza el error.
        console.error(`Error al crear el directorio: ${mkdirError}`);
        throw mkdirError;
      }
    }
  } catch (error) {
    console.error(`Error al acceder o crear el directorio: ${error}`);
    throw error;
  }

  try {
    await fs.promises.writeFile(filePath, content); // Usamos la versión de promesas aquí
    console.log(`Archivo escrito: ${filePath}`);
  } catch (writeError) {
    // 6. Si la escritura del archivo falla, lanza el error.
    console.error(`Error al escribir el archivo: ${writeError}`);
    throw writeError;
  }
}
