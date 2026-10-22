# SurgiPrep 7.23.7 Beta — 2.000 preguntas

**Veinte bloques completos, con cien preguntas en cada uno.**

Se añaden 103 preguntas nuevas para cubrir los huecos dejados por exclusiones: 75 en bloques 1–18 y 28 en bloque 20. El bloque 19 ya estaba completo y se conserva. Permanecen intactos los 1.897 objetos anteriores y sus identificadores. No se reactivan preguntas de ginecología, urología ni ortopedia.

## Lectura sin instalar

- `LEER_NUEVAS_103.html`: nuevas preguntas con respuestas y análisis desplegables.
- `LECTURA_BANCO/INDICE.html`: acceso a los veinte bloques, cada uno en un archivo de cien preguntas.
- `questions.json`: banco activo completo para la app.
- `auditoria/banco_R10/NUEVAS_103.json`: complemento.

Descomprimir y conservar carpetas para ver las imágenes heredadas. Las lecturas HTML pueden abrirse directamente. La aplicación `index.html` requiere HTTP para cargar su banco; abrirla desde su dirección publicada habitual, no por doble clic en el archivo.

## Actualización de la app

Exportar respaldo antes de actualizar. Reemplazar el contenido del mismo repositorio con este paquete completo, incluyendo assets. Abrir con conexión para actualizar la caché y cerrar y volver a abrir si estaba en uso. No se ha publicado automáticamente. Conservar la misma dirección permite mantener el almacenamiento del navegador.

Se mantienen gestos, barra inferior, explicación automática, análisis, voz, sesiones, preferencias y respaldo. Los IDs 2022–2124 son nuevos y se asignan explícitamente a los bloques incompletos. Los 124 IDs excluidos no se reutilizan. El ID máximo no expresa el total de preguntas; el total vigente es 2.000.

## Alcance de la revisión

Se cotejan las nuevas con el banco anterior y entre sí. Se incluyen fuentes y localizadores consultados de forma dirigida al 21 de octubre de 2026, hora de Chile. Se documentan sustituciones durante la preparación. No se afirma búsqueda sistemática, actualización clínica de todo el banco histórico ni validación independiente. La dificultad es editorial y las nuevas mantienen revisión clínica independiente pendiente.

Los informes anteriores R03–R09 son históricos; la versión vigente es R10. La verificación técnica y los conteos están en auditoria/banco_R10. Se prueban funciones con DOM simulado, sin afirmar prueba física en iOS ni validación visual en navegador real.
