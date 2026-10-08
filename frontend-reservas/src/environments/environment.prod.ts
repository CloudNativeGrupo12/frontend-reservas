// Build optimizado para la evaluación: APIs locales conectadas a RDS cloud.
// Para hosting público, configurar URLs reales, CORS y redirects de Entra ID.
export const environment = {
  production: true,
  scopes: ['api://4d231d37-3bea-4899-ad18-0e9cf3a55e71/access_as_user'],
  auth: {
    clientId: '2b98a29a-ddb1-4e49-b8d1-f757b22d449f',
    authority: 'https://login.microsoftonline.com/72fd0b5a-8a6a-4cff-89f6-bde961f7e250',
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',
  },
  cacheLocation: 'localStorage' as 'localStorage' | 'sessionStorage',
  protectedResourceMap: [
    ['http://localhost:8080/*', ['api://4d231d37-3bea-4899-ad18-0e9cf3a55e71/access_as_user']],
    ['http://localhost:8081/*', ['api://4d231d37-3bea-4899-ad18-0e9cf3a55e71/access_as_user']],
    ['http://localhost:8082/*', ['api://4d231d37-3bea-4899-ad18-0e9cf3a55e71/access_as_user']],
    ['http://localhost:8083/*', ['api://4d231d37-3bea-4899-ad18-0e9cf3a55e71/access_as_user']],
    ['http://localhost:8084/*', ['api://4d231d37-3bea-4899-ad18-0e9cf3a55e71/access_as_user']],
  ] as Array<[string, string[]]>,
  api: {
    reservas: 'http://localhost:8080',
    disponibilidad: 'http://localhost:8081',
    notificaciones: 'http://localhost:8082',
    auditoria: 'http://localhost:8083',
    adminRabbitmq: 'http://localhost:8084',
  },
};
