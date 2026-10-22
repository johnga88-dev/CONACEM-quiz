# SurgiPrep 7.23.5 Beta

**1.876 preguntas. Banco R08 sin ginecología, urología ni ortopedia.**

Se retiraron doce preguntas ortopédicas adicionales sin modificar los objetos ni identificadores restantes. Las exclusiones y las reglas para futuros bloques están en `auditoria/banco_R08/`.

Conserva todas las funciones de 7.23.4: gestos horizontales para cambiar de pregunta, navegación fija inferior, desplazamiento hasta el inicio al navegar, explicación automática en Estudio, análisis de alternativas desplegable, audio y preferencias. No cambia la lógica de estas funciones.

El historial y los favoritos permanecen en el dispositivo y en los respaldos. Solo las preguntas vigentes participan en listas y estadísticas activas. Las sesiones de Estudio omiten preguntas retiradas; un examen guardado que las contenga debe reiniciarse para no recalificar con otro denominador.

## Actualización en GitHub Pages

Subir todo el contenido del ZIP a la raíz del repositorio, reemplazando los archivos previos. Conservar la carpeta assets. Abrir con conexión para que se descargue la nueva caché; cerrar y volver a abrir la aplicación si ya estaba abierta. Exportar un respaldo antes de actualizar es recomendable.

Paquete preparado sin publicar. Revisión clínica independiente pendiente. Comprobaciones lógicas mediante Node.js y DOM simulado; sin prueba visual en navegador ni física en iPhone/iPad.
