# SurgiPrep 7.23.1 Beta — corrección de actualización

Banco, preguntas, imágenes y progreso sin cambios respecto de 7.23.0.

## Problema
Tras publicar en GitHub Pages seguía apareciendo la versión anterior. El service worker:
- guardaba los archivos nuevos sin saltarse la caché HTTP de GitHub Pages (hasta 10 min), por lo que la caché "nueva" podía contener archivos viejos;
- entregaba la copia guardada si la red tardaba más de 4 s (questions.json pesa 8,5 MB);
- no recargaba la página al activarse una versión nueva.

## Corrección
- sw.js: descarga inicial con `cache: 'reload'`; páginas, JS, CSS y JSON se piden primero a la red y la copia guardada solo se usa sin conexión; imágenes siguen cargándose desde la copia guardada.
- app.js: registro con `updateViaCache: 'none'`, comprobación de actualización en cada apertura y recarga automática única cuando se activa una versión nueva.
- `.nojekyll` en la raíz.

## Primera actualización desde 7.23.0 o anterior
Los dispositivos aún tienen el service worker antiguo. Abre la app, espera unos 30 s con conexión, ciérrala por completo y vuelve a abrirla. En Ajustes debe verse «Versión 7.23.1 Beta». Desde esta versión, las siguientes actualizaciones se aplican solas.
