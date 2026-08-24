export interface SocialLink {
  id: string;
  label: string;
  href: string;
  iconSrc: string;
}

export const email = 'letnull19a@gmail.com';

export const socialLinks: SocialLink[] = [
  { id: 'github', label: 'github', href: 'https://github.com/letnull19a', iconSrc: '/icons/github.svg' },
  { id: 'linkedin', label: 'linkedin', href: 'https://www.linkedin.com/in/aleksei-volkov-572ba9401/', iconSrc: '/icons/linkedin.svg' },
  { id: 'telegram', label: 'telegram', href: 'https://t.me/alexei_wolkoff', iconSrc: '/icons/telegram.svg' },
  { id: 'whatsapp', label: 'whatsapp', href: 'https://wa.me/995511706127', iconSrc: '/icons/whatsapp.svg' },
  { id: 'email', label: 'email', href: `mailto:${email}`, iconSrc: '/icons/email.svg' },
];