import { EventWaitingStatusCard } from '@/components/layout/event/card';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { hcWithType } from 'api/hc';

export default async function WaitingPage() {
  const client = hcWithType('http://localhost:3001', {
    fetch: (input: RequestInfo | URL, requestInit?: RequestInit) =>
      fetch(input, {
        cache: 'no-cache',
        ...requestInit,
      }),
  });

  const rowEventsResponce = await client.api.v1.events.$get({
    query: {},
  });

  const rowReservationsResponce = await client.api.v1.reservations.$get({
    query: {},
  });

  if (!rowEventsResponce.ok || !rowReservationsResponce.ok) {
    return (
      <>
        <h1 className="text-4xl font-medium">イベント待ち状況</h1>

        <Card>
          <CardHeader className="flex justify-center">
            <h2 className="text-3xl font-medium">体験運転スケジュール</h2>
          </CardHeader>
          <CardBody>
            <p className="text-center text-2xl font-medium">
              体験運転スケジュールの取得に失敗しました
            </p>
          </CardBody>
        </Card>
      </>
    );
  }

  const events = await rowEventsResponce.json();
  const reservations = await rowReservationsResponce.json();

  return (
    <>
      <h1 className="text-4xl font-medium">イベント待ち状況</h1>

      <Card>
        <CardHeader className="flex justify-center">
          <h2 className="text-3xl font-medium">体験運転スケジュール</h2>
        </CardHeader>
        <CardBody>
          <EventWaitingStatusCard events={events} reservations={reservations} />
        </CardBody>
      </Card>
    </>
  );
}
