export type ServiceCategory = 'haircut' | 'color' | 'others';

export type BookingMode = 'chair' | 'consultation';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'expired';

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
  durationMinutes: number;
  bookingMode?: BookingMode;
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
  chairId: string | null;
  notes: string;
}

export interface Chair {
  id: string;
  label: string;
}

export type SlotUnavailableReason =
  | 'past'
  | 'outside_hours'
  | 'full'
  | 'barber_busy';

export interface AvailabilityChair extends Chair {
  available: boolean;
}

export interface AvailabilitySlot {
  time: string;
  available: boolean;
  reason?: SlotUnavailableReason;
  chairs: AvailabilityChair[];
}

export interface AvailabilityResponse {
  branchId: string;
  date: string;
  serviceId: string;
  mode: BookingMode;
  chairs: Chair[];
  slots: AvailabilitySlot[];
}

export interface PublicBooking {
  id: string;
  code: string;
  branch_id: string;
  service_id: string | null;
  barber_id: number | null;
  chair_id: string | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  customer_phone: string;
  notes: string | null;
  status: BookingStatus;
  booking_mode: BookingMode;
  expires_at: string | null;
  confirmed_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  service_name: string;
  price_idr: number;
  duration_min: number;
  barber_name: string | null;
  chair_label: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminBooking extends PublicBooking {
  branches?: { name: string; short_name: string } | null;
  services?: { name: string } | null;
  barbers?: { name: string } | null;
  chairs?: { label: string } | null;
}

export interface ShopFeature {
  iconName: 'Scissors' | 'Sparkles' | 'Crown' | 'Award' | 'ShieldCheck' | 'Clock';
  title: string;
  desc: string;
}
