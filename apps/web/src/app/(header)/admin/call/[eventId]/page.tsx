import { auth } from '@/auth';
import { CallCard } from '@/components/layout/admin/call/card';
import { hcWithAuth } from '@/utils/hc';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { notFound } from 'next/navigation';

export default async function CallDetailPage({
  params,
}: {
  params: Promise<{
    eventId: string;
  }>;
}) {
  const session = await auth();
  const { eventId } = await params;

  if (!session) notFound();

  const client = hcWithAuth(session.user.accessToken);

  const rowResponceEvent = await client.api.v1.events[':id'].$get({
    param: {
      id: eventId,
    },
  });

  if (!rowResponceEvent.ok) notFound();

  const event = await rowResponceEvent.json();

  const rowResponceReservation = await client.api.v1.reservations.$get({
    query: {
      eventId: eventId,
    },
  });

  if (!rowResponceReservation.ok) {
    return (
      <>
        <h1 className="text-3xl">予約呼び出し</h1>
        <Card className="w-full flex items-center">
          <CardHeader>
            <h2 className="text-2xl">エラー</h2>
          </CardHeader>
          <CardBody>
            <p>イベントの取得に失敗しました</p>
          </CardBody>
        </Card>
      </>
    );
  }

  const reservations = await rowResponceReservation.json();

  return (
    <>
      <h1 className="text-3xl">予約呼び出し</h1>
      <h2 className="text-2xl">
        {event.name} {event.date} {event.startTime}~{event.endTime}
      </h2>
      <CallCard reservations={reservations} />
    </>
  );
}
