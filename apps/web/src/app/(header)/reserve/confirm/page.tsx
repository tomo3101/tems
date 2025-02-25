'use client';

import { ReserveCard } from '@/components/layout/reserve/card';
import { useReservationStore } from '@/store/reservationStore';
import { Alert } from '@heroui/alert';
import { Button } from '@heroui/button';
import { Modal, ModalContent, useDisclosure } from '@heroui/modal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sendReservation } from './action';

export default function Home() {
  const router = useRouter();
  const { data } = useReservationStore();

  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onPress = async () => {
    setIsLoading(true);

    const res = await sendReservation(data);
    if (res.success) router.push('/reserve/complete');

    if (res.error) {
      if (res.error === 'capacity is not enough') {
        setAlertMessage(
          '予約が満員となりましたので、他の時間帯をお探しください。',
        );
      } else {
        setAlertMessage('エラーが発生しました。もう一度やり直してください。');
      }
      onOpen();
    }

    setIsLoading(false);
  };

  return (
    <>
      <h1 className="text-4xl font-medium">予約確認</h1>

      <ReserveCard event={data} />

      <div className="flex justify-between gap-8">
        <Button color="default" onPress={() => router.back()} fullWidth>
          戻る
        </Button>
        <Button
          color="primary"
          onPress={onPress}
          isLoading={isLoading}
          fullWidth
        >
          予約
        </Button>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top"
        backdrop="transparent"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <Alert
                color="danger"
                title="エラー"
                description={alertMessage}
                onClose={onClose}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
