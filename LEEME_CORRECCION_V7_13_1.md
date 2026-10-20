# SurgiPrep 7.13.1 Beta

Se corrige la duplicación «A. A:», «B. B:» y equivalentes del análisis de alternativas. El problema afectaba a las etiquetas de las explicaciones de 808 preguntas. Cada explicación muestra ahora una sola letra. Se aplica la misma corrección a la lectura por voz y se previene la duplicación en alternativas que ya incluyan su etiqueta.

Se conserva íntegramente el banco de 1.419 preguntas, sus respuestas y avisos, junto con el diseño para teléfono y tableta, las sesiones y las funciones de voz.

Las 1.419 explicaciones se comprobaron mediante documento simulado y captura del texto enviado a la lectura. Pasaron además las pruebas de regresión de la aplicación, sesiones, apariencia y caché. No se ha realizado una prueba física adicional.

Antes de actualizar, exporta un respaldo. Sube el contenido descomprimido al mismo repositorio y ruta de GitHub Pages, sustituyendo los archivos de la versión anterior. index.html debe quedar en la raíz. Es necesario actualizar app.js y sw.js; este último activa un nombre nuevo de caché. Abre la aplicación con conexión y vuelve a abrirla después de la actualización. Conserva los datos del sitio para mantener tu progreso.

Para las funciones generales, consulta LEEME_SurgiPrep_1419_SESIONES_Y_VOZ.md. Los informes y las instrucciones anteriores se mantienen como historial.
