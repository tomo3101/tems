import { auth } from '@/auth';
import { hcWithAuth } from '@/utils/hc';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import dayjs from 'dayjs';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CallPage() {
  const session = await auth();

  if (!session) notFound();

  const client = hcWithAuth(session.user.accessToken);

  const rowResponce = await client.api.v1.events.$get({
    query: {
      startDate: dayjs().format('YYYY-MM-DD'),
    },
  });

  if (!rowResponce.ok) {
    return (
      <>
        <h1 className="text-4xl">イベント一覧</h1>
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

  const events = await rowResponce.json();
  const groupedEvents = Object.groupBy(events, ({ date }) => date);

  return (
    <>
      <h1 className="text-4xl">イベント一覧</h1>
      <Card className="w-full">
        <CardHeader className="flex justify-center">
          <h2 className="text-2xl">呼び出しイベント選択</h2>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          {Object.entries(groupedEvents).map(([date, events]) => (
            <Card className="flex flex-col" key={date}>
              <CardHeader className="flex justify-center">
                <h3 className="text-xl">{date}</h3>
              </CardHeader>
              <CardBody className="flex flex-col gap-2">
                {events &&
                  events.map((event) => (
                    <div
                      className="flex items-center justify-between"
                      key={event.id}
                    >
                      <p className="text-lg">
                        {event.startTime}~{event.endTime}
                      </p>
                      <Button
                        as={Link}
                        href={`/admin/call/${event.id}`}
                        variant="solid"
                        color="primary"
                      >
                        呼び出し
                      </Button>
                    </div>
                  ))}
              </CardBody>
            </Card>
          ))}
        </CardBody>
      </Card>
    </>
  );
}
