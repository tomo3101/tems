import { auth } from '@/auth';
import {
  AdminAccountButton,
  AdminPasswordSettingsButton,
} from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';

export default async function AdminPage() {
  const session = await auth();

  return (
    <div className="w-full min-h-main flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-8 p-8">
        <h1 className="text-4xl font-medium">管理者ページ</h1>

        <Card>
          <CardHeader className="flex justify-center">
            <h2 className="text-2xl font-medium">{session?.user.name}様</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              <AdminAccountButton isDisabled />
              <AdminPasswordSettingsButton isDisabled />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
