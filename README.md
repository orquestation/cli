![OSD-cli](https://github.com/nardote/osd-cli/blob/main/assets/logo.png "OSD-cli Logo")

# OSD-cli (orquestation software development)
OSD te devuelve el poder sobre el código generado por IA. En lugar de tratar con 'cajas negras' difíciles de gestionar, OSD estructura tu desarrollo mediante 'prompts' de diseño claros y versionables —almacenados en archivos .osd individuales— para cada módulo de tu aplicación. Define el contexto global y las directrices del lenguaje en un archivo de configuración central .osd, y observa cómo la herramienta orquesta la creación de código fuente predecible y los tests correspondientes en tu lenguaje preferido. ¿Necesitas modificar, regenerar o entender una funcionalidad? Simplemente revisa o ajusta su prompt. Con OSD-cli, transformas los prompts en la columna vertebral de un desarrollo ágil, mantenible y auto-documentado, recuperando el control y la claridad en la era de la IA.

## Instalacion

Clonar proyecto

```bash
git clone git@github.com:nardote/osd-cli.git
```

Definir como global osd-cli

```bash
npm i -g .
```

## Setup del proyecto

Crear carpeta de tu nuevo proyecto

```bash
mkdir new-project
```

Crear un archivo .env con la variable AI_API_KEY (por le momento solo trabaja con Gemini, se puede genera una gratis en https://aistudio.google.com/apikey)

```bash
AI_API_KEY=XXXXXXXXXXXX
```

Iniciar OSD en el nuevo proyecto

```bash
cd new-project
osd-cli -i
```

En este momento OSD creo algunas carpetas y un archivo

```
__tests__
__osd__
.osd
```

Solo faltaria crear la carpeta donde se deposite el codigo Ej.: src

## Hello world

Crear un archivo dentro de la carpeta \_\_osd\_\_ llamado index.js.osd con el siguiente contenido

```bash
{
    "prompt":"generar una funcion que devuelva por consola Hello World"
}
```

IMPORTANTE: el arbol de carpetas generado en \_\_osd\_\_ sera el mismo que se genere en la careta src

En la raiz del proyecto correr el commando osd-cli

```bash
/user/new-project > osd-cli

```

Ya podemos ver nuestro primer codigo dentro de ./src

## Archivo de configuracion general

El archivo de configuracion general (.osd) se encarga de definir algunas configuraciones para poder adaptarse a proyectos preexistentes.

```bash
{
  "prompt": "# El projecto es en python 3.13 tener en cuenta: - no agregar el punto de entrada principal a cada archivo",
 
  "promptFolder": "__osd__",
  "testFolder": "__tests__",
  "srcFolder": "src"
}
```

IMPORTANTE: si no existe este archivo OSD no reconoce el proyecto

### configuracion de .osd

en este archivo se puede hacer cambios para adaptarse a tu foma de trabajo.

|                    |                                                                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prompt             | se encarga de definir las condiciones de como queres que trabaje la IA. Se debe definir el lenguaje y cuestiones generales que nos gustaria que tenga el codigo |
| promptFolder       | aca se crean los archivo osd que luego son usados para crear el codigo, los test y la estrucutra de carpetas en src                                             |
| testFolder         | carpeta donde se va a crear los archivos de test                                                                                                                |
| srcFolder          | es la carpeta donde se va a crear el codigo                                                                                                                     |
