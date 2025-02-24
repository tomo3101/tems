'use server';

import { auth } from '@/auth';
import { ReservationListCard } from '@/components/layout/mypage/reservation/card';
import { hcWithAuth } from '@/utils/hc';
import { notFound } from 'next/navigation';

const ReservationList = async () => {
  const session = await auth();

  if (!session) notFound();

  const client = hcWithAuth(session.user.accessToken);
  const rowResponce = await client.api.v1.reservations.members[':id'].$get({
    param: { id: session.user.memberId.toString() },
    query: {},
  });

  if (!rowResponce.ok) notFound();

  const reservations = await rowResponce.json();

  return (
    <>
      <h1 className="text-4xl font-medium">予約一覧</h1>

      <ReservationListCard reservations={reservations} />
    </>
  );
};

export default ReservationList;
