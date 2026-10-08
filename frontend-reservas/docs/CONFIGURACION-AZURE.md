# Configuración pendiente — Azure y URLs

Documento con todos los valores pendientes de rellenar antes de que la app funcione.
Corresponden a los placeholders `<...>` que quedaron en `src/environments/`.

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

### Producción (src/environments/environment.prod.ts)

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

Todas las claves (`reservas`, `disponibilidad`, `notificaciones`, `auditoria`, `adminRabbitmq`)
deben apuntar a `https://<API_GATEWAY_URL>`.

---

## 5. Configuraciones adicionales (backend y Azure)

1. **CORS en cada microservicio Spring Boot.** Permitir el origen:
   - Dev: `http://localhost:4200`
   - Prod: `https://<DOMINIO_PRODUCCION>`
   (Configúralo en `SecurityConfig.java` de cada servicio con `CorsConfigurationSource`.)
2. **Validador de JWT en el backend.** Cada microservicio debe validar los tokens usando
   el **issuer** `https://login.microsoftonline.com/<TENANT_ID>/v2.0` y el **audience**
   `api://<AZURE_API_CLIENT_ID>`.
3. **Redirect URI del SPA (Azure).** En ReservasApp-SPA → `Authentication`:
   - Platform: `Single-page application`
   - Redirect URIs: `http://localhost:4200` y `https://<DOMINIO_PRODUCCION>`.
4. **Builder / constructor.** Se pueden dejar con los placeholders mientras no existan los
   recursos; la app compila igualmente (`ng build`) porque son strings.

---

## 6. Checklist final

- [ ] Crear registro **ReservasApp-SPA** y copiar su Application ID → `<AZURE_SPA_CLIENT_ID>`
- [ ] Crear registro **ReservasApp-API**, definir scope `access_as_user` y copiar su Application ID → `<AZURE_API_CLIENT_ID>`
- [ ] Copiar el Tenant ID → `<TENANT_ID>`
- [ ] Rellenar `environment.ts` (separador desarrollo)
- [ ] Rellenar `environment.prod.ts` (dominio + API Gateway)
- [ ] Añadir redirect URIs en Azure (dev y prod)
- [ ] Habilitar CORS y validación de JWT (issuer/audience) en los 5 microservicios