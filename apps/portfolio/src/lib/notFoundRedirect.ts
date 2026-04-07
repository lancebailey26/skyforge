export const SKYFORGE_NOT_FOUND_SESSION_KEY = 'skyforge:not-found-redirect';

export function flagNotFoundRedirect(): void {
  try {
    sessionStorage.setItem(SKYFORGE_NOT_FOUND_SESSION_KEY, '1');
  } catch{
    /* private mode or storage unavailable */
  }
}

export function consumeNotFoundRedirectFlag(): boolean {
  try {
    if(sessionStorage.getItem(SKYFORGE_NOT_FOUND_SESSION_KEY) !== '1') {
      return false;
    }
    sessionStorage.removeItem(SKYFORGE_NOT_FOUND_SESSION_KEY);
    return true;
  } catch{
    return false;
  }
}