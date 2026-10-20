# SurgiPrep 7.22.3 Beta — Revisión de código

Sin cambios en el banco de 1.500 preguntas, en la interfaz ni en el audio. Corrige errores y mejora seguridad, robustez y rendimiento.

## Seguridad
- Texto sin escapar insertado como HTML: reportes, motivos de error, favoritos, rendimiento, resultados del examen, datos de laboratorio y temas. Un reporte o un respaldo importado con código HTML podía ejecutarlo. Ahora todo se escapa con `escapeHTML`.

## Robustez
- Si `localStorage` tenía un dato dañado, la aplicación no abría (error en `JSON.parse` al inicio). Ahora se ignora el dato ilegible y la app carga.
- `persist()` no manejaba almacenamiento lleno o bloqueado: ahora avisa y sugiere exportar respaldo.
- Importar respaldo: valida el archivo y los tipos de datos, pide confirmación antes de reemplazar el progreso y permite volver a elegir el mismo archivo. Antes, un archivo con tipos incorrectos rompía las pestañas.
- Exportar en iOS/Safari: el enlace de descarga se liberaba antes de que empezara la descarga.
- Botones Favorito, Revisar y Guardar reporte protegidos cuando no hay pregunta.

## Funciones
- «Casos encadenados» siempre mostraba «No hay preguntas»: el banco no tiene `case_id`. La opción queda deshabilitada con aviso.
- El resumen de filtros mostraba «Aleatorio» en vez de «Todo el banco» con la configuración por defecto, y no se actualizaba con «+ Nueva».
- Las estadísticas guardaban la dificultad y el tema del momento del primer intento; tras reclasificaciones, «Temas débiles» y el panel usaban datos desactualizados. Se sincronizan con el banco al abrir.
- Cambiar de tema regeneraba los subtemas sin orden ni escape (código duplicado). Ahora usa `refreshSubtopics()`.
- Voz: acepta también «la B».
- «Objetivos menos vistos» y «Repaso adaptativo» presentaban siempre el mismo orden en los empates; ahora varían.

## Rendimiento
- «Objetivos menos vistos», «Temas débiles» y «Repaso adaptativo» recorrían todas las estadísticas por cada pregunta dentro del ordenamiento (~85 ms en escritorio, bastante más en móvil). Ahora usan índices precalculados (~5 ms).
- Logo del encabezado: 1,8 MB → 118 KB (288 px, nítido a 3×).
- Service worker: ya no precachea `logo-app.png` (1,8 MB, no usado), no descarga `questions.json` dos veces al instalar, usa la copia guardada si la red tarda más de 4 s, abre `index.html` sin conexión y no intercepta enlaces externos.

## Pruebas (Chromium, Playwright)
Carga, estudio, examen, recuperación de sesión, uso sin conexión, exportar/importar respaldo, inyección HTML en reportes y respaldo, almacenamiento dañado y ordenamientos con 1.500 estadísticas: todo correcto.
Pendiente: probar la voz y el micrófono en un iPhone físico.
