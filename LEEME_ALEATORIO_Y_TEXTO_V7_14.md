# SurgiPrep 7.14 Beta

## Cambios

- En la primera apertura sin sesión guardada y al pulsar Nueva sesión en estudio, el orden predeterminado es Aleatorio. Cada nueva sesión vuelve a barajar las preguntas del conjunto filtrado. Los exámenes personalizados y los simulacros también comienzan en orden aleatorio. No se modifica el orden interno de las alternativas ni sus claves.
- Reanudar una sesión conserva sus respuestas, su posición y su orden anterior. Reanudar no equivale a crear una sesión nueva.
- Las otras modalidades de repaso siguen disponibles para elegirlas expresamente: objetivos menos vistos, adaptación, errores, repetición espaciada y casos encadenados. Los casos encadenados conservan su secuencia clínica.
- Todas, Fácil, Intermedio, Difícil y Muy difícil ocupan una fila completa de cinco columnas iguales. Los nombres llevan colores: verde para Fácil, amarillo para Intermedio, naranja para Difícil y rojo para Muy difícil. Todas conserva su color neutro. Los fondos de los cinco botones son iguales; el borde identifica el filtro activo. En espacios muy estrechos o con texto ampliado, un nombre puede ocupar más de una línea dentro de su botón.
- El enunciado utiliza 16 píxeles en teléfono y 18 en tableta. Se justifica a ambos márgenes, con última línea alineada al inicio y separación automática de palabras cuando el navegador la admita.
- La explicación y el análisis de alternativas también se justifican. Las alternativas para seleccionar conservan su letra de 16 píxeles y su alineación izquierda.
- Se mantienen las cinco pestañas visibles, el selector Estudio / Examen de ancho completo, la práctica por voz y la corrección de letras duplicadas.

## Actualizar

Antes de actualizar, exporta un respaldo. Sube el contenido descomprimido al mismo repositorio y ruta de GitHub Pages; index.html debe quedar en la raíz. Abre la aplicación con conexión y vuelve a abrirla después de la actualización del caché. No borres los datos del sitio.

## Verificación y límites

Las 1.419 preguntas y QA_PENDIENTES.json se conservan idénticos en bytes respecto de la versión 7.13.3. Se mantiene pendiente la validación clínica definitiva.

Pasaron 23 grupos de pruebas simuladas de sesiones, aleatoriedad y voz, 14 de regresión de aplicación, la simulación del nuevo caché y las verificaciones de integridad, identificadores y contraste. Las reglas de estilo comprueban el reparto de botones y la justificación; no se ha realizado una comprobación visual en Safari real ni en dispositivos físicos. Los informes anteriores incluidos son históricos.
