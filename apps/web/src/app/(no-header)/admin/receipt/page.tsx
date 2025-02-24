import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import Link from 'next/link';

export default function ReceiptPage() {
  return (
    <div className="w-full max-w-4xl flex flex-col gap-16">
      <h1 className="text-6xl font-medium text-center">順番受付</h1>

      <div className="flex flex-row gap-4">
        <Card className="basis-1/2">
          <CardHeader className="flex justify-center">
            <h2 className="text-2xl font-medium">
              <span className="text-4xl">当日受付</span>のお客様
            </h2>
          </CardHeader>
          <CardBody>
            <Button
              isDisabled
              as={Link}
              href="/admin/receipt/reserve/search"
              variant="solid"
              color="danger"
              size="lg"
              className="h-32 text-4xl"
              fullWidth
            >
              発券
            </Button>
          </CardBody>
        </Card>

        <Card className="basis-1/2">
          <CardHeader className="flex justify-center">
            <h2 className="text-2xl font-medium">
              <span className="text-4xl">予約済み</span>のお客様
            </h2>
          </CardHeader>
          <CardBody>
            <Button
              as={Link}
              href="/admin/checkin"
              variant="solid"
              color="primary"
              size="lg"
              className="h-32 text-4xl"
              fullWidth
            >
              チェックイン
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
