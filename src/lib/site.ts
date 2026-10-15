export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://sakshamaveragecodes-lab.github.io/saksham-portfolio')).replace(/\/$/,'');
export const asset = (path:string) => `${basePath}${path.startsWith('/')?path:`/${path}`}`;
