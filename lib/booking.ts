import { BARBERS_DATA, BRANCHES_DATA, SERVICES_DATA, SHOP_INFO } from '@/data';
import type { BookingDraft, ServiceSelection } from '@/types/barbershop';

export const ANY_BARBER_LABEL = 'Any Master Barber';

export function getServiceLabel(service: ServiceSelection): string {
  if (service.kind === 'custom') return service.label;
  return SERVICES_DATA.find((item) => item.id === service.id)?.name ?? service.id;
}

export function getBarberLabel(barberId: string): string {
  if (barberId === 'any') return ANY_BARBER_LABEL;
  return BARBERS_DATA.find((barber) => String(barber.id) === barberId)?.name ?? ANY_BARBER_LABEL;
}

export function getBranchLabel(branchId: string): string {
  return BRANCHES_DATA.find((branch) => branch.id === branchId)?.name ?? BRANCHES_DATA[0].name;
}

export function buildBookingMessage(draft: BookingDraft): string {
  const branch = getBranchLabel(draft.branchId);
  const service = getServiceLabel(draft.service);
  const barber = getBarberLabel(draft.barberId);

  return `Halo CAHAYA BARBERSHOP KUNINGAN,
Saya ingin melakukan reservasi grooming / styling:
• Nama: ${draft.name}
• No. WhatsApp: ${draft.phone}
• Lokasi Cabang: ${branch}
• Pilihan Layanan: ${service}
• Pilihan Barber: ${barber}
• Tanggal: ${draft.date}
• Jam: ${draft.time} WIB
${draft.notes ? `• Catatan Khusus: ${draft.notes}` : ''}

Mohon konfirmasi ketersediaan jadwal di cabang ${branch}. Terima kasih!`;
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
}
