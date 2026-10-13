# Reservas

Frontend Angular para gestionar las reservas de mesas de un restaurante. Consume los cinco microservicios del [backend del equipo](https://github.com/CloudNativeGrupo12/actividad-evaluada-rabbitmq) y utiliza Azure Entra ID con MSAL para iniciar sesión.

## Ejecutar en desarrollo

El proyecto Angular está dentro de la carpeta `frontend-reservas/`.

```powershell
cd C:\Users\franc\frontend-reservas\frontend-reservas
npm ci
npm start
```

Abre http://localhost:4200. Utiliza una versión de Node compatible con Angular 22; el proyecto se verificó con Node 24.15.0.

## Configurar el inicio de sesión

La configuración de Azure del equipo ya está en `frontend-reservas/src/environments/environment.ts`. Para otro entorno, ajusta el identificador de la SPA, el tenant y el identificador de la API. El scope solicitado es `api://<AZURE_API_CLIENT_ID>/access_as_user`. El backend debe validar ese mismo tenant y audiencia, y la SPA debe tener registrada su URI de redirección.

Para producción, completa `environment.prod.ts` con el dominio del frontend y la URL del API Manager. Los archivos contienen identificadores públicos de aplicación y tenant, sin secretos de cliente. La configuración incompleta no se considera una sesión válida y las rutas protegidas siguen requiriendo autenticación.

## Pantallas

- **Inicio:** accesos a las tareas principales y explicación del flujo de confirmación.
- **Reservas:** formulario con validación de fechas, horario, correo y cantidad de personas; búsqueda, filtros y recuperación de publicaciones pendientes.
- **Mesas:** capacidades y asignaciones filtradas por fecha y mesa. La disponibilidad definitiva se comprueba al crear la reserva.
- **Notificaciones:** confirmaciones procesadas, destinatario y resultado.
- **Actividad:** trazabilidad de eventos, clientes y reservas.
- **Sistema:** administración de colas, exchanges y bindings, con confirmación previa a la eliminación.

Las pantallas utilizan datos del backend. No se generan reservas ficticias ni se omite la validación de JWT. Los estados de carga, error y listas vacías son distintos para evitar mostrar ausencia de datos cuando una consulta falla.

## Verificación

```powershell
npm run build
npm test -- --watch=false
```

Las pruebas cubren contratos de respuesta de Java, validación de reservas, recuperación tras errores, prevención de envíos duplicados y confirmación de eliminaciones. La validación de login real requiere Azure configurado y el backend accesible.

## Estructura

```text
frontend-reservas/src/app/
  auth/       Configuración e interceptor MSAL
  models/     Modelos de las pantallas y respuestas
  pages/      Inicio, reservas, mesas, notificaciones, actividad y sistema
  services/   Peticiones HTTP y adaptación de respuestas del backend
  shared/     Navegación, iconos, carga y validación
```

Los estilos compartidos están en `frontend-reservas/src/styles.css`. El sistema visual y sus criterios están documentados en [DESIGN.md](DESIGN.md).

## Integración EP3 y publicación

La rama `main` reúne las mejoras de interfaz y la integración de `feature/ep3-rubrica`. Conserva la inicialización MSAL, la configuración Azure y las URLs del gateway HTTPS.

El [último despliegue documentado en AWS](https://6yyp6d2s6j.execute-api.us-east-1.amazonaws.com) corresponde a la publicación previa de EP3. Fusionar el código en Git no vuelve a desplegar esa aplicación. Consulta la [configuración de Azure](frontend-reservas/docs/CONFIGURACION-AZURE.md) y la [guía de AWS del backend](https://github.com/CloudNativeGrupo12/actividad-evaluada-rabbitmq/blob/main/docs/DESPLIEGUE_AWS.md).
