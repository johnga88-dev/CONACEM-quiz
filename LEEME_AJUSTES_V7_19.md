# SurgiPrep — ajustes y tutorial

19 de octubre de 2026. Distribución 7.19 Beta con 1.500 preguntas.

El engrane de la esquina superior derecha abre un panel flotante de ajustes. Sustituye al selector de apariencia que estaba visible en el encabezado.

## Contenido

- Apariencia: oscuro, claro o sistema; conserva la selección previa.
- Voz de lectura: selección de las voces que el navegador pone a disposición. La opción automática da preferencia a las voces españolas identificadas como mejoradas o naturales por su nombre, cuando existen. No puede descargar ni crear una voz que el navegador no ofrece.
- Velocidad: de 0,70 a 1,30 veces la velocidad habitual, en pasos de 0,05.
- Probar voz: reproduce una muestra con la voz y velocidad elegidas, sin encender el micrófono ni registrar una respuesta. La misma tecla permite detener la muestra.
- Información: versión, finalidad del programa, cantidad de preguntas y estado de validación clínica.
- Creador: campo editable. No se ha inventado ni asignado un nombre, porque no se proporcionó. Se guarda en el dispositivo junto con los ajustes y se incluye en el respaldo.
- Cómo usar SurgiPrep: tutorial de nueve pasos dentro del mismo panel, con botón para volver a ajustes.

## Uso y preferencias

Las preferencias se aplican a la próxima lectura. El panel muestra las voces que carga el sistema; si la voz guardada no existe en otro dispositivo, utiliza la selección automática. La naturalidad y pronunciación dependen de las voces disponibles. No se incorporó un proveedor externo de voz ni se requiere una cuenta adicional para esta función.

Abrir ajustes pausa el turno de audio del cuestionario y cierra el micrófono. El modo audio permanece armado para la siguiente pregunta; no se reanuda inesperadamente al cerrar ajustes. La muestra se detiene al cerrar el panel o al ocultar la aplicación. El contador de tiempo del examen continúa mientras se consultan los ajustes o el tutorial.

El panel se puede cerrar con la cruz, tocando fuera o con Escape. La navegación con teclado permanece dentro del panel y el foco vuelve al engrane al cerrarlo. El contenido de fondo queda inerte mientras está abierto.

Las preferencias de voz, velocidad y creador se guardan localmente y se incluyen al exportar un respaldo desde Rendimiento. La importación de respaldos antiguos sin estos campos conserva los ajustes actuales. La apariencia sigue usando su clave anterior de almacenamiento.

## Conservación y comprobaciones

Se conservan las 1.500 preguntas de 7.18.3 sin cambios, incluidas las 81 de teoría clasificadas. También se mantienen la limpieza de remisiones, la barra superior en una sola fila sin dificultad duplicada, los filtros, estadísticas, favoritos, sesiones y las dos variantes finales del logo.

Se ejecutaron pruebas de ajustes y tutorial, flujo de audio, regresión del cuestionario y caché con componentes simulados. Los resultados se encuentran en la carpeta `auditoria`, en archivos terminados en `V7_19`. No equivalen a pruebas visuales de navegador real ni a probar el micrófono o la calidad de voz en un iPhone o iPad físico. No se realizó nueva validación clínica del banco.

Para actualizar GitHub Pages, reemplazar el contenido publicado con los archivos de esta carpeta, incluyendo el nuevo `settings.js`. El identificador de caché se actualizó. Las claves de estadísticas, favoritos y sesiones se mantienen. Los documentos de versiones anteriores se conservan como antecedentes históricos; este documento describe el nuevo menú.

No se ha publicado la aplicación desde este chat.

## Documentación de implementación

- Voces expuestas por el navegador: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices
- Patrón de interacción de ventana modal: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
