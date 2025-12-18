import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-super-secret-key-for-dev-that-is-long-enough');
const issuer = 'urn:fabrics:issuer';
const audience = 'urn:fabrics:audience';
const expiresAt = '2h';

export async function sign(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(expiresAt)
    .sign(secret);
}

export async function verify(token: string): Promise<any> {
    const { payload } = await jwtVerify(token, secret, {
        issuer,
        audience,
    });
    return payload;
}
