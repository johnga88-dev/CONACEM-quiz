# SurgiPrep 7.23.3 Beta

Banco R07 integrado: **1.888 preguntas**, sin ginecología ni urología. Se conserva cada objeto del banco adjunto y sus identificadores. Los veinte bloques son históricos y tienen tamaños variables; el selector muestra el recuento real.

Se mantienen el análisis de alternativas desplegable, el desplazamiento automático a la explicación en Estudio, audio, apariencia y ajustes de 7.23.2.

El historial bruto y los favoritos se conservan en el dispositivo y en respaldos. Las estadísticas y listas activas usan solo las preguntas del banco vigente, evitando entradas vacías o preguntas retiradas. Las sesiones de Estudio conservan preguntas y respuestas admitidas. Un examen guardado con preguntas retiradas no se recalifica con un total diferente: se pide iniciar otro examen.

## Instalación en GitHub Pages

Subir el contenido de este ZIP a la raíz del repositorio, incluyendo questions.json, assets y sw.js. Sustituir los archivos de la versión anterior. Abrir el sitio con conexión para descargar la actualización; si ya estaba abierto, cerrarlo y volverlo a abrir tras actualizar. El identificador de caché cambia para evitar mantener el banco anterior.

Exportar un respaldo antes de actualizar es recomendable. No se cambiaron las claves de almacenamiento de progreso, preferencias ni sesiones.

Paquete preparado sin publicación. Validación clínica independiente pendiente.

## Verificación

Banco y recursos cotejados con el ZIP adjunto. Carga, recuentos, filtros, estadísticas activas, respaldo de historial y migración de sesiones comprobados con Node.js y DOM simulado. Se conserva la interacción de análisis plegable y el desplazamiento a explicación. No fue posible probar visualmente en navegador porque falta el ejecutable Chromium; no se probó voz en un dispositivo físico.

Para repetir las pruebas lógicas: `node auditoria/pruebas_v7_23_3.cjs`.
