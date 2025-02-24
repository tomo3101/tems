import { auth } from '@/auth';
import { WaitingReservationCard } from '@/components/layout/wainting/reservation/card';
import { hcWithAuth } from '@/utils/hc';
import { notFound } from 'next/navigation';
import { fetchReservations } from '../../actions';

export default async function WaitingReservationIdStatusPage({
  params,
}: {
  params: Promise<{ reservationId: string }>;
}) {
  const { reservationId } = await params;
  const session = await auth();

  if (!session) notFound();

  const client = hcWithAuth(session.user.accessToken);
  const rowResponse = await client.api.v1.reservations[':id'].$get({
    param: {
      id: reservationId,
    },
  });

  if (!rowResponse.ok) notFound();

  const reservation = await rowResponse.json();
  const reservations = await fetchReservations(reservation.eventId.toString());

  if (!reservations) notFound();

  return (
    <>
      <h1 className="text-center text-4xl font-medium">順番待ち状況</h1>
      <WaitingReservationCard
        reservationId={reservationId}
        callNumber={reservation.callNumber}
        reservations={reservations}
      />
    </>
  );
}
