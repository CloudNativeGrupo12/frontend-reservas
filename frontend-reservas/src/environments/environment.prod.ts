export const environment = {
  production: true,
  scopes: ['api://<AZURE_API_CLIENT_ID>/access_as_user'],
  auth: {
    clientId: '<AZURE_SPA_CLIENT_ID>',
    authority: 'https://login.microsoftonline.com/<TENANT_ID>',
    redirectUri: 'https://<DOMINIO_PRODUCCION>',
    postLogoutRedirectUri: 'https://<DOMINIO_PRODUCCION>',
  },
  cacheLocation: 'localStorage' as 'localStorage' | 'sessionStorage',
  protectedResourceMap: [
    ['https://<API_GATEWAY_URL>/*', ['api://<AZURE_API_CLIENT_ID>/access_as_user']],
  ] as Array<[string, string[]]>,
  api: {
    reservas: 'https://<API_GATEWAY_URL>',
    disponibilidad: 'https://<API_GATEWAY_URL>',
    notificaciones: 'https://<API_GATEWAY_URL>',
    auditoria: 'https://<API_GATEWAY_URL>',
    adminRabbitmq: 'https://<API_GATEWAY_URL>',
  },
};
