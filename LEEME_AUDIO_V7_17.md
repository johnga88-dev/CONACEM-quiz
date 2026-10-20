# SurgiPrep — modo audio compacto

Versión de distribución: 7.17 Beta. Fecha: 19 de octubre de 2026.

La bocina está en la esquina superior derecha del área del enunciado, junto a la dificultad. Sustituye al desplegable de práctica por voz. Tiene un área táctil de 44 × 44 píxeles y un icono de 22 × 22 píxeles.

## Funcionamiento

1. Toca la bocina para activar el modo audio. Queda resaltada mientras siga activo.
2. Lee el enunciado y sus datos de laboratorio, cuando están separados, y luego las cinco alternativas. Si existe una imagen, recuerda revisarla en pantalla.
3. Dos segundos después de terminar realmente la última alternativa, inicia el reconocimiento de una respuesta por micrófono.
4. Di A, B, C, D o E. También admite «alternativa B», «letra C» y alfa, bravo, charlie, delta o eco. No se pide confirmación adicional.
5. Registra la respuesta y dice «Correcto» o «Incorrecto». En estudio lee inmediatamente solo la explicación principal: no narra el análisis de las cinco alternativas, las fuentes ni las advertencias editoriales. En examen se detiene tras el veredicto, sin explicar ni decir la letra correcta.
6. Avanza con Siguiente. Con la bocina activa, empieza a leer la nueva pregunta automáticamente. No avanza por sí sola al terminar de explicar.
7. Toca otra vez la bocina para desactivar todo el modo audio. Se cancelan la lectura, la espera pendiente y la escucha activa.

El veredicto inmediato en examen es una característica expresa de este modo audio; el examen táctil con audio apagado conserva la corrección al finalizar. Las respuestas del examen continúan siendo modificables hasta finalizar, conforme al comportamiento anterior.

## Permisos e interrupciones

El navegador debe autorizar el micrófono. Si no permite iniciarlo automáticamente, si la respuesta es ambigua o si el servicio falla, aparece un pequeño botón de recuperación «Reintentar micrófono»; no se repite un ciclo de solicitudes de permiso automáticamente. Si no hay reconocimiento disponible, se conserva la lectura y se responde tocando las alternativas.

Cada turno utiliza un reconocedor nuevo; se cierra antes de narrar el resultado. No se mantiene abierto mientras la aplicación lee. Un servicio que no devuelva eventos se cancela después de veinte segundos. Un fallo de lectura no se toma como final válido para abrir el micrófono.

Al pasar a otra aplicación, salir del panel de preguntas, abrir una imagen o un formulario, se interrumpe el turno actual. Volver a la aplicación no enciende el micrófono inesperadamente. La bocina sigue armada para la siguiente pregunta; también puede desactivarse y reactivarse. Al cerrar o recargar la aplicación, el audio queda apagado aunque se recupere la sesión de preguntas.

SurgiPrep no graba ni guarda el audio o la transcripción. El servicio de reconocimiento del navegador puede procesar audio fuera del dispositivo y necesitar conexión. La disponibilidad y los permisos dependen del navegador y del sistema. No se garantiza reconocimiento de voz sin conexión ni funcionamiento con la pantalla bloqueada.

## Comprobaciones

- Pruebas de lectura, espera, reconocimiento, cancelación y regresión: `auditoria/PRUEBAS_AUDIO_V7_17.json`.
- Pruebas del banco, filtros, sesiones, simulacro, persistencia y respaldo: `auditoria/PRUEBAS_APLICACION_V7_17.json`.
- Pruebas de caché: `auditoria/PRUEBAS_CACHE_V7_17.json`.

Las pruebas de voz utilizan síntesis y reconocimiento simulados. No equivalen a haber probado el micrófono o la reproducción sonora en un iPhone o iPad físico. Safari y otros motores pueden requerir una interacción adicional o presentar interrupciones; por eso se incluye recuperación manual.

## Contenido y actualización

Se conservan exactamente las 1.419 preguntas de la versión 7.16 y sus avisos clínicos. Las 81 preguntas de teoría entregadas como paquete aparte todavía no están incorporadas. Este cambio se limita a la aplicación.

Para actualizar GitHub Pages, utiliza el contenido de esta carpeta como reemplazo de los archivos de la aplicación en la misma dirección. Se conservan las claves de almacenamiento de estadísticas, favoritos y sesiones. Se actualiza el identificador de caché para sustituir el anterior. No es necesario borrar los datos del sitio para instalar esta versión. Los archivos anteriores de lectura y auditoría incluidos son históricos; este documento describe el nuevo control de audio.

No se ha realizado despliegue ni validación clínica nueva.

## Documentación técnica consultada

- Lectura y fin real de un fragmento: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/end_event
- Reconocimiento y limitaciones del navegador: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- Implementación de reconocimiento en Safari: https://webkit.org/blog/11648/new-webkit-features-in-safari-14-1/
- Reporte abierto de interrupciones al alternar voz y reconocimiento, consultado el 19 de octubre de 2026: https://bugs.webkit.org/show_bug.cgi?id=321436

El reporte es evidencia de una incidencia comunicada, no una garantía de que afecte a todos los dispositivos ni de que una medida la resuelva universalmente.
