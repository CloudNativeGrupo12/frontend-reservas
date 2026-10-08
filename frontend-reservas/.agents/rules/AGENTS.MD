# Reglas y Contexto del Frontend — Sistema de Reservas

## Contexto del Proyecto
Este es el frontend SPA para un sistema de reservas de restaurante. 
Se comunica con un backend de microservicios Spring Boot.
La seguridad se gestiona mediante Azure Entra ID (Flujo Authorization Code con PKCE).

## Stack Tecnológico
- Angular 22 (Standalone components, Signals, inject())
- @azure/msal-browser & @azure/msal-angular (v3/v4)
- Angular Material 22
- Modo SSR: Desactivado (`--ssr=false`)

## Reglas de Desarrollo
1. **Componentes Standalone:** No usar `ngModules`. Usar standalone components obligatoriamente.
2. **Inyección de dependencias:** Usar la función `inject()` en lugar de inyectar por constructor.
3. **Estado:** Usar `Signals` para el manejo de estado local cuando sea posible.
4. **Autenticación (MSAL):** 
   - El MSAL se configura en `app.config.ts`.
   - Todas las peticiones HTTP al backend deben llevar el token Bearer interceptado automáticamente por `MsalInterceptor`.
   - Las rutas protegidas deben usar `MsalGuard`.

## Endpoints del Backend a consumir
- **ms-reservas (http://localhost:8080)**
  - `GET /reservas`
  - `POST /reservas` (body: {clienteId, emailCliente, fechaReserva, horaInicio, horaFin, cantidadPersonas})
- **ms-disponibilidad (http://localhost:8081)**
  - `GET /mesas`
- **ms-admin-rabbitmq (http://localhost:8084)**
  - `POST /api/admin/queues` (body: {name, durable, args})

## Notas de despliegue
- La carpeta generada de build `dist/` nunca se sube a Git.
- La aplicación se preparará para ser servida como archivos estáticos puros (e.g., AWS S3).
