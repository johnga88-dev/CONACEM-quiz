# SurgiPrep — AEC3, bloques 25 y 26

Fecha: 27 de octubre de 2026.

Se leyeron individualmente las 197 capturas del paquete AEC3 y se cotejaron visualmente. Se consolidaron seis repeticiones: 264/401, 297/398, 317/386, 319/364, 351/435 y 369/370. Resultan 191 objetivos adaptados y nueve extensiones explícitas para completar dos bloques de cien. Las extensiones no se presentan como fotografías nuevas. El manifiesto relaciona todas las capturas, su huella y sus nuevos identificadores.

## Alcance

Banco de entrada: 2.400 preguntas, versión de contenido 7.23.11. Se conservan íntegros sus 2.400 objetos, identificadores, recursos y marcas. Se agregan IDs 2525–2724 en bloques explícitos 25 y 26. No calcular bloque desde ID ni reutilizar IDs retirados. Total de salida: 2.600 preguntas, 26 bloques de cien. AEC y AEC2 ya estaban incorporados en bloques 21/22 y no se vuelven a añadir.

Base de interfaz: versión posterior EXAMEN_COMPACTO_2300. Se comprobó que sus primeras 2.300 preguntas coinciden con la base de 2.400. Se recuperó el bloque 24 existente y se añadieron las 200 nuevas. Se conserva botón Iniciar examen y selectores compactos. Solo se actualizan versión, contadores, nombres de exportación y clave de caché; no se despliega ninguna web.

## Revisión y límites

Cada nueva pregunta tiene cinco alternativas autónomas, clave de cero a cuatro y cinco razonamientos alineados. Las referencias distinguen guías, estudios originales y documentación oficial de educación/anatomía. El acceso fue dirigido a apartados, resúmenes y extractos públicos; no se declara lectura íntegra de todos los documentos, una revisión sistemática ni validación independiente. Las fuentes históricas se emplean para anatomía o conceptos estables, no para imponer tratamientos actuales. Una recomendación internacional no demuestra registro, disponibilidad ni cobertura en Chile.

Cambios importantes de la fuente: reanimación con sospecha de lesión cerebral, actividades básicas frente a instrumentales, invasión rectal T1/T2, vigilancia de microcarcinoma tiroideo, inmunoterapia gástrica en 2026, umbral ganglionar pancreático según guía, posibilidad infrecuente de malignidad en nevus epidérmico y supresión con dexametasona. Las claves de las fotografías no se adoptan automáticamente.

Se preservan exclusiones de ginecología, urología y ortopedia como objetivo principal. El embarazo en hiperparatiroidismo se usa como contexto de cirugía endocrina. No se incorporan imágenes sintéticas ni capturas de preguntas como imagenología clínica; las nuevas preguntas no requieren una figura para responder.

La dificultad es editorial y no está calibrada. Algunas preguntas de conceptos básicos de la fuente se clasifican Fácil, sin inflarlas a Difícil. Las 200 nuevas mantienen marca clínica pendiente. El examen estructural no demuestra que todo distractor o decisión esté validado por un segundo cirujano. El cotejo de redundancias globales se limita a identidad de texto y revisión de objetivos de esta tanda; coincidencias conceptuales con el banco previo no quedan descartadas por completo.

## Integración

Usar questions.json completo. Para integrar sobre una versión posterior, comparar por identificador y conservar cambios ajenos a contenido. No sustituir una versión más nueva de interfaz sin compararla. Los nueve complementos se identifican en source_trace.adaptation_note. El archivo LEER_AEC3_200.html permite lectura, búsqueda y despliegue de respuestas; las lecturas de bloques 25/26 también están en LECTURA_BANCO.

No se ha realizado prueba física de voz o interacción en iPad. El paquete es fuente local utilizable; no es una publicación nueva. El VERIFICACION.json mencionado en la entrega original no estaba incluido. Las comprobaciones nuevas de esta edición están en auditoria/VERIFICACION_V7_23_14.json; no acreditan las afirmaciones históricas de cotejo visual AEC3.
