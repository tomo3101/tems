'use client';

import { ReservationIcon } from '@/components/ui/icon';
import { useReservationStore } from '@/store/reservationStore';
import { Event } from '@/utils/hc';
import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import Link from 'next/link';

interface EventListProps {
  events: Event[];
}

const getAvailabilityRatio = (
  capacity: number,
  reservedCount: number | undefined,
) => {
  if (reservedCount === undefined) return 0;

  return (capacity - reservedCount) / capacity;
};

export const EventListCard = ({ events }: EventListProps) => {
  const groupedEvents = Object.groupBy(events, ({ date }) => date);
  const { reset } = useReservationStore();

  return (
    <>
      {Object.entries(groupedEvents).map(([date, events]) => (
        <Card className="flex flex-col gap-4 p-4" shadow="sm" key={date}>
          <h3 className="text-2xl mx-auto">{date}</h3>
          <div className="flex flex-col gap-2">
            {events &&
              events.map((event) => (
                <Card
                  className="flex flex-row justify-between sm:grid sm:grid-cols-[1fr,max-content,1fr] gap-2 px-2 items-center"
                  shadow="none"
                  key={event.id}
                >
                  <p className="text-lg text-center sm:text-left">
                    {event.startTime.split(':').slice(0, 2).join(':')}~
                    {event.endTime.split(':').slice(0, 2).join(':')}
                  </p>

                  <div className="flex items-center justify-center">
                    <ReservationIcon
                      ratio={getAvailabilityRatio(
                        event.capacity,
                        event.reservedCount,
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-end">
                    <Button
                      as={Link}
                      color="primary"
                      href={`/reserve/new/${event.id}`}
                      size="sm"
                      onPress={() => reset()}
                      isDisabled={
                        getAvailabilityRatio(
                          event.capacity,
                          event.reservedCount,
                        ) === 0
                      }
                    >
                      予約
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </Card>
      ))}
    </>
  );
};
