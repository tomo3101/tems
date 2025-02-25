'use client';

import { WaitingCard } from '@/components/layout/wainting/card';
import { ReservationWithEvent } from '@/utils/hc';
import { socket } from '@/utils/socket';
import { Button } from '@heroui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Spinner } from '@heroui/spinner';
import { useEffect, useState } from 'react';

interface WaitingReservationCardProps {
  reservationId: string;
  callNumber: number;
  reservations: ReservationWithEvent[];
}

const getMyQueuePosition = (
  reservationId: string,
  reservations: WaitingReservationCardProps['reservations'],
) => {
  return reservations
    .filter((reservation) => reservation.status === 'checked_in')
    .findIndex((reservation) => reservation.id === parseInt(reservationId));
};

export const WaitingReservationCard = ({
  reservationId,
  callNumber,
  reservations: initialReservations,
}: WaitingReservationCardProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isCall, setIsCall] = useState(false);
  const [reservations, setReservations] = useState(initialReservations);
  const [queuePosition, setQueuePosition] = useState(
    getMyQueuePosition(reservationId, initialReservations),
  );

  const myReservation = reservations.find(
    (reservation) => reservation.id === parseInt(reservationId),
  );

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
      setReservations(reservation);
      setQueuePosition(getMyQueuePosition(reservationId, reservation));
    };

    const onCall = (data: string) => {
      console.log('onCall');

      const call = JSON.parse(data);

      if (call.reservationId === Number(reservationId)) {
        console.log('called');
        setIsCall(true);
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onMessage);
    socket.on('call', onCall);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message', onMessage);
      socket.off('call', onCall);
      socket.disconnect();
    };
  }, [reservationId]);

  if (!isConnected) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col items-center justify-center gap-4 text-2xl">
          <p>
            あなたの番号は
            <span className="text-4xl font-medium">{callNumber}番</span>です
          </p>
        </CardHeader>
        <CardBody className="text-2xl text-center">
          {queuePosition && queuePosition > 0 ? (
            <p>
              あと
              <span className="text-5xl font-medium">{queuePosition}組</span>
              です
            </p>
          ) : queuePosition === 0 ? (
            <p>まもなくお呼出しします</p>
          ) : (
            <>
              {myReservation?.status === 'called' && <p>お呼出中です</p>}
              {myReservation?.status === 'done' && <p>お呼出済みです</p>}
            </>
          )}
        </CardBody>
        {queuePosition && queuePosition >= 1 && queuePosition <= 2 ? (
          <CardFooter className="flex flex-col items-center text-xl">
            <p>あと{queuePosition}組になりました</p>
            <p>離れている場合はお戻りください</p>
          </CardFooter>
        ) : queuePosition === 0 ? (
          <CardFooter className="flex flex-col items-center text-xl">
            <p>離れている場合はお戻りください</p>
          </CardFooter>
        ) : null}
      </Card>
      <WaitingCard callNumber={callNumber} reservations={reservations} />
      <Modal isOpen={isCall} placement="center" onOpenChange={setIsCall}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-2xl">呼び出し</ModalHeader>
              <ModalBody>
                <h3 className="text-xl">あなたの番号が呼び出されました</h3>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  確認
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
