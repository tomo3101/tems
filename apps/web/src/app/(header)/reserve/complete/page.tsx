'use client';

import { ReserveCard } from '@/components/layout/reserve/card';
import { useReservationStore } from '@/store/reservationStore';
import { Button } from '@heroui/button';
import Link from 'next/link';

export default function Home() {
  const { data } = useReservationStore();

  return (
    <>
      <h1 className="text-4xl font-medium">予約完了</h1>

      <ReserveCard event={data} />

      <div>
        <Button as={Link} href="/" color="primary" fullWidth>
          トップに戻る
        </Button>
      </div>
    </>
  );
}
