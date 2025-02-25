import {
  EventAvailabilityTable,
  EventWaitingStatusTable,
} from '@/components/ui/table';
import { Event, ReservationWithEvent } from '@/utils/hc';
import { Card } from '@heroui/card';

interface EventAvailabilityCardProps {
  showNextOnly?: boolean;
  events: Event[];
}

export const EventAvailabilityCard = ({
  showNextOnly = false,
  events,
}: EventAvailabilityCardProps) => {
  const groupedEvents = Object.groupBy(events, ({ date }) => date);

  if (Object.keys(groupedEvents).length === 0) {
    return (
      <h2 className="text-center text-2xl font-medium">
        次回の体験運転スケジュールは未定です
      </h2>
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

interface EventWaitingStatusCardProps {
  events: Event[];
  reservations: ReservationWithEvent[];
}

export const EventWaitingStatusCard = ({
  events,
  reservations,
}: EventWaitingStatusCardProps) => {
  const groupedEvents = Object.groupBy(events, ({ date }) => date);

  if (Object.keys(groupedEvents).length === 0) {
    return (
      <h2 className="text-center text-2xl font-medium">
        次回の体験運転スケジュールは未定です
      </h2>
    );
  }

  return (
    <div className="w-full max-w-xl flex flex-col mx-auto gap-4">
      {Object.entries(groupedEvents).map(([date, events]) => (
        <Card className="flex flex-col gap-4 p-4" shadow="sm" key={date}>
          <h3 className="text-2xl mx-auto">{date}</h3>

          <EventWaitingStatusTable
            events={events}
            reservations={reservations}
          />
        </Card>
      ))}
    </div>
  );
};
