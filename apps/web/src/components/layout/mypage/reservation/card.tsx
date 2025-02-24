import { StatusChip } from '@/components/ui/chip';
import { ReservationWithEvent } from '@/utils/hc';
import { Button } from '@heroui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import dayjs from 'dayjs';
import Link from 'next/link';

interface ReservationListCardProps {
  reservations: ReservationWithEvent[];
}

interface ReservationCardProps {
  reservation: ReservationWithEvent;
}

export const ReservationListCard = ({
  reservations,
}: ReservationListCardProps) => {
  return (
    <div className="w-full flex flex-col gap-8">
      {reservations.map((reservation) => (
        <ReservationCard key={reservation.id} reservation={reservation} />
      ))}
    </div>
  );
};

export const ReservationCard = ({ reservation }: ReservationCardProps) => {
  const eventDate = dayjs(reservation.eventDate).format('YYYY-MM-DD');
  const eventStartTime = reservation.eventStartTime
    ?.split(':')
    .slice(0, 2)
    .join(':');
  const eventEndTime = reservation.eventEndTime
    ?.split(':')
    .slice(0, 2)
    .join(':');

  return (
    <>
      <Card className="w-full p-4" key={reservation.id}>
        <CardHeader className="flex justify-center">
          <h2 className="text-2xl">{eventDate}</h2>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="grid grid-cols-[max-content,1fr] gap-4">
            <p>名称</p>
            <p>{reservation.eventName}</p>

            <p>予約時間</p>
            <p>
              {eventStartTime}~{eventEndTime}
            </p>

            <p>受付番号</p>
            <p>{reservation.callNumber}</p>

            <p>ステータス</p>
            <StatusChip status={reservation.status} />
          </div>
        </CardBody>
        <CardFooter>
          <Button
            as={Link}
            href={`/mypage/reservation/${reservation.id}`}
            variant="solid"
            color="primary"
          >
            予約詳細
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
