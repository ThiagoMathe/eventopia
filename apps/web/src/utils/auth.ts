// apps/web/src/utils/auth.ts
export interface JwtPayload {
  sub: string;
  email: string;
  role: 'USER' | 'ORGANIZER' | 'ADMIN';
}

export const getUserPayload = (): JwtPayload | null => {
  const token = localStorage.getItem('eventopia_token');
  if (!token) return null;

  try {
    // O JWT é dividido por pontos: Header.Payload.Signature. Pegamos o índice 1 (Payload)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};