# SurgiPrep 7.23.10 Beta — 2.300 preguntas

Veintitrés bloques de cien. Esta versión agrega 100 preguntas originales en el bloque 23, sin modificar las 2.200 preguntas anteriores. Nuevos identificadores: 2325–2424. Próximo identificador libre: 2425. Los bloques se determinan por el campo explícito `block`, no por dividir el ID.

Ochenta preguntas se distribuyen entre las ocho áreas con menor cobertura previa: pediatría, cirugía cardíaca, hematología quirúrgica, endoscopia, intestino delgado, trasplantes, cirugía torácica y pared abdominal. Las veinte restantes abarcan generalidades y plástica/piel. Cada una de estas diez áreas recibe diez incorporaciones. No se incorporan ginecología, urología ni ortopedia.

El bloque tiene cinco alternativas independientes por pregunta, una mejor respuesta, explicación, cinco razonamientos alineados y referencias identificables. Contiene veinte respuestas correctas por cada letra. La consulta bibliográfica se realizó de forma dirigida al 24 de octubre de 2026, incluyendo actualizaciones pertinentes de 2025 y 2026. No es una revisión sistemática ni una certificación de que no exista otra actualización. Las referencias históricas se conservan en conceptos técnicos o metodológicos estables.

## Archivos para usar

- Aplicación completa: este paquete con index.html y sus carpetas.
- Lectura de los 23 bloques: LECTURA_BANCO/INDICE.html.
- Lectura de las 100 nuevas: LEER_BLOQUE_23.html.
- Solo el bloque nuevo para importar: BLOQUE_23_NUEVAS_100.json. Añadir una sola vez, sin reemplazar el banco completo con ese archivo.
- Datos, bibliografía, continuidad y revisión técnica: auditoria/banco_23/.

## Actualizar una instalación

Exporta un respaldo desde la app y sustituye los archivos en la misma dirección de publicación manteniendo carpetas. Se conservan claves de almacenamiento, IDs anteriores, preferencias y recursos. No es necesario borrar datos. No se ha desplegado automáticamente.

Las sesiones reanudadas conservan su cola. Inicia una sesión nueva con «+ Nueva» o selecciona el bloque 23 para incluir las incorporaciones. La navegación, gestos, audio y análisis plegable conservan su lógica.

La revisión clínica independiente del nuevo bloque sigue pendiente. La dificultad es editorial y no está calibrada empíricamente. Se comprueba la carga del banco y la selección de cien preguntas por bloque en estudio y examen mediante pruebas JavaScript con DOM simulado. No se realizaron pruebas físicas de voz en iPhone/iPad ni una auditoría clínica nueva de las 2.200 preguntas previas. Alcance y resultados: auditoria/PRUEBAS_V7_23_10.json. Los documentos de versiones anteriores son históricos.
