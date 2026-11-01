# SurgiPrep 7.23.17 Beta

Aplicación estática completa para GitHub Pages. Banco vigente: **2.500 preguntas, 25 bloques de exactamente 100**, numeradas 1–2500.

## Cambios solicitados

Se retiraron **188 preguntas**: **98 de cirugía pediátrica** (79 de la categoría y 19 casos pediátricos/adolescentes en otros temas) y **90 de cirugía cardíaca** (86 de la categoría y 4 en otros temas). La lista con ID, número anterior, bloque y motivo está en `auditoria/PREGUNTAS_RETIRADAS.json`. Se conservaron todas las preguntas de trauma cardíaco, incluidas lesiones penetrantes, contusas, taponamiento y toracotomía de reanimación. Se conservó la evaluación cardiovascular perioperatoria de cirugía no cardíaca.

Las 2.412 preguntas conservadas mantienen su ID y contenido. Se incorporaron **88 preguntas originales** para completar bloques: resultado **25 × 100 = 2.500**. Las nuevas usan IDs 2725–2812; ningún ID retirado se reutiliza. Se revisaron fuentes primarias o recomendaciones oficiales en consultas dirigidas; se incluyen 28 fuentes y fecha de consulta. No se declara validación clínica independiente ni revisión sistemática. Hay 62 casos y 26 preguntas de lectura crítica/metodología aplicada a investigación quirúrgica. El nivel de dificultad es editorial, sin calibración empírica.

La numeración pública se compacta conservando el orden relativo anterior y añadiendo las nuevas al final. **1.104 preguntas existentes cambian de bloque**, para completar rangos de cien; no cambia su identidad. El detalle anterior/nuevo está en `auditoria/MAPA_CONTINUIDAD.csv`. La numeración vigente está en `NUMERACION_BLOQUES_1_A_25.csv` y en las 25 lecturas de `LECTURA_BANCO`.

El ítem de imagenología ID 1694 se conserva: evalúa hipoperfusión/isquemia intestinal en shock; una mención contextual a cirugía cardíaca no lo convierte en una pregunta de esa especialidad. No se ha reescrito contenido clínico de preguntas conservadas.

## Progreso y sesiones

No se cambian claves de almacenamiento. Respuestas, favoritos, reportes y estadísticas siguen asociados al ID estable. Los datos de preguntas retiradas permanecen en el historial local y en el respaldo; se excluyen de totales/listados del banco activo. Las nuevas no heredan respuestas de preguntas retiradas.

- Estudio guardado: se conservan los IDs aún activos, sus respuestas y el orden; se quitan de la cola los retirados. Si ya no queda ninguno, la app prepara una sesión nueva.
- Examen guardado sin preguntas retiradas: se conserva por ID, incluso si cambian número y bloque.
- Examen guardado con preguntas retiradas: se rechaza su recuperación y se solicita iniciar uno nuevo; no se recalifica una cola recortada.
- El bloque 26 deja de existir. Los filtros de la edición anterior deben revisarse después de actualizar. La posición dentro de una sesión aleatoria no es el número público.

## Actualización manual en GitHub Pages

1. Exporta un respaldo del progreso.
2. Extrae el ZIP y utiliza su contenido como carpeta publicada completa, con `index.html` en la raíz de esa carpeta. Conserva la misma dirección de la app. Este paquete ya contiene los recursos de ejecución, imágenes, iconos y manifiesto.
3. Sustituye el banco y las lecturas por los actuales; retira lecturas/exportaciones antiguas, incluido el bloque 26, para no dejar copias públicas obsoletas. Los bancos parciales y auditorías clínicas históricas del ZIP anterior no se incluyen como contenido vigente en esta entrega. El ZIP anterior permanece como respaldo independiente.
4. Abre la app con conexión, permite que descargue la actualización, cierra todas sus pestañas y ventanas/PWA y vuelve a abrir. Se conserva la activación normal del service worker, sin `skipWaiting` ni `clients.claim`.
5. Comprueba en Ajustes **7.23.17 Beta**, **2.500 preguntas · 25 bloques**, y en el selector el último rango **2401–2500**. No borres datos del sitio ni almacenamiento local.

No se realizó publicación o despliegue.

## Verificación y límites

Resultados en `auditoria/pruebas_72317`:

- Comparación de todos los IDs y contenido conservado; ausencia de las 188 preguntas retiradas; protección de trauma cardíaco.
- 25 bloques de 100; números únicos y consecutivos; coherencia de JSON, CSV y lecturas HTML; identificadores y objetivos nuevos únicos; ausencia de enunciados idénticos normalizados.
- Recuperación e importación de progreso, sesiones con IDs realmente retirados, historial y favoritos; nuevos IDs sin progreso heredado.
- Renderizado simulado de las 2.500 preguntas y regresiones de lógica, persistencia y caché. Los arneses previos se adaptaron solo al nuevo conteo de dificultad y al último bloque 25.
- Sintaxis JavaScript, recursos de ejecución y ZIP comprobados.

Son pruebas automatizadas en Node con DOM, almacenamiento, voz y caché simulados, además de comprobaciones de archivos. **No son pruebas en navegador real ni en iPhone/iPad físicos.** La voz, el micrófono, gestos e instalación PWA física siguen sin verificarse. **La revisión clínica independiente queda pendiente**, incluida la de las nuevas preguntas. El cotejo de fuentes no sustituye esa revisión.
