export const environment = {
  production: false,
  scopes: ['api://<AZURE_API_CLIENT_ID>/access_as_user'],
  auth: {
    clientId: '<AZURE_SPA_CLIENT_ID>',
    authority: 'https://login.microsoftonline.com/<TENANT_ID>',
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',
  },
  cacheLocation: 'localStorage' as 'localStorage' | 'sessionStorage',
  protectedResourceMap: [
    ['http://localhost:8080/*', ['api://<AZURE_API_CLIENT_ID>/access_as_user']],
    ['http://localhost:8081/*', ['api://<AZURE_API_CLIENT_ID>/access_as_user']],
    ['http://localhost:8082/*', ['api://<AZURE_API_CLIENT_ID>/access_as_user']],
    ['http://localhost:8083/*', ['api://<AZURE_API_CLIENT_ID>/access_as_user']],
    ['http://localhost:8084/*', ['api://<AZURE_API_CLIENT_ID>/access_as_user']],
  ] as Array<[string, string[]]>,
  api: {
    reservas: 'http://localhost:8080',
    disponibilidad: 'http://localhost:8081',
    notificaciones: 'http://localhost:8082',
    auditoria: 'http://localhost:8083',
    adminRabbitmq: 'http://localhost:8084',
  },
};
