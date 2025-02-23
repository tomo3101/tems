import { auth } from '@/auth';
import { EventAvailabilityCard } from '@/components/layout/event/card';
import { MyReservationsButton, NewReserveButton } from '@/components/ui/button';
import { UsageNotesCard } from '@/components/ui/card';
import { SplideTop } from '@/components/ui/splide';
import { Card, CardBody, CardHeader } from '@heroui/card';

export default async function HomePage() {
  const session = await auth();

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
            <EventAvailabilityCard showNextOnly />
          </CardBody>
        </Card>

        <UsageNotesCard />
      </div>
    </div>
  );
}
