import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error('Error: SUPABASE_URL atau SUPABASE_SECRET_KEY belum terbaca.');
  process.exit(1);
}

const supabase = createClient(url, key);

async function run99StressTest() {
  console.log('=== Memulai 99-Attempt Concurrency Stress Test Supabase ===');

  const testBranch = 'jalaksana';
  const testChair = 'jalaksana-chair-2';
  const testService = 'cukur-saja';
  const testDate = '2026-11-20';
  const testTime = '11:00:00';

  console.log(`Target Slot: Cabang ${testBranch}, Kursi ${testChair}, Tanggal ${testDate}, Jam ${testTime}`);
  console.log('Menembak 99 request create_booking secara serentak (Promise.allSettled)...\n');

  const attempts = Array.from({ length: 99 }, (_, i) => {
    const padded = String(i + 1).padStart(3, '0');
    return supabase.rpc('create_booking', {
      p_branch_id: testBranch,
      p_service_id: testService,
      p_barber_id: null,
      p_chair_id: testChair,
      p_booking_date: testDate,
      p_start_time: testTime,
      p_customer_name: `TEST-99-RACE-${padded}`,
      p_customer_phone: `089900000${padded}`,
      p_notes: `Stress test attempt #${padded}`,
    });
  });

  const results = await Promise.allSettled(attempts);

  let successCount = 0;
  let conflictCount = 0;
  let otherErrorCount = 0;
  let winningBooking = null;

  for (const res of results) {
    if (res.status === 'fulfilled') {
      const { data, error } = res.value;
      if (!error && data?.code) {
        successCount++;
        winningBooking = data;
      } else if (error?.message === 'SLOT_TAKEN' || error?.code === 'P0001') {
        conflictCount++;
      } else {
        otherErrorCount++;
        console.error('Unexpected error in fulfilled result:', error);
      }
    } else {
      otherErrorCount++;
      console.error('Promise rejected:', res.reason);
    }
  }

  console.log('--- Hasil Pengujian Konkurensi ---');
  console.log(`Total Request    : ${results.length}`);
  console.log(`Sukses (Berhasil): ${successCount}`);
  console.log(`Konflik (Ditolak): ${conflictCount}`);
  console.log(`Error Lain       : ${otherErrorCount}`);

  if (winningBooking) {
    console.log(`\nBooking yang berhasil memenangkan kursi:`);
    console.log(`• Kode Booking : ${winningBooking.code}`);
    console.log(`• Pemesan      : ${winningBooking.customer_name}`);
    console.log(`• Kursi        : ${winningBooking.chair_label}`);
    console.log(`• Waktu Mulai  : ${winningBooking.start_time}`);
    console.log(`• Batas Expire : ${winningBooking.expires_at}`);
  }

  // Verification against requirement
  const isStrictPass = successCount === 1 && conflictCount === 98 && otherErrorCount === 0;

  console.log('\n--- Status Evaluasi ---');
  if (isStrictPass) {
    console.log('PASSED: Tepat 1 reservasi berhasil dan 98 reservasi lainnya ditolak karena slot sudah diambil.');
  } else {
    console.error(`FAILED: Expected 1 success and 98 conflicts, got ${successCount} success and ${conflictCount} conflicts.`);
  }

  // Cleanup test rows
  console.log('\nMembersihkan data uji dari database...');
  const { error: delError } = await supabase
    .from('bookings')
    .delete()
    .like('customer_name', 'TEST-99-RACE-%');

  if (delError) {
    console.error('Gagal membersihkan data uji:', delError);
  } else {
    console.log('Data uji berhasil dibersihkan.');
  }

  process.exit(isStrictPass ? 0 : 1);
}

run99StressTest().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
