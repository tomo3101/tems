'use client';

import { CalledTable, WaitingTable } from '@/components/ui/table';
import { ReservationWithEvent } from '@/utils/hc';
import { socket } from '@/utils/socket';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import { useEffect, useState } from 'react';

interface WaitingCardProps {
  callNumber?: number;
  reservations: ReservationWithEvent[];
}

export const WaitingCard = ({ callNumber, reservations }: WaitingCardProps) => {
  const lastDoneReservation = reservations.findLast(
    (reservation) => reservation.status === 'done',
  );

  return (
    <>
      <Card>
        <CardHeader>呼出済み</CardHeader>
        <CardBody className="flex justify-center items-center">
          {lastDoneReservation ? (
            <h2 className="text-2xl">
              <span className="text-4xl font-medium">
                {lastDoneReservation?.callNumber}番
              </span>
              まで呼出済みです
            </h2>
          ) : (
            <h2 className="text-2xl">呼出済みはありません</h2>
          )}
        </CardBody>
      </Card>
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="sm:basis-2/3">
          <CardHeader>
            <h2>順番待ち</h2>
          </CardHeader>
          <CardBody className="flex flex-row flex-wrap gap-2">
            <WaitingTable
              selectCallNumber={callNumber}
              reservations={reservations}
            />
          </CardBody>
        </Card>
        <Card className="sm:basis-1/3">
          <CardHeader>
            <h2>呼出中</h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <CalledTable
              selectCallNumber={callNumber}
              reservations={reservations}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export const WaitingReservationEventCard = ({
  reservations: initialReservations,
}: WaitingCardProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [reservations, setReservations] = useState(initialReservations);

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

  if (!isConnected) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <WaitingCard reservations={reservations} />;
};
