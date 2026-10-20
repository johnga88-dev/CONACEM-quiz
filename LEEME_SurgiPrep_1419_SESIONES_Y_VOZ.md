# SurgiPrep · sesiones y práctica por voz

Versión 7.13 Beta · 18 de octubre de 2026.

## Cambios de aplicación

- Disposición de una columna en teléfonos; pregunta y alternativas en dos columnas en tabletas con espacio suficiente. La distribución responde al ancho y alto disponibles, incluida la pantalla dividida. Se amplían controles táctiles y se respetan las áreas seguras.
- Conserva el icono aprobado, los temas oscuro, claro y del sistema y los filtros plegables.
- Recupera por separado la última sesión de estudio y la última de examen: orden de preguntas, posición, filtros, respuestas y marcas. Cambiar de modalidad recupera la sesión guardada de esa modalidad. «Nueva sesión» inicia otra.
- El tiempo total del examen continúa mientras la aplicación está cerrada o en segundo plano. Si al volver ya venció, se corrige con las respuestas registradas. El tiempo activo por pregunta excluye el tiempo pasado en segundo plano.
- Los respaldos exportados incluyen ahora ambas sesiones y las preferencias de apariencia. Los respaldos anteriores siguen siendo importables.
- No se incorpora un paso adicional para confirmar cada respuesta. La finalización manual del examen conserva su aviso existente.

## Cómo usar la voz

Abre «Práctica por voz» dentro de Estudio o Examen.

1. Pulsa «Leer pregunta» para escuchar el enunciado y las cinco alternativas.
2. Pulsa «Responder por voz» y di una única opción: «alternativa A», «B», «C», «D» o «E». También admite alfa, bravo, charlie, delta o eco. La respuesta reconocida se registra directamente.
3. Puedes decir «siguiente», «anterior», «repetir», «leer pregunta» o «marcar»; marcar corresponde al examen. Cada intervención requiere pulsar el micrófono.
4. «Leer explicación» se habilita después de responder en estudio o de finalizar el examen. Durante el examen no se revela la clave ni la explicación.
5. «Leer al cambiar de pregunta» es opcional y se activa expresamente en cada apertura. La velocidad de lectura es ajustable. «Detener voz» cancela lectura y micrófono.

Si el reconocimiento no está disponible, entra en «Ayuda y dictado del teclado», toca el campo, usa el micrófono del teclado y pulsa Responder o Intro. Los botones de alternativas siguen disponibles.

El micrófono se solicita solamente al pulsar el control correspondiente. SurgiPrep no graba ni almacena audio: utiliza el servicio de voz del navegador, que puede necesitar conexión y procesar el audio externamente. La disponibilidad del reconocimiento y de las voces depende del navegador, permisos, sistema y servicios del dispositivo. La lectura automática también puede estar limitada por las políticas de reproducción del navegador. No se garantiza funcionamiento de voz sin conexión ni compatibilidad universal de reconocimiento en la aplicación instalada.

## Actualización en GitHub Pages

1. Antes de actualizar, exporta un respaldo desde la aplicación actual.
2. Descomprime este archivo y sube su contenido al mismo repositorio y ruta de publicación. index.html debe quedar en la raíz publicada, acompañado de app.js, appearance.js, style.css, questions.json, manifest.json, sw.js, los iconos y assets/.
3. Conserva el mismo dominio y ruta para mantener el almacenamiento del navegador. Los datos no se sincronizan automáticamente entre dispositivos. Si cambia el dominio o usas otro dispositivo, importa el respaldo.
4. Abre la página con conexión, permite que termine de cargar y vuelve a abrirla para activar la actualización del caché. No borres los datos del sitio si quieres conservar tu progreso local.
5. En iPhone o iPad, abre la dirección publicada en Safari y utiliza «Añadir a pantalla de inicio» si prefieres la aplicación instalada. Autoriza el micrófono cuando lo solicites mediante el botón de voz.

La carpeta auditoria/ conserva trazabilidad e informes y puede guardarse en el repositorio; la aplicación no la carga para funcionar. Los documentos de versiones anteriores se mantienen como historial y no describen esta versión.

## Integridad y comprobaciones

Las 1.419 preguntas y QA_PENDIENTES.json son idénticos en bytes a la versión 7.12 Beta. Se mantienen quince bloques: catorce de cien preguntas y uno de diecinueve. Se conservan las 1.056 marcas pendientes; las 363 preguntas sin marca no se consideran por ello clínicamente validadas.

Se realizaron 19 grupos de pruebas de sesiones y voz con documento, almacenamiento, reloj y servicios de voz simulados, 14 grupos de regresión de la aplicación, 7 comprobaciones de apariencia, verificación de integridad y contraste y simulación del caché con 37 recursos, incluidas las 27 imágenes. El detalle está en auditoria/.

No se ha realizado prueba visual en navegador real ni prueba en iPhone o iPad físico. Antes de considerar estable la versión, verifica en tus dispositivos: orientación vertical y horizontal, pantalla dividida en iPad, permisos de micrófono, lectura, respuesta por voz en ambas modalidades, recuperación al cerrar, cambio de aplicación y uso desde pantalla de inicio.

El banco continúa pendiente de validación clínica definitiva. Esta entrega modifica exclusivamente la aplicación.

## Referencias técnicas

- WebKit, reconocimiento de voz en Safari: https://webkit.org/blog/11648/new-webkit-features-in-safari-14-1/
- Mozilla, documentación de reconocimiento de voz: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- Mozilla, síntesis de voz: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
