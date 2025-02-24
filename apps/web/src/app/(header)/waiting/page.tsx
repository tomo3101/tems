import { EventWaitingStatusCard } from '@/components/layout/event/card';
import { Card, CardBody, CardHeader } from '@heroui/card';

export default function WaitingPage() {
  return (
    <>
      <h1 className="text-4xl font-medium">イベント待ち状況</h1>

      <Card>
        <CardHeader className="flex justify-center">
          <h2 className="text-3xl font-medium">体験運転スケジュール</h2>
        </CardHeader>
        <CardBody>
          <EventWaitingStatusCard />
        </CardBody>
      </Card>
    </>
  );
}
