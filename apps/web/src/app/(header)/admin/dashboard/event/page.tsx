import { auth } from '@/auth';
import { EventsTable } from '@/components/layout/admin/dashboard/event';
import { hcWithAuth } from '@/utils/hc';
import { notFound } from 'next/navigation';

export default async function EventPage() {
  const session = await auth();
  if (!session) notFound();

  const client = hcWithAuth(session.user.accessToken);

  const rowResponce = await client.api.v1.events.$get({
    query: {},
  });

  if (!rowResponce.ok) notFound();

  const events = await rowResponce.json();

  return (
    <>
      <h1 className="text-center text-4xl font-medium">イベント一覧</h1>
      <EventsTable events={events} />
    </>
  );
}
