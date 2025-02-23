'use server';

import { EventAvailabilityTable } from '@/components/ui/table';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { hcWithType } from 'api/hc';
import dayjs from 'dayjs';

interface EventAvailabilityCardProps {
  showNextOnly?: boolean;
}

export const EventAvailabilityCard = async ({
  showNextOnly = false,
}: EventAvailabilityCardProps) => {
  const client = hcWithType('http://localhost:3001');

  const rowResponce = await client.api.v1.events.$get({
    query: {
      startDate: dayjs().format('YYYY-MM-DD'),
    },
  });

  if (!rowResponce.ok) {
    return (
      <Card>
        <CardHeader className="flex items-center">
          <h2 className="text-3xl font-medium">
            体験運転スケジュールの取得に失敗しました
          </h2>
        </CardHeader>
      </Card>
    );
  }

  const events = await rowResponce.json();
  const groupedEvents = Object.groupBy(events, ({ date }) => date);

  if (Object.keys(groupedEvents).length === 0) {
    return (
      <Card>
        <CardHeader className="flex justify-center">
          <h2 className="text-3xl font-medium">次回の体験運転スケジュール</h2>
        </CardHeader>
        <CardBody className="flex justify-center items-center">
          <p className="text-2xl">次回の体験運転スケジュールは未定です</p>
        </CardBody>
      </Card>
    );
  }

  const dates = Object.keys(groupedEvents).sort();
  const nextDate = dates[0];

  return (
    <div className="w-full max-w-xl flex flex-col mx-auto gap-4">
      {Object.entries(groupedEvents)
        .filter(([date]) => !showNextOnly || date === nextDate)
        .map(([date, events]) => (
          <Card className="flex flex-col gap-4 p-4" shadow="sm" key={date}>
            <h3 className="text-2xl mx-auto">{date}</h3>

            <EventAvailabilityTable events={events} />
          </Card>
        ))}
    </div>
  );
};
