# Configuración Azure y URLs

Los registros API y SPA y sus identificadores quedaron configurados mediante Azure CLI el 8 de octubre de 2026. El backend incluye `scripts/configurar-azure.ps1` para reproducir la configuración, incluso al sustituir identificadores de otro tenant. Se verificó login real con Microsoft y acceso JWT desde Angular a las cinco APIs. Tanto desarrollo como el build optimizado apuntan a las APIs locales y al redirect `http://localhost:4200`; las bases de los microservicios están en RDS cloud. Las secciones de dominio público siguientes describen un despliegue futuro.

---

## 1. App Registrations necesarios en Azure Entra ID

Debes crear **dos** registros de aplicación en el Azure Portal
(`Microsoft Entra ID` → `App registrations` → `New registration`).

| Registro | Tipo | Propósito |
| :--- | :--- | :--- |
| **ReservasApp-SPA** | SPA (público) | Frontend Angular. **Sin client secret.** Redirect URI: `http://localhost:4200`. |
| **ReservasApp-API** | Web | Backend Spring Boot. Expone el scope `access_as_user`. |

> El flujo usa **Authorization Code + PKCE**, por lo que el registro del SPA no necesita secret.

---

## 2. Variables de Azure a obtener

| Variable | Dónde se obtiene en Azure | Para qué sirve | Dónde se usa |
| :--- | :--- | :--- | :--- |
| `<TENANT_ID>` | `Azure AD` → `Properties` → `Tenant ID` (o en el dropdown del nombre de la cuenta) | Identifica el directorio | `authority` en `environment.ts` / `environment.prod.ts` |
| `<AZURE_SPA_CLIENT_ID>` | App registration **ReservasApp-SPA** → `Overview` → `Application (client) ID` | ID del frontend Angular | `auth.clientId` |
| `<AZURE_API_CLIENT_ID>` | App registration **ReservasApp-API** → `Overview` → `Application (client) ID` | ID del backend que valida el JWT | `scopes` y `protectedResourceMap` |
| (derivado) `api://<AZURE_API_CLIENT_ID>/access_as_user` | ReservasApp-API → `Expose an API` → `Application ID URI` + scope | Scope que el frontend solicita | `scopes` |

> Importante: el `Application ID URI` del backend en Azure suele generarse automáticamente
> como `api://<AZURE_API_CLIENT_ID>`. Mantenlo y define el scope `access_as_user`
> (`Expose an API` → `Add a scope` → nombre `access_as_user`).

---

## 3. Requisitos por entorno

### Desarrollo (src/environments/environment.ts)

| Placeholder | Valor esperado |
| :--- | :--- |
| `<AZURE_SPA_CLIENT_ID>` | Application ID de **ReservasApp-SPA** |
| `<TENANT_ID>` | Tenant ID del directorio |
| `<AZURE_API_CLIENT_ID>` | Application ID de **ReservasApp-API** |
| redirect URIs | `http://localhost:4200` (ya configurado, verificar en el registro SPA) |

> La autoridad queda: `https://login.microsoftonline.com/<TENANT_ID>`.

### Build optimizado (src/environments/environment.prod.ts)

La configuración actual usa los mismos identificadores Azure, URLs de APIs y redirect local que desarrollo. `npm run build` produce una aplicación con la configuración real de la evaluación. Para un futuro despliegue público, sustituir las URLs locales por los valores siguientes y registrar el nuevo origen en Entra ID y CORS:

| Placeholder | Valor esperado |
| :--- | :--- |
| `<DOMINIO_PRODUCCION>` | Dominio servido por S3/CloudFront, ej: `app.midominio.com` |
| `<API_GATEWAY_URL>` | URL del API Gateway de AWS, ej: `https://xxx.execute-api.us-east-1.amazonaws.com/prod` |
| `<AZURE_SPA_CLIENT_ID>` | Application ID de **ReservasApp-SPA** |
| `<TENANT_ID>` | Tenant ID del directorio |
| `<AZURE_API_CLIENT_ID>` | Application ID de **ReservasApp-API** |

> Para producción, en el registro **ReservasApp-SPA** hay que añadir como Redirect URI
> `https://<DOMINIO_PRODUCCION>` (además de `http://localhost:4200` para desarrollo).

---

## 4. URLs de los microservicios (dev y prod)

### Desarrollo — environment.ts

| Microservicio | Puerto | Valor actual |
| :--- | :--- | :--- |
| ms-reservas | 8080 | `http://localhost:8080` |
| ms-disponibilidad | 8081 | `http://localhost:8081` |
| ms-notificaciones | 8082 | `http://localhost:8082` |
| ms-auditoria | 8083 | `http://localhost:8083` |
| ms-admin-rabbitmq | 8084 | `http://localhost:8084` |

### Producción — environment.prod.ts

En el build optimizado actual, cada clave usa el puerto local del microservicio indicado en la tabla anterior. Si se despliega un API Gateway público, configurar todas las claves (`reservas`, `disponibilidad`, `notificaciones`, `auditoria`, `adminRabbitmq`) y `protectedResourceMap` con su URL real.

---

## 5. Configuraciones adicionales (backend y Azure)

1. **CORS en cada microservicio Spring Boot.** Permitir el origen:
   - Dev: `http://localhost:4200`
   - Prod: `https://<DOMINIO_PRODUCCION>`
   (Configúralo en `SecurityConfig.java` de cada servicio con `CorsConfigurationSource`.)
2. **Validador de JWT en el backend.** Cada microservicio debe validar los tokens usando
   el **issuer** `https://login.microsoftonline.com/<TENANT_ID>/v2.0` y el **audience**
   `<AZURE_API_CLIENT_ID>` para los access tokens v2 de esta API. El scope mantiene el prefijo `api://`.
3. **Redirect URI del SPA (Azure).** En ReservasApp-SPA → `Authentication`:
   - Platform: `Single-page application`
   - Redirect URIs: `http://localhost:4200` y `https://<DOMINIO_PRODUCCION>`.
4. **Builder / constructor.** Compilar no demuestra que una URL sea utilizable. La configuración entregada usa URLs reales de la demostración; después de cambiar un dominio, verificar login y llamadas autenticadas en ese entorno.

---

## 6. Checklist final

- [x] Crear registro **ReservasApp-SPA** y configurar su Application ID.
- [x] Crear registro **ReservasApp-API** y scope `access_as_user`.
- [x] Configurar el Tenant ID y tokens v2.
- [x] Configurar `environment.ts` y `environment.prod.ts` para la demostración.
- [x] Registrar `http://localhost:4200` como redirect SPA.
- [x] Habilitar CORS y validación JWT (issuer/audience) en las cinco APIs.
- [x] Verificar login real y consumo de las cinco APIs con JWT.

Un futuro hosting público requiere registrar su dominio y configurar las URLs de ese despliegue. La pauta suministrada exige base de datos cloud y entrega por GitHub; no especifica un hosting público del frontend ni de los microservicios.
