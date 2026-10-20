# SurgiPrep — nueva apariencia

Versión 7.12 Beta, 18 de octubre de 2026. Banco de 1.419 preguntas, idéntico al de la versión anterior. Conserva 1.056 avisos de revisión pendiente y sigue pendiente de validación clínica definitiva.

## Cambios de apariencia

- Nuevo icono aprobado: libro con páginas diferenciadas y bisturí con hoja metálica, sobre fondo azul tinta y acentos turquesa.
- Interfaz de colores sobrios, superficies planas y sombras discretas.
- Modos Oscuro, Claro y Sistema, seleccionables en «Apariencia». Se recuerda la elección en el navegador. La primera apertura conserva el modo oscuro.
- Enunciados con más interlineado y alternativas de 17 píxeles.
- Filtros plegables con resumen de las selecciones activas. Se recuerda si quedaron abiertos o cerrados.
- Explicación sobre fondo neutro; verde y rojo reservados al resultado y las marcas de las alternativas.
- Controles de dificultad con botones nativos para teclado y estado accesible de selección.

No se modificaron preguntas, alternativas, claves, explicaciones, clasificaciones ni marcas de revisión. Se conservan favoritos, estadísticas, errores, repaso espaciado, simulacros de 100 preguntas, 120 minutos y corte de aprobación del 65 %, respaldos y ampliación de imágenes.

## Cómo actualizar en GitHub Pages

1. Exporta un respaldo desde la aplicación actual.
2. Descomprime y sube a la misma carpeta publicada `index.html`, `app.js`, **`appearance.js`**, **`style.css`**, `questions.json`, `manifest.json`, `sw.js`, los tres iconos y `assets/`. Los dos archivos destacados son nuevos y deben incluirse.
3. Mantén la misma dirección y ruta de publicación para conservar el almacenamiento del navegador.
4. Abre la aplicación con conexión para que se actualice y prepare el uso sin conexión. Cierra y vuelve a abrir las pestañas antiguas si siguen mostrando el diseño previo.
5. Si el icono de inicio del dispositivo conserva la imagen anterior, puede requerir volver a añadir la aplicación a la pantalla de inicio. Exporta antes el respaldo y consérvalo para importarlo si fuera necesario.

La carpeta `auditoria/` y estos documentos pueden guardarse aparte como respaldo; no son necesarios para ejecutar SurgiPrep. La modalidad oral no se incluyó en esta actualización.

## Qué se comprobó

El banco y sus avisos se compararon byte a byte con la versión previa. Pasaron las pruebas funcionales con documento simulado, el controlador de apariencia con preferencias simuladas y la instalación y recuperación del caché con eventos simulados, incluyendo los nuevos archivos de estilos y apariencia.

Se comprobaron 42 combinaciones declaradas de texto y fondo con contraste de al menos 4,5:1, además de los colores de bordes de controles y barras de progreso. Esto no constituye una evaluación completa de accesibilidad ni una prueba visual de la interfaz renderizada.

Quedan pendientes la revisión visual y de instalación real en navegador, iPhone e iPad. Los informes están en `auditoria/`.
