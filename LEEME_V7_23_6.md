# SurgiPrep 7.23.6 Beta

**1.897 preguntas. Bloque 19 completo: 100 preguntas.**

Se añaden 21 preguntas nuevas a las 79 vigentes del bloque 19. Se conservan los 1.876 registros anteriores. No se incluyen ginecología, urología ni ortopedia.

Para leer el complemento sin instalar la app, abrir `auditoria/banco_R09/LEER_NUEVAS_21.html`; para leer las 100, abrir `auditoria/banco_R09/LEER_BLOQUE19_COMPLETO.html`. También se incluyen ambos archivos en JSON y Markdown.

La aplicación mantiene gestos, navegación fija, explicaciones, análisis de alternativas, audio, preferencias y respaldo. Respeta el bloque explícito de cada pregunta para que los nuevos IDs 2001–2021 aparezcan en el bloque 19. Los IDs históricos y retirados no se renumeran.

## Actualización en GitHub Pages

Exportar el respaldo del progreso antes de actualizar. Subir todo el contenido del ZIP a la raíz del mismo repositorio, reemplazando archivos y conservando `assets`. Abrir con conexión para descargar la nueva caché y volver a abrir la aplicación si estaba abierta. No abrir `index.html` por doble clic: la aplicación carga su JSON mediante HTTP. Los archivos de lectura HTML sí pueden abrirse directamente.

Mantener la misma dirección conserva el almacenamiento del navegador. El historial bruto permanece en el dispositivo y en los respaldos. Las estadísticas activas solo usan IDs vigentes. No se publica automáticamente.

Revisión clínica independiente pendiente. Comprobaciones estructurales y funcionales en entorno simulado; no se declara prueba en iPhone físico ni validación visual de navegador real. Informes en `auditoria/banco_R09/`. Las auditorías anteriores son históricas.
