import { auth } from '@/auth';
import {
  MyAccountSettingsButton,
  MyPasswordSettingsButton,
  MyReservationsButton,
} from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';

export default async function Page() {
  const session = await auth();

  return (
    <>
      <h1 className="text-4xl font-medium">マイページ</h1>

      <Card>
        <CardHeader className="flex justify-center">
          <h2 className="text-2xl font-medium">{session?.user.name}様</h2>
        </CardHeader>

        <CardBody>
          <div className="flex flex-col gap-4">
            <MyReservationsButton color="primary" />
            <MyAccountSettingsButton isDisabled />
            <MyPasswordSettingsButton isDisabled />
          </div>
        </CardBody>
      </Card>
    </>
  );
}
