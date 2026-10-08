# FrontendReservas

Frontend del sistema de reservas para EP3 DSY1107. Angular 22 y MSAL permiten iniciar sesión con Microsoft Entra ID y usar las cinco APIs protegidas del backend. Las vistas muestran reservas, mesas/asignaciones, notificaciones, auditoría y administración de RabbitMQ.

**[Abrir la aplicación pública en AWS](https://6yyp6d2s6j.execute-api.us-east-1.amazonaws.com)**. Iniciar sesión con una cuenta del tenant Microsoft institucional configurado. El 8 de octubre de 2026 se comprobó una reserva desde esta URL y su asignación, notificación y auditoría en las cuatro bases de RDS. Ver [despliegue y operación](https://github.com/CloudNativeGrupo12/actividad-evaluada-rabbitmq/blob/feature/ep3-rubrica/docs/DESPLIEGUE_AWS.md).

## Ejecutar y verificar

```powershell
npm ci
npm start
```

En desarrollo, abrir `http://localhost:4200` e iniciar sesión con Microsoft. El backend debe estar activo en los puertos 8080 a 8084. `environment.ts` mantiene la configuración local; `environment.prod.ts` usa la URL HTTPS pública y los prefijos `/backend/*` del despliegue AWS. Ambos entornos usan los registros Azure configurados.

```powershell
npm run build
npm test -- --watch=false
```

El build optimizado se publica mediante `scripts/desplegar-publico.py` del backend. Su redirect Microsoft y sus llamadas API pertenecen al origen público de AWS; para trabajar en localhost usar `npm start` con la configuración de desarrollo.

El 8 de octubre de 2026 se verificaron compilación y seis pruebas, login real, consumo de las cinco APIs con JWT, creación de reservas, notificación y auditoría del mismo evento, y creación/eliminación de colas, exchanges y bindings. Los adaptadores HTTP traducen los campos en mayúsculas de asignaciones y registros procesados al modelo de las vistas.

La matriz de la pauta, la configuración CLI de Azure/AWS y las evidencias están en el repositorio backend, `docs/EP3.md` y `evidencias/ep3`. Revisar también [configuración Azure](docs/CONFIGURACION-AZURE.md).

## Referencia Angular CLI

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
