'use client';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Button, Spinner, useDisclosure } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useZxing } from 'react-zxing';
import { getReservaionWithQr } from './action';

type QrScanError = {
  status: string;
  message: string;
};

export default function QrReaderPage() {
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<QrScanError>();

  const { ref } = useZxing({
    onDecodeResult(result) {
      if (!isLoading) {
        handleScan(result.getText());
      }
    },
    constraints: { video: { facingMode: 'user' } },
    timeBetweenDecodingAttempts: 1000,
  });

  const handleScan = async (result: string) => {
    setIsLoading(true);

    const res = await getReservaionWithQr(result);
    console.log(res);

    if (res?.reservation) {
      router.push(`/admin/checkin/confirm?qrcode=${result}`);
    } else {
      setError(res);
      onOpen();
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center w-full max-w-4xl gap-8 px-8">
        <h1 className="text-4xl">チェックインQRコードを読み取ってください。</h1>
        <video ref={ref} />
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{error?.status}</ModalHeader>
              <ModalBody>
                <p>{error?.message}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  戻る
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={!isOpen && isLoading}
        placement="center"
        backdrop="blur"
        hideCloseButton
        disableAnimation
      >
        <ModalContent className="flex items-center">
          <ModalHeader>QRコードを読み取りました</ModalHeader>
          <ModalBody>
            <p>予約情報を取得しています</p>
          </ModalBody>
          <ModalFooter>
            <Spinner />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
