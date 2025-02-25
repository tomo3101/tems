import { auth } from '@/auth';
import { CheckinNavButton } from '@/components/layout/admin/checkin/button';
import { hcWithAuth } from '@/utils/hc';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { notFound } from 'next/navigation';

export default async function CheckinConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ qrcode: string }>;
}) {
  const { qrcode } = await searchParams;

  const session = await auth();
  if (!session) notFound();

  const client = hcWithAuth(session.user.accessToken);

  const rowResponce = await client.api.v1.reservations.qrcode[
    ':qrCodeHash'
  ].$get({
    param: {
      qrCodeHash: qrcode,
    },
  });

  if (!rowResponce.ok) {
    return (
      <>
        <h1 className="text-4xl font-medium">チェックイン確認</h1>
        <p>QRコードが見つかりませんでした。</p>
      </>
    );
  }

  const reservation = await rowResponce.json();

  const rowEventResponce = await client.api.v1.events[':id'].$get({
    param: {
      id: reservation.eventId.toString(),
    },
  });

  const rowMemberResponce = await client.api.v1.members[':id'].$get({
    param: {
      id: reservation.memberId.toString(),
    },
  });

  if (rowEventResponce.ok && rowMemberResponce.ok) {
    const event = await rowEventResponce.json();
    const member = await rowMemberResponce.json();

    return (
      <>
        <h1 className="text-4xl">チェックイン</h1>

        <Card className="w-full">
          <CardHeader className="flex justify-center">
            <h2 className="text-2xl">予約内容を確認してください</h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <p>予約番号: {reservation.id}</p>
            <p>予約者名: {member.name}様</p>
            <p>名称: {event.name}</p>
            <p>
              日時: {event.date} {event.startTime}~{event.endTime}
            </p>
            <p>予約人数: {reservation.numberOfPeople}</p>
          </CardBody>
          <CardFooter>
            <CheckinNavButton reservationId={reservation.id} />
          </CardFooter>
        </Card>
      </>
    );
  }
}
