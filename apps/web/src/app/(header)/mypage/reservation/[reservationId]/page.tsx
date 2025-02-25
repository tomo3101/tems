'use server';

import { auth } from '@/auth';
import { CheckinButtonModal } from '@/components/layout/mypage/reservation/button';
import { StatusChip } from '@/components/ui/chip';
import { hcWithAuth } from '@/utils/hc';
import { Card } from '@heroui/card';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ reservationId: string }>;
}) {
  const { reservationId } = await params;

  const session = await auth();
  if (!session) notFound();

  const client = hcWithAuth(session.user.accessToken);

  const rowResponce = await client.api.v1.reservations[':id'].$get({
    param: {
      id: reservationId,
    },
  });

  if (!rowResponce.ok) notFound();
  const reservation = await rowResponce.json();

  const rowEventResponce = await client.api.v1.events[':id'].$get({
    param: {
      id: reservation.eventId.toString(),
    },
  });

  if (!rowEventResponce.ok) notFound();
  const event = await rowEventResponce.json();

  const eventStartTime = event.startTime.split(':').slice(0, 2).join(':');
  const eventEndTime = event.endTime.split(':').slice(0, 2).join(':');

  return (
    <>
      <h1 className="text-4xl font-medium">予約詳細</h1>

      <div className="w-full flex flex-col gap-8 p-4">
        <div className="grid grid-cols-[max-content,1fr] gap-4">
          <p>名称</p>
          <p>{event.name}</p>

          <p>予約番号</p>
          <p>{reservation.id}</p>

          <p>予約日</p>
          <p>{event.date}</p>

          <p>予約時間</p>
          <p>
            {eventStartTime}~{eventEndTime}
          </p>

          <p>予約人数</p>
          <p>{reservation.numberOfPeople}</p>

          <p>ステータス</p>
          <StatusChip status={reservation.status} />
        </div>

        {reservation.status === 'reserved' && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-center">
              <Card className="w-full max-w-[350px] flex items-center justify-center">
                <QRCodeSVG
                  value={reservation.qrCodeHash}
                  level="M"
                  marginSize={4}
                  style={{ width: '100%', height: '100%' }}
                />
              </Card>
            </div>

            <CheckinButtonModal reservationId={parseInt(reservationId)} />
          </div>
        )}

        {(reservation.status === 'checked_in' ||
          reservation.status === 'called') && (
          <div className="flex justify-center">
            <Button
              as={Link}
              href={`/waiting/reservation/${reservationId}`}
              variant="solid"
              color="primary"
            >
              現在の順番はこちら
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
