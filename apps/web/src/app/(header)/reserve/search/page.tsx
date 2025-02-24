'use server';

import { auth } from '@/auth';
import { EventListCard } from '@/components/layout/reserve/search/card';
import { hcWithAuth } from '@/utils/hc';
import { Card, CardBody, CardHeader } from '@heroui/card';

export default async function Home() {
  const session = await auth();
  if (!session) {
    return null;
  }

  const client = hcWithAuth(session.user.accessToken);
  const rowResponce = await client.api.v1.events.$get({
    query: {},
  });

  if (rowResponce.ok) {
    const events = await rowResponce.json();

    return (
      <>
        <h1 className="text-center text-4xl font-medium">新規予約</h1>

        <Card className="w-full" shadow="none">
          <CardHeader className="flex justify-center">
            <h2 className="text-3xl font-medium">体験運転スケジュール</h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <EventListCard events={events} />
          </CardBody>
        </Card>
      </>
    );
  }

  return (
    <>
      <h1 className="text-center text-4xl font-medium">新規予約</h1>

      <Card className="w-full p-4">
        <CardHeader className="flex justify-center">
          <h2 className="text-3xl font-medium">体験運転スケジュール</h2>
        </CardHeader>
        <CardBody>
          <p className="text-center text-2xl">
            スケジュールの取得に失敗しました。
          </p>
        </CardBody>
      </Card>
    </>
  );
}
