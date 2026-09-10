const SHARE_BASE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || '').trim() || 'https://letnull19a.github.io/my-website';

export function resolveArticleUrl(articlePath?: string): string {
  if (!articlePath || articlePath === '#') return '';
  if (/^https?:\/\//.test(articlePath)) return articlePath;
  return `${SHARE_BASE_URL}${articlePath.startsWith('/') ? '' : '/'}${articlePath}`;
}

export function getTelegramShareUrl(articleUrl: string, text?: string): string {
  const params = new URLSearchParams({ url: articleUrl });
  if (text) params.set('text', text);
  return `https://t.me/share/url?${params.toString()}`;
}

export function getLinkedinShareUrl(articleUrl: string): string {
  const params = new URLSearchParams({ url: articleUrl });
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}