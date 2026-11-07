# SurgiPrep 7.23.22 Beta

Se incorporan 100 preguntas: 63 aportadas y revisadas documentalmente, con cinco alternativas, y 37 adicionales. Forman el bloque 26, preguntas 2501–2600. El banco completo contiene 2.600 preguntas y 26 bloques de 100.

Base: 7.23.21. Las 2.500 preguntas anteriores conservan exactamente sus identificadores, números, bloques, alternativas, respuestas y explicaciones. Se agregan 100 preguntas, se retiran 0 y se trasladan 0. Los nuevos IDs internos son 2813–2912; no corresponden a su numeración pública. Se conserva la pregunta del adolescente de 15 años, incluido su enunciado y sus cuatro alternativas originales, añadiendo la quinta alternativa solicitada.

Se mantienen las correcciones previas, los recuadros verdes/rojos/grises al finalizar el examen y la eliminación de «Revisión rápida». Las claves de almacenamiento no cambian. No se necesita migración de datos.

## Instalación en GitHub Pages

Paquete completo, sin publicar ni desplegar. Exporta primero un respaldo del progreso. Reemplaza los archivos en la misma dirección, conservando el dominio y la ruta. Abre con conexión, cierra todas las pestañas y ventanas/PWA y vuelve a abrir para permitir la actualización normal. Comprueba «7.23.22 Beta» en Ajustes. No borres los datos del sitio. Las sesiones de otro origen no se comparten automáticamente; utiliza la importación del respaldo si cambias de dirección.

## Verificación y límites

Pruebas automatizadas en Node.js con DOM, reloj, caché y audio simulados: integridad de los 26 bloques, correspondencia del banco nuevo con el banco revisado, respuestas y fuentes de las 100 nuevas preguntas, recuperación de sesiones de estudio/examen de 7.23.21, importación, estadísticas, configuración fija del examen, recuadros de resultados y ciclo normal del service worker. Resultados y scripts en auditoria/pruebas_72322 y auditoria.

No se completó una prueba en navegador real: Playwright no encontró el ejecutable de Chromium. No se probaron dispositivos físicos, micrófono, voces ni gestos en iPhone/iPad. Las referencias y el cotejo documental del banco nuevo se incluyen en auditoria/ORIGEN_BLOQUE_26; no equivalen a validación clínica independiente, que sigue pendiente. No se modificó el contenido clínico durante esta integración.

La numeración completa está en NUMERACION_BLOQUES_1_A_26.csv. La lectura del banco sin la app está en LECTURA_BANCO/INDICE.html.
