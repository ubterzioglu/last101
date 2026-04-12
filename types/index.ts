/**
 * TypeScript type definitions
 */

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export type CardVariant = 'default' | 'hoverable' | 'featured' | 'bordered';

export type BadgeColor = 'blue' | 'red' | 'yellow' | 'green' | 'gray';

export type NavigationItem = {
  href: string;
  label: string;
  id: string;
};

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image?: string;
  date: string;
  readTime: string;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  postedDate: string;
};

export type RecruitmentAgency = {
  id: string;
  name: string;
  url: string;
  description: string;
  status: 'active' | 'inactive';
  category?: string;
  createdAt: string;
  updatedAt: string;
};

export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type InfoBlock = {
  id: string;
  title: string;
  items: string[];
  icon?: string;
};

export type CTA = {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
};
