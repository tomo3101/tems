import { ReservationData } from '@/store/reservationStore';

interface ReserveCardProps {
  event: ReservationData;
}

export const ReserveCard = ({ event }: ReserveCardProps) => {
  return (
    <div className="h-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">日付</h2>
        <p className="text-2xl">{event.date}</p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">時間</h2>
        <p className="text-2xl">
          {event.startTime}~{event.endTime}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">ご利用人数</h2>
        <p className="text-2xl">{event.numberOfPeople}名</p>
      </div>
    </div>
  );
};
