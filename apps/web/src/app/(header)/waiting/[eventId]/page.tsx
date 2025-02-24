import { WaitingReservationEventCard } from '@/components/layout/wainting/card';
import { notFound } from 'next/navigation';
import { fetchEvent, fetchReservations } from '../actions';

export default async function WaitingReservationEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await fetchEvent(eventId);
  const reservations = await fetchReservations(eventId);

  if (!event) notFound();
  if (!reservations) notFound();

  return (
    <>
      <h1 className="text-center text-4xl font-medium">順番待ち状況</h1>
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-medium">{event.name}</h2>
        <p className="text-xl">
          {event.date} {event.startTime} ~ {event.endTime}
        </p>
      </div>
      <WaitingReservationEventCard reservations={reservations} />
    </>
  );
}
