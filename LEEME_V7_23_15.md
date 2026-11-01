# SurgiPrep 7.23.15 — Numeración consecutiva de bloques

Base: 7.23.14 corregida. Las 2.600 preguntas se presentan con numeración del 1 al 2600: bloque 1, 1–100; bloque 2, 101–200; ...; bloque 26, 2501–2600.

Los 26 bloques ya tenían 100 preguntas. El desfase provenía de IDs históricos con huecos y asignaciones explícitas de bloque. Se conserva la composición de los bloques y se ordena cada uno por su ID histórico para asignar el nuevo campo `number`. No fue necesario trasladar preguntas entre bloques.

## Identidad y progreso
`number` es el número visible de la pregunta; `id` sigue siendo el identificador interno estable. No son el mismo campo. Los IDs internos no se renumeran ni se reutilizan: así el progreso previo, las respuestas guardadas, los favoritos y los reportes siguen enlazados a la misma pregunta. No se necesita migrar las claves de almacenamiento.

La posición 1/100 de una sesión aleatoria indica posición en esa sesión, no el número fijo de la pregunta. La tarjeta, los filtros, favoritos, reportes y lecturas muestran la numeración nueva. Los reportes de preguntas retiradas se identifican como históricos.

Se incluye NUMERACION_BLOQUES_1_A_26.csv con número visible, bloque e ID interno para trazabilidad. El mapa completo también está en auditoria/NUMERACION_V7_23_15.json. Los archivos históricos de auditoría conservan sus referencias originales.

## Conservación
No se agregan ni se eliminan preguntas. Se mantienen enunciados, alternativas, claves, explicaciones, imágenes y fuentes. Solo se agrega el número público y se ordena el arreglo; el contenido clínico permanece igual. Se conservan las correcciones de persistencia, importación, umbral de examen y caché de 7.23.14. Las lecturas de bloques y exportaciones vigentes se actualizan con la misma numeración.

## Actualizar
Exporta un respaldo. Publica el paquete completo en la misma dirección de GitHub Pages. Cierra las pestañas/ventanas de la app y vuelve a abrir para permitir la activación normal de la nueva caché; comprueba 7.23.15 en Ajustes. No borres almacenamiento ni progreso. Las sesiones reanudadas conservan su orden y posición; «+ Nueva» crea una selección nueva conforme a filtros.

Paquete no desplegado. Pruebas y límites en auditoria/PRUEBAS_V7_23_15.json. Sin comprobación visual o física de Safari/voz. La revisión clínica independiente continúa pendiente.
