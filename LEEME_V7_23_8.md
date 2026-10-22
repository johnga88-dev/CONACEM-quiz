# SurgiPrep 7.23.8 Beta — 2.146 preguntas

Aplicación completa basada en la versión 7.23.7 adjunta. Se integran una sola vez las 146 preguntas del complemento OPE, sin cambios clínicos por parte de la integración.

- Total: 2.146 preguntas y 22 bloques. Bloques 1–20: 100 cada uno; bloques 21 y 22: 73 cada uno.
- Se conservan intactos los 2.000 objetos anteriores, sus identificadores y todos sus recursos. Nuevos IDs: 2125–2270; se respetan sus bloques explícitos, aunque no coincidan con ID/100.
- Se preservan todos los campos aportados de las 146 preguntas, incluidas procedencia, fuentes y revisión pendiente.
- La interfaz ya soportaba bloques explícitos y recuentos variables: no se cambia su lógica. Se conservan navegación fija, gestos, explicación automática, análisis plegable, audio, estadísticas, sesiones, preferencias y respaldo.
- Versión, información del banco, respaldo, manifiesto y caché actualizados.
- LECTURA_BANCO/INDICE.html permite acceder a los 22 bloques sin instalar la app. Se añaden las lecturas y archivos JSON de los dos bloques OPE.
- Documentación original del complemento en auditoria/banco_OPE_21_22/; registro de integración y pruebas en auditoria/.

## Actualización
Exporta tu respaldo y publica todos los archivos en la misma dirección de GitHub Pages. El paquete no se ha desplegado automáticamente. Las claves de almacenamiento se conservan: no hay que borrar datos para actualizar.

Una sesión reanudada mantiene su cola, posición y respuestas. Pulsa «+ Nueva» para incluir las preguntas nuevas según tus filtros. También puedes seleccionar directamente los bloques 21 o 22. El simulacro conserva 100 preguntas y 120 minutos; un examen filtrado por un bloque OPE utiliza como máximo sus 73 preguntas disponibles.

Los 146 registros nuevos mantienen revisión clínica independiente pendiente. La integración técnica no constituye validación clínica. Sin prueba física de voz/micrófono en iPhone/iPad; alcance de comprobaciones en auditoria/PRUEBAS_V7_23_8.json.
