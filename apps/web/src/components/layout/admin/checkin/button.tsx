'use client';

import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { putCheckin } from './actions';

interface CheckinButtonProps {
  reservationId: number;
}

export const CheckinNavButton = ({ reservationId }: CheckinButtonProps) => {
  const router = useRouter();

  const handleCheckin = async () => {
    const result = await putCheckin(reservationId);

    if (result) {
      router.push('/admin/checkin/complete');
    }
  };

  return (
    <div className="w-full flex justify-between gap-4">
      <Button
        variant="solid"
        color="danger"
        onPress={() => router.back()}
        fullWidth
      >
        戻る
      </Button>
      <Button
        variant="solid"
        color="primary"
        onPress={() => handleCheckin()}
        fullWidth
      >
        チェックイン
      </Button>
    </div>
  );
};
