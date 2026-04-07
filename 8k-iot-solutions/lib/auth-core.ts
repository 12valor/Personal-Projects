import { SignJWT, jwtVerify } from 'jose';

const AUTH_SECRET = process.env.AUTH_SECRET || 'fallback-secret-for-development-change-me';
const key = new TextEncoder().encode(AUTH_SECRET);

export const SESSION_COOKIE_NAME = 'admin_session';

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1w')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}
