import { Button } from '@heroui/button';
import { Card, CardFooter, CardHeader } from '@heroui/react';
import Link from 'next/link';

export default function CheckinCompletePage() {
  return (
    <>
      <h1 className="text-4xl">チェックイン完了</h1>

      <Card className="w-full">
        <CardHeader className="flex justify-center">
          <h2 className="text-2xl">チェックインが完了しました</h2>
        </CardHeader>
        <CardFooter>
          <Button
            as={Link}
            href="/admin/receipt"
            variant="solid"
            color="primary"
            fullWidth
          >
            最初の画面に戻る
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
