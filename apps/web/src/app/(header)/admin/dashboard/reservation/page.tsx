import { auth } from '@/auth';
import { ReservationsTable } from '@/components/layout/admin/dashboard/reservation';
import { hcWithAuth } from '@/utils/hc';
import { notFound } from 'next/navigation';

export default async function ReservationPage() {
  const session = await auth();
  if (!session) notFound();

  const client = hcWithAuth(session.user.accessToken);

  const rowResponse = await client.api.v1.reservations.$get({
    query: {},
  });

  if (!rowResponse.ok) notFound();

  const reservations = await rowResponse.json();

  return (
    <>
      <h1 className="text-center text-4xl font-medium">予約一覧</h1>
      <ReservationsTable reservations={reservations} />
    </>
  );
}
