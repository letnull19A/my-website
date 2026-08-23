import type { ArticleCardProps } from '@/components/article-card';
import { socialLinks } from '@/config/social';

export const articles: ArticleCardProps[] = [
  {
    title: 'NESTJS REQUEST LIFECYCLE: WHO DOES WHAT?',
    description:
      'NestJS is a structured Node.js framework where each request passes through components with different responsibilities.',
    coverImage: undefined,
    linkedinHref: socialLinks[1].href,
    telegramHref: socialLinks[2].href,
    readHref: '#article-1',
  },
  {
    title: 'NESTJS REQUEST LIFECYCLE: WHO DOES WHAT?',
    description:
      'NestJS is a structured Node.js framework where each request passes through components with different responsibilities.',
    coverImage: undefined,
    linkedinHref: socialLinks[1].href,
    telegramHref: socialLinks[2].href,
    readHref: '#article-2',
  },
  {
    title: 'NESTJS REQUEST LIFECYCLE: WHO DOES WHAT?',
    description:
      'NestJS is a structured Node.js framework where each request passes through components with different responsibilities.',
    coverImage: undefined,
    linkedinHref: socialLinks[1].href,
    telegramHref: socialLinks[2].href,
    readHref: '#article-3',
  },
];