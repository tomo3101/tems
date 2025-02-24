'use client';

import {
  AdminCalledReservationTable,
  AdminCallReservationTable,
} from '@/components/ui/table';
import { ReservationWithEvent } from '@/utils/hc';
import { socket } from '@/utils/socket';
import { Alert } from '@heroui/alert';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/modal';
import { Spinner } from '@heroui/spinner';
import { Key, useCallback, useEffect, useState } from 'react';
import { putReservationCalled, putReservationDone } from './action';

interface CallButtonWithModalProps {
  reservations: ReservationWithEvent[];
}

export const CallCard = ({
  reservations: initialReservations,
}: CallButtonWithModalProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [reservations, setReservations] = useState(initialReservations);

  const lastDoneReservation = reservations.findLast(
    (reservation) => reservation.status === 'done',
  );

  const {
    isOpen: isOpenCall,
    onOpen: onOpenCall,
    onOpenChange: onOpenCallChange,
  } = useDisclosure();
  const {
    isOpen: isOpenComplete,
    onOpen: onOpenComplete,
    onOpenChange: onOpenCompleteChange,
  } = useDisclosure();

  const [isVisible, setIsVisible] = useState(false);
  const [result, setResult] = useState(false);
  const [selectNum, setSelectNum] = useState<{
    call_number: number;
    reservation_id: number;
  }>();

  const handleCall = async (reservationId?: number) => {
    if (!reservationId) return;

    const res = await putReservationCalled(reservationId);
    setResult(res);
    setIsVisible(true);
  };

  const handleComplete = async (reservationId?: number) => {
    if (!reservationId) return;

    const res = await putReservationDone(reservationId);
    setResult(res);
    setIsVisible(true);
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      setIsConnected(true);
      console.log('connected');
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log('disconnected');
    };

    const onMessage = (data: string) => {
      const reservation = JSON.parse(data);
      console.log(reservation);
      setReservations(reservation);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message', onMessage);
      socket.disconnect();
    };
  }, []);

  const renderCell = useCallback(
    (item: ReservationWithEvent, columnKey: Key) => {
      const cellValue = item[columnKey as keyof typeof item];

      switch (columnKey) {
        case 'call':
          return (
            <Button
              variant="solid"
              color="primary"
              onPress={() => {
                setSelectNum({
                  call_number: item.callNumber,
                  reservation_id: item.id,
                });
                onOpenCall();
              }}
            >
              呼出
            </Button>
          );

        case 'complete':
          return (
            <Button
              variant="solid"
              color="danger"
              onPress={() => {
                setSelectNum({
                  call_number: item.callNumber,
                  reservation_id: item.id,
                });
                onOpenComplete();
              }}
            >
              完了
            </Button>
          );

        default:
          return cellValue;
      }
    },
    [onOpenCall, onOpenComplete],
  );

  if (!isConnected) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl">
        <span className="text-4xl font-medium">
          {lastDoneReservation?.callNumber}番
        </span>
        まで呼出済み
      </h2>

      <div className="flex gap-4">
        <Card className="w-full basis-2/3">
          <CardHeader>
            <h2>呼出前</h2>
          </CardHeader>
          <CardBody className="flex flex-row flex-wrap gap-2">
            <AdminCallReservationTable
              reservations={reservations}
              renderCell={renderCell}
            />
          </CardBody>
        </Card>
        <Card className="basis-1/3">
          <CardHeader>呼出中</CardHeader>
          <CardBody className="flex flex-col gap-2">
            <AdminCalledReservationTable
              reservations={reservations}
              renderCell={renderCell}
            />
          </CardBody>
        </Card>
      </div>
      <Modal
        isOpen={isOpenCall}
        onOpenChange={onOpenCallChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-2xl">呼び出し確認</ModalHeader>
              <ModalBody>
                <h3 className="text-xl">
                  {selectNum?.call_number}番を呼び出します
                </h3>
                <p>よろしいですか？</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  戻る
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleCall(selectNum?.reservation_id);
                    onClose();
                  }}
                >
                  呼出
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenComplete}
        onOpenChange={onOpenCompleteChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-2xl">呼出完了確認</ModalHeader>
              <ModalBody>
                <h3 className="text-xl">
                  {selectNum?.call_number}番の呼び出しを完了します
                </h3>
                <p>よろしいですか？</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  戻る
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleComplete(selectNum?.reservation_id);
                    onClose();
                  }}
                >
                  呼出
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isVisible}
        placement="top"
        backdrop="transparent"
        hideCloseButton
      >
        <ModalContent>
          {result ? (
            <Alert
              color="success"
              title="呼び出し完了"
              description={`${selectNum?.call_number}番を呼び出しました`}
              variant="faded"
              onClose={() => setIsVisible(false)}
            />
          ) : (
            <Alert
              color="danger"
              title="エラー"
              description="呼び出しに失敗しました"
              variant="faded"
              onClose={() => setIsVisible(false)}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
