# SurgiPrep 7.23.0 Beta — 2.000 preguntas

Aplicación completa para GitHub Pages basada en 7.22.3. Se conservan sus correcciones de seguridad, almacenamiento, respaldos, audio y rendimiento.

## Integración
- Banco R06 completo, idéntico byte a byte al recibido: 2.000 preguntas, IDs 1–2000 y veinte bloques de cien.
- 500 incorporaciones respecto de la aplicación anterior (1501–2000). Se integran también las correcciones del banco en 26 preguntas previas; campos e identificadores en auditoria/INTEGRACION_V7_23_0.json. No son cambios clínicos redactados por el chat de interfaz.
- Todos los recursos visuales aportados y sus atribuciones incluidos. Las figuras con varios paneles se muestran completas y se amplían con el control existente; no son series DICOM completas.
- 47 valores «Intermedia» se interpretan como «Intermedio» al cargar, para compatibilidad de presentación, filtros y estadísticas. El JSON original permanece idéntico.
- Información del banco, versión, nombres de respaldo, manifiesto y caché actualizados.
- La documentación recibida del banco se conserva en auditoria/banco_R06/. La distribución GitHub 7.22.3 no incluía el historial antiguo de auditoría; esta entrega no lo reconstruye.

## Actualización y continuidad
Publica el contenido completo de esta carpeta en el mismo repositorio y dirección de GitHub Pages, manteniendo index.html en la raíz de publicación. Este ZIP no se ha desplegado. Conserva cualquier documentación histórica adicional que ya exista en tu repositorio.

Exporta un respaldo antes de actualizar. Se mantienen las claves de almacenamiento y los identificadores; no se borra progreso. Una sesión reanudada conserva su cola: pulsa «+ Nueva» para incluir las nuevas preguntas según tus filtros. Las correcciones de contenido no recalculan intentos históricos.

La caché cambia de versión sin borrar el almacenamiento de progreso. Las imágenes quedan disponibles sin conexión una vez que termina su descarga inicial. El reconocimiento de voz puede requerir conexión y permisos del sistema.

El banco continúa pendiente de validación clínica independiente. Las pruebas de software no lo validan clínicamente. No se ha comprobado voz ni micrófono en un iPhone/iPad físico.

Ver auditoria/PRUEBAS_V7_23_0.json para las verificaciones ejecutadas en esta entrega.
