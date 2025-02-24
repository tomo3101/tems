import { EventAvailabilityCard } from '@/components/layout/event/card';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { hcWithType } from 'api/hc';
import dayjs from 'dayjs';

export default async function EventStatusPage() {
  const client = hcWithType('http://localhost:3001', {
    fetch: (input: RequestInfo | URL, requestInit?: RequestInit) =>
      fetch(input, {
        cache: 'no-cache',
        ...requestInit,
      }),
  });

  const rowResponce = await client.api.v1.events.$get({
    query: {
      startDate: dayjs().format('YYYY-MM-DD'),
    },
  });

  if (!rowResponce.ok) {
    return (
      <>
        <h1 className="text-4xl font-medium">イベント空き状況</h1>

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

  const events = await rowResponce.json();

  return (
    <>
      <h1 className="text-4xl font-medium">イベント空き状況</h1>

      <Card>
        <CardHeader className="flex justify-center">
          <h2 className="text-3xl font-medium">体験運転スケジュール</h2>
        </CardHeader>
        <CardBody>
          <EventAvailabilityCard events={events} />
        </CardBody>
      </Card>
    </>
  );
}
