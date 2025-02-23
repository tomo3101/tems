'use server';

import { auth } from '@/auth';
import { ReserveForm } from '@/components/layout/reserve/new/form';
import { hcWithAuth } from '@/utils/hc';
import { notFound } from 'next/navigation';

export default async function Home({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const session = await auth();
  const { eventId } = await params;

  if (!session) notFound();

  const client = hcWithAuth(session.user.accessToken);
  const rowResponce = await client.api.v1.events[':id'].$get({
    param: { id: eventId },
  });

  if (!rowResponce.ok) notFound();

  const event = await rowResponce.json();

  return (
    <>
      <h1 className="text-4xl font-medium">予約</h1>

      <ReserveForm event={event} />
    </>
  );
}
