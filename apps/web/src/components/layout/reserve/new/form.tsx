'use client';

import { useReservationStore } from '@/store/reservationStore';
import { Event } from '@/utils/hc';
import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { useRouter } from 'next/navigation';

interface ReserveFormProps {
  event: Event;
}

export const ReserveForm = ({ event }: ReserveFormProps) => {
  const router = useRouter();
  const { data, setData } = useReservationStore();

  const onSubmit = (form: FormData) => {
    const numberOfPeople = form.get('numberOfPeople');

    if (numberOfPeople) {
      setData({
        eventId: event.id,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        numberOfPeople: Number(numberOfPeople),
      });

      router.push('/reserve/confirm');
    }
  };

  return (
    <Form
      className="w-full h-full flex flex-col justify-between"
      validationBehavior="native"
      action={onSubmit}
    >
      <div className="w-full flex flex-col gap-8">
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
          <Input
            isRequired
            errorMessage="ご利用人数を入力してください"
            name="numberOfPeople"
            type="number"
            endContent="名"
            min={1}
            max={event.capacity - (event.reservedCount ?? 0)}
            defaultValue={data.numberOfPeople.toString()}
          />
        </div>
        <div>
          <h2 className="text-2xl">残数</h2>
          <p className="text-2xl">
            {event.capacity - (event.reservedCount ?? 0)}名
          </p>
        </div>
      </div>

      <div className="w-full flex justify-between gap-8">
        <Button color="default" onPress={() => router.back()} fullWidth>
          戻る
        </Button>
        <Button color="primary" type="submit" fullWidth>
          次へ
        </Button>
      </div>
    </Form>
  );
};
