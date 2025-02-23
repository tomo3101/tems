'use client';

import { ReserveCard } from '@/components/layout/reserve/card';
import { useReservationStore } from '@/store/reservationStore';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { sendReservation } from './action';

export default function Home() {
  const router = useRouter();
  const { data } = useReservationStore();

  const onPress = async () => {
    const res = await sendReservation(data);
    if (res) router.push('/reserve/complete');
  };

  return (
    <>
      <h1 className="text-4xl font-medium">予約確認</h1>

      <ReserveCard event={data} />

      <div className="flex justify-between gap-8">
        <Button color="default" onPress={() => router.back()} fullWidth>
          戻る
        </Button>
        <Button color="primary" onPress={onPress} fullWidth>
          予約
        </Button>
      </div>
    </>
  );
}
