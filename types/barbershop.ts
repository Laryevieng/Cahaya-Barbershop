export type ServiceCategory = 'haircut' | 'color' | 'others';

export type ServiceIconName =
  | 'Scissors'
  | 'Sparkles'
  | 'Crown'
  | 'Flame'
  | 'ShieldCheck'
  | 'Award'
  | 'Palette'
  | 'Waves'
  | 'Zap';

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  name: string;
  priceIdr: number;
  priceMaxIdr?: number;
  pricePrefix?: 'Mulai';
  priceSuffix?: '+';
  time?: string;
  desc: string;
  iconName: ServiceIconName;
  tag?: string;
}

export interface PricingPackage {
  id: string;
  serviceId: string;
  name: string;
  subtitle: string;
  priceIdr: number;
  highlighted: boolean;
  popularBadge?: string;
  features: string[];
}

export interface Barber {
  id: number;
  name: string;
  role: string;
  exp: string;
  specialty: string;
  image: string;
  imagePosition?: string;
  instagram: string;
  isFounder?: boolean;
}

export type GalleryCategory = 'all' | 'cuts' | 'beard' | 'interior' | 'process';

export interface GalleryItem {
  id: number;
  category: 'cuts' | 'beard' | 'interior' | 'process';
  title: string;
  image: string;
  description?: string;
}

export interface ReviewItem {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  review: string;
  service?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  readTime?: string;
}

export interface Branch {
  id: string;
  name: string;
  shortName: string;
  isMain?: boolean;
  tag: string;
  address: string;
  mapUrl: string;
  embedQuery: string;
  hours: string;
}

export type ServiceSelection =
  | { kind: 'catalog'; id: string }
  | { kind: 'custom'; label: string };

export interface BookingDraft {
  name: string;
  phone: string;
  branchId: string;
  service: ServiceSelection;
  barberId: string;
  date: string;
  time: string;
  notes: string;
}

export interface ShopFeature {
  iconName: 'Scissors' | 'Sparkles' | 'Crown' | 'Award' | 'ShieldCheck' | 'Clock';
  title: string;
  desc: string;
}
