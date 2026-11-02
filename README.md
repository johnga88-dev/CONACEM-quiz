# SurgiPrep 7.23.20 Beta

Paquete estático completo para GitHub Pages. **2.500 preguntas · 25 bloques de 100 · numeración pública 1–2500.** Última entrega anterior: 7.23.18. Se incorpora la corrección de la preparación 7.23.19 que quedó pendiente de entrega.

## Cambios

### Navegación del examen terminado

Los recuadros numerados muestran verde y ✓ para respuestas correctas, rojo y ✕ para incorrectas, gris y — para preguntas sin responder. El recuadro seleccionado conserva un borde distintivo y las preguntas marcadas conservan su marca. Los controles incluyen título y etiqueta accesible con posición dentro del examen, número público de la pregunta y estado.

Los resultados solo aparecen al finalizar el examen, manualmente o por agotarse el tiempo. Durante el examen continúan azules las respondidas y neutras las omitidas: no se revela acierto/error mediante colores, símbolos o etiquetas. Al recuperar un examen terminado se reconstruyen los estados desde las respuestas guardadas, sin nuevas claves de almacenamiento ni duplicación de intentos. Un examen nuevo elimina los colores de resultado anteriores.

### Correcciones pendientes del banco

- **ID 895, pregunta pública 870, bloque 9:** se incorpora la corrección de síndrome compartimental. La explicación anterior describía fasciotomía y no fundamentaba el cálculo de presión diferencial. El enunciado pide ahora el cálculo de ΔP y la explicación aclara su interpretación clínica, sin diagnóstico automático por una medición aislada. Se completaron los cinco fundamentos. La clave B no cambia. Cotejo dirigido de BOASt 2025.
- **ID 1049, pregunta pública 1021, bloque 11:** se separa sospecha N2 por imagen de confirmación tisular. El enunciado pregunta explícitamente por el siguiente paso de estadificación antes de decidir tratamiento; ya no presenta mediastinoscopia/EBUS como tratamiento. Se corrige T1 como categoría del tumor primario, eliminando su expansión errónea como raíces nerviosas. La opción A especifica muestreo mediante EBUS-TBNA, complementado por EUS cuando corresponda; se completan explicación y cinco fundamentos. La clave A y el objetivo de estadificación se conservan. La guía primaria ERS/ESGE/ESTS 2026 favorece endosonografía para estadificación tisular inicial cuando está indicada. Se consultaron recomendaciones indexadas; el acceso directo al texto completo estaba bloqueado, por lo que no se afirma lectura íntegra.
- Se conserva la corrección anterior de **CID = cuadrante inferior derecho** en ID 974, pregunta pública 948.

Las explicaciones corregidas son redacción de SurgiPrep y no se atribuyen al Manual Washington. source_original conserva el registro histórico, que no es el texto actual mostrado. Las fuentes y notas permiten distinguir el cotejo dirigido de la validación clínica independiente, que sigue pendiente.

## Conservación del banco y progreso

**0 preguntas agregadas, 0 eliminadas, 0 trasladadas, 0 renumeradas.** Se conservan todos los IDs, números públicos, bloques y claves de respuesta. Respecto de la última entrega 7.23.18, se corrigen dos registros clínicos, IDs 895 y 1049. Las alternativas solo cambian en A del ítem 1049 para explicitar toma de tejido y la preferencia inicial actual.

Se mantienen las exclusiones de cirugía pediátrica y cardíaca y las preguntas conservadas de trauma cardíaco y neurotrauma pertinente. Se conservan diseño, logo, temas, audio, accesibilidad previa, ajustes, modos de estudio/examen, favoritos, reportes y exportación/importación. No se realiza recalificación retroactiva del historial de la pregunta anteriormente ambigua.

No se cambian claves de almacenamiento ni esquema del respaldo. Las correcciones conservan identidad y claves, y el resultado de cada recuadro se calcula desde los datos existentes. La actualización de caché conserva el ciclo normal, sin activación forzada mediante skipWaiting ni clients.claim.

## Actualizar en GitHub Pages

1. Exporta un respaldo del progreso.
2. Extrae el ZIP y reemplaza el contenido completo de la carpeta publicada, conservando la misma dirección. index.html debe quedar en la raíz de esa carpeta. Incluye app.js, style.css, questions.json, sw.js, manifest.json y todas las carpetas de recursos.
3. Abre con conexión para descargar la nueva edición; cierra después todas las pestañas y ventanas/PWA de SurgiPrep y vuelve a abrir para activar normalmente la caché.
4. Comprueba **7.23.20 Beta** en Ajustes. No borres datos del sitio ni almacenamiento local.

No se publicó ni desplegó esta entrega.

## Validación y límites reales

Resultados actuales en `auditoria/pruebas_72320`:

- **Pruebas automatizadas de lógica:** estados correcto/incorrecto/omitido, ausencia de resultados durante el examen, inicio de otro examen, recuperación sin intentos duplicados, continuidad de preguntas corregidas, persistencia, importación y caché con DOM y APIs simulados.
- **Integridad:** comparación con 7.23.18, todos los IDs, números, bloques y claves; las 25 lecturas JSON/HTML coinciden con el banco; sintaxis JavaScript, recursos, duplicados exactos y coherencia de versión/caché.
- **Accesibilidad estática:** etiquetas y símbolos comprobados en renderizado simulado; contraste calculado de texto blanco sobre fondos verde, rojo y gris. La selección permanece diferenciada.
- **Navegador real:** se intentó iniciar Chromium con Playwright, pero no había ejecutable instalado. La prueba no llegó a ejecutarse; el informe indica NO_EJECUTADO y el script queda incluido para un entorno que disponga de Chromium. No se afirma validación visual real.
- **Dispositivos físicos:** no probados. Safari, iPhone/iPad, voz, micrófono, gestos e instalación PWA física siguen pendientes. Las pruebas simuladas no demuestran compatibilidad física.
- **Clínica:** cotejo dirigido de las fuentes declaradas para los dos ítems corregidos; sin auditoría clínica integral ni validación clínica independiente de todo el banco.

Los informes históricos conservan su versión y no representan comprobaciones nuevas.
