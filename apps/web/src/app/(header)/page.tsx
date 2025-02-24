import { auth } from '@/auth';
import { EventAvailabilityCard } from '@/components/layout/event/card';
import { MyReservationsButton, NewReserveButton } from '@/components/ui/button';
import { UsageNotesCard } from '@/components/ui/card';
import { SplideTop } from '@/components/ui/splide';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { hcWithType } from 'api/hc';
import dayjs from 'dayjs';

export default async function HomePage() {
  const session = await auth();

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

  return (
    <div className="w-full min-h-main flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-8 p-8">
        <SplideTop />

        {session?.user && session.user.role == 'member' ? (
          <div className="md:hidden w-full flex justify-between items-center gap-4 mx-auto h-16">
            <NewReserveButton
              variant="solid"
              color="primary"
              size="sm"
              className="h-full"
              fullWidth
            />
            <MyReservationsButton
              variant="solid"
              color="primary"
              size="sm"
              className="h-full"
              fullWidth
            />
          </div>
        ) : null}

        <Card>
          <CardHeader className="flex justify-center">
            <h2 className="text-3xl font-medium text-center [&>span]:inline-block">
              <span>次回の</span>
              <span>体験運転</span>
              <span>スケジュール</span>
            </h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            {rowResponce.ok ? (
              <EventAvailabilityCard
                showNextOnly
                events={await rowResponce.json()}
              />
            ) : (
              <h2 className="text-center text-2xl font-medium">
                体験運転スケジュールの取得に失敗しました
              </h2>
            )}
          </CardBody>
        </Card>

        <UsageNotesCard />
      </div>
    </div>
  );
}
