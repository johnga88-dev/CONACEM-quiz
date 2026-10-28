# SurgiPrep 7.23.14 Beta — Edición corregida

28 de octubre de 2026. Basada en el ZIP 7.23.12 auditado en esta conversación. El número 7.23.14 distingue esta edición de la 7.23.13 ya existente; no se afirma que se haya integrado su código.

## Correcciones

- **Notas de revisión:** admite notas como texto o lista y escapa su contenido. Los IDs 2628, 2630, 2672, 2679, 2684, 2689 y 2692 muestran su corrección sin la excepción de `.map`. Las notas de tipos inesperados se ignoran de forma segura, sin modificar el banco.
- **Continuidad:** guarda la respuesta y la finalización antes de presentar la corrección, para que un error posterior de visualización no deje el último snapshot atrasado.
- **Importación:** impide que el estado transitorio vacío sobrescriba una sesión recién importada; detiene el audio anterior. Se probaron los cuatro cruces entre modalidad actual y modalidad importada, conservando ambas sesiones, cola, posición y respuestas.
- **Examen:** captura el umbral y el perfil de la prueba al iniciarla y los conserva al recuperar la sesión. Cambiar ajustes prepara una próxima prueba; no cambia el criterio de la activa. Las sesiones antiguas sin el campo nuevo usan su configuración guardada. El simulacro bloquea sus cuatro selectores mediante `disabled` nativo.
- **Respaldos:** admite únicamente IDs numéricos positivos seguros para estadísticas y descarta claves especiales. Normaliza contadores a enteros no negativos; correctas no supera intentos, incorrectas se calcula como intentos menos correctas y racha se limita a correctas. Conserva metadatos desconocidos e historial de IDs numéricos retirados. La importación avisa si normalizó datos.
- **Distribución:** README, versión visible, respaldo, manifiesto y build-info se actualizan. Se identifica la referencia histórica ausente a VERIFICACION.json y se enlazan las verificaciones nuevas.
- **Caché:** cada edición sirve primero sus recursos instalados, sin sustituir individualmente scripts/banco por una respuesta de otra edición. El nuevo worker espera su activación normal, sin skipWaiting ni clients.claim forzados. Las escrituras de recursos faltantes terminan dentro de respondWith; no quedan actualizaciones de fondo sin vida útil protegida. Las rutas de limpieza siguen limitadas a cachés de SurgiPrep.

## Banco y diseño conservados

2.600 preguntas, 26 bloques de 100, imágenes, claves, explicaciones y marcas de revisión idénticas a la base. questions.json conserva byte por byte la huella:

```
37ade71a30dae981988262f0ff237d2a8888372550786ac8468f307356735400
```

No se agregaron ni retiraron preguntas. No se cambiaron las claves de almacenamiento, el diseño, las voces ni la fórmula de puntuación. Los documentos LEEME anteriores son antecedentes históricos; README y este archivo describen la edición vigente.

## Pruebas nuevas

61 casos de lógica y APIs simuladas pasaron: 29 del arnés de lógica, 11 adicionales, 12 regresiones específicas y 9 de caché. Algunos casos recorren muchas entradas: la presentación de corrección se ensayó con los 2.600 registros y hubo 81 combinaciones de contadores inválidos. El número de casos no es una medida global de calidad.

Además: sintaxis de los cuatro scripts principales, estructura y bloques, 26 lecturas parciales, descarga HTTP de 13 recursos centrales, integridad de imágenes y comparación de bytes de todos los archivos originales. Los resultados y scripts están en auditoria/.

Las pruebas de lógica usan Node.js VM, DOM y almacenamiento sintéticos. Las APIs de voz, FileReader y service worker también se simulan. **No hubo render de navegador real ni prueba física de Safari, voz o micrófono en iPhone/iPad.** No se afirma compatibilidad visual validada, funcionamiento real offline o prueba entre pestañas. La mitigación de los riesgos de caché debe comprobarse en navegador real. Siguen pendientes las verificaciones visuales/de foco y tamaño de selectores señaladas en R03 de la auditoría base; el bloqueo nativo del simulacro sí se corrigió y probó en el DOM simulado.

Sin nueva validación clínica independiente ni calibración psicométrica. Se conservan las 2.247 marcas pendientes. Esta entrega no incorpora servicios de sincronización ni se ha publicado.

## Actualización

1. Exporta tu respaldo desde Rendimiento y conserva el archivo.
2. Usa el paquete completo para reemplazar los archivos de la misma web, conservando su dirección. El ZIP es fuente lista para alojamiento estático; no se ejecuta como aplicación completa abriendo el ZIP ni por file://.
3. Tras publicar todos los archivos, cierra las pestañas y ventanas de la aplicación y vuelve a abrirla. El worker espera que dejen de usarse las páginas controladas antes de activar la nueva edición. Puede necesitar una navegación adicional; comprueba que Ajustes muestre 7.23.14 Beta.
4. Comprueba sesión, estadísticas y favoritos. Si cambias de dirección, dispositivo o perfil de navegador, importa el respaldo para trasladarlos. No se borra localStorage al actualizar caché.

Los recursos instalados se mantienen durante la edición de caché. Los futuros cambios de distribución deben incrementar la clave de caché/worker y publicarse como paquete completo para que una instalación existente los reciba. No hay límite de cuatro segundos que esperar cuando existe copia: se sirve inmediatamente. Sin copia previa y sin red, no se promete arranque offline. El reconocimiento de voz puede necesitar conexión aunque el cuestionario esté disponible offline.

## Reproducir

Desde la carpeta auditoria, con Node.js y Python/Pillow, indicando la carpeta raíz de la app:

```sh
node audit_logic.cjs .. .
node audit_async.cjs .. .
node regression_fixes.cjs .. .
node regression_sw.cjs .. .
python audit_integrity.py .. .
```

Estos scripts no modifican el código ni el banco. Escriben sus archivos de resultados y usan datos sintéticos. audit_async.cjs levanta un servidor local efímero limitado al entorno de prueba. No se deben ejecutar con progreso real del usuario. La matriz/VERIFICACION son la evidencia de esta entrega y deben actualizarse por separado si cambia el código.
