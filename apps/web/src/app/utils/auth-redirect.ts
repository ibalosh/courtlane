const DEFAULT_AUTH_REDIRECT_PATH = '/account';

export function getSafeRedirectPath(redirect: string | null | undefined, fallback = DEFAULT_AUTH_REDIRECT_PATH) {
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) {
    return fallback;
  }

  return redirect;
}

export function getRedirectSearch(pathname: string, search = '', hash = '') {
  const params = new URLSearchParams({
    redirect: `${pathname}${search}${hash}`,
  });

  return `?${params.toString()}`;
}
