'use client';
import { putCheckin } from '@/components/layout/admin/checkin/actions';
import { Alert } from '@heroui/alert';
import { Button } from '@heroui/button';
import { Modal, ModalContent, useDisclosure } from '@heroui/modal';
import { useState } from 'react';

interface CheckinButtonModalProps {
  reservationId: number;
}

export const CheckinButtonModal = ({
  reservationId,
}: CheckinButtonModalProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>();

  const handleCheckin = async () => {
    setIsLoading(true);
    const result = await putCheckin(reservationId);

    if (result) {
      setAlertSuccess(true);
      setAlertMessage('チェックインしました。ページを読み込み直してください。');
    } else {
      setAlertSuccess(false);
      setAlertMessage(
        'チェックインに失敗しました。もう一度やり直してください。',
      );
    }

    onOpen();
    setIsLoading(false);
  };

  return (
    <>
      <Button
        variant="solid"
        color="primary"
        onPress={handleCheckin}
        isLoading={isLoading}
        isDisabled={alertSuccess}
      >
        チェックイン
      </Button>
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
                color={alertSuccess ? 'success' : 'danger'}
                title={alertSuccess ? '成功' : 'エラー'}
                description={alertMessage}
                onClose={onClose}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
