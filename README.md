# Multimedia

Debe crear un directorio llamado `multimedia` en la raíz del proyecto para almacenar en él las películas o videos y dentro de la carpeta `multimedia`, crear un directorio llamado `jpeg`, quedando la siguiente estructura:

```none
--- Estructura de directorio ---

+ multimedia/
    + jpeg/
```

Los formatos admitidos por ahora son `mp4` y `webm` por los momentos.

En versiones posteriores no será necesario los pasos antes mencionado. Este repositorio es privado porque se destinará para sacarle provecho económico, al menos, al principio.

Por ahora, hay un archivo denominado `DLVideo.php`. En ese archivo está la estructura de código que formará una una API Rest. Es decir, una estructura JSON que será accesible en:

```none
/api/
```

Sin embargo, el archivo antes mencionado se encuentra en la carpeta raíz del proyecto.

Para utilizarlo con JavaScript solo tiene que establecer la ruta así:

```js
/**
 * @param { string } path Ruta de la API.
 * @returns { Promise<any> }
 */
const getData = async (path) => {
    const response = await fetch(path);
    const data = await response.json();

    console.log({ data });
};

getData("/api/");
```
