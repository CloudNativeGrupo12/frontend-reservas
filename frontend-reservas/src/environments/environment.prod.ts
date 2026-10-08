// AWS público: frontend y APIs por API Gateway HTTPS; datos en RDS.
export const environment = {
  production: true,
  scopes: ['api://4d231d37-3bea-4899-ad18-0e9cf3a55e71/access_as_user'],
  auth: {
    clientId: '2b98a29a-ddb1-4e49-b8d1-f757b22d449f',
    authority: 'https://login.microsoftonline.com/72fd0b5a-8a6a-4cff-89f6-bde961f7e250',
    redirectUri: 'https://6yyp6d2s6j.execute-api.us-east-1.amazonaws.com',
    postLogoutRedirectUri: 'https://6yyp6d2s6j.execute-api.us-east-1.amazonaws.com',
  },
  cacheLocation: 'localStorage' as 'localStorage' | 'sessionStorage',
  protectedResourceMap: [
    ['https://6yyp6d2s6j.execute-api.us-east-1.amazonaws.com/backend/reservas/*', ['api://4d231d37-3bea-4899-ad18-0e9cf3a55e71/access_as_user']],
    ['https://6yyp6d2s6j.execute-api.us-east-1.amazonaws.com/backend/disponibilidad/*', ['api://4d231d37-3bea-4899-ad18-0e9cf3a55e71/access_as_user']],
    ['https://6yyp6d2s6j.execute-api.us-east-1.amazonaws.com/backend/notificaciones/*', ['api://4d231d37-3bea-4899-ad18-0e9cf3a55e71/access_as_user']],
    ['https://6yyp6d2s6j.execute-api.us-east-1.amazonaws.com/backend/auditoria/*', ['api://4d231d37-3bea-4899-ad18-0e9cf3a55e71/access_as_user']],
    ['https://6yyp6d2s6j.execute-api.us-east-1.amazonaws.com/backend/admin/*', ['api://4d231d37-3bea-4899-ad18-0e9cf3a55e71/access_as_user']],
  ] as Array<[string, string[]]>,
  api: {
    reservas: 'https://6yyp6d2s6j.execute-api.us-east-1.amazonaws.com/backend/reservas',
    disponibilidad: 'https://6yyp6d2s6j.execute-api.us-east-1.amazonaws.com/backend/disponibilidad',
    notificaciones: 'https://6yyp6d2s6j.execute-api.us-east-1.amazonaws.com/backend/notificaciones',
    auditoria: 'https://6yyp6d2s6j.execute-api.us-east-1.amazonaws.com/backend/auditoria',
    adminRabbitmq: 'https://6yyp6d2s6j.execute-api.us-east-1.amazonaws.com/backend/admin',
  },
};
