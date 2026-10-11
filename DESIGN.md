# Sistema visual de Reservas

## Alcance

Refinamiento de las pantallas existentes para la operación del restaurante. Se conserva el nombre Reservas y la base visual clara con azul. Las tareas prioritarias son registrar reservas y consultar mesas. Notificaciones, actividad y administración siguen disponibles en la navegación.

## Tokens

Los valores compartidos viven en `frontend-reservas/src/styles.css`: fondo `#f4f6fa`, superficie blanca, texto `#18243b`, texto secundario `#52627a`, acento azul `#2455c6` y separadores `#dce3ee`. El verde identifica operaciones completadas, el ámbar información pendiente y el rojo errores. Los estados siempre incluyen texto.

Se utiliza Segoe UI con alternativas de sistema, una escala tipográfica común y anchura máxima de 1280 px. Los paneles tienen radio de 12 px y borde ligero. Los controles tienen área mínima de 44 px; las acciones secundarias de tablas usan 36 px. Los iconos vectoriales comparten trazo y tamaño en `shared/icon`.

## Composición y comportamiento

- Navegación horizontal en escritorio y menú desplegable en pantallas pequeñas.
- Encabezado con nombre de la tarea, descripción corta y acción principal.
- Formularios agrupados con etiquetas, validación visible y bloqueo mientras se envía una operación.
- Tablas con texto legible, referencias abreviadas y desplazamiento horizontal cuando el contenido requiere más anchura.
- Estados de carga, error y vacío independientes. Un fallo de red ofrece una acción de recuperación.
- La publicación de un evento no se presenta como prueba de que el correo ya llegó.
- Eliminaciones de recursos requieren una confirmación explícita dentro de la interfaz.

## Accesibilidad

Documento en español, enlace para saltar al contenido, foco visible, navegación actual identificada, tablas con encabezados semánticos, avisos de error y estado anunciables y respeto de la preferencia de movimiento reducido.

## Verificación y límites

La compilación y las pruebas automatizadas verifican la integración de plantillas y los comportamientos cubiertos. No hubo navegador conectado para inspeccionar el resultado renderizado en escritorio y móvil; ese control visual y el flujo de autenticación con Azure real siguen pendientes.
