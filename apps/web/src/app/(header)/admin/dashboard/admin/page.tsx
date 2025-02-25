import { auth } from '@/auth';
import { AdminsTable } from '@/components/layout/admin/dashboard/admin';
import { hcWithAuth } from '@/utils/hc';
import { notFound } from 'next/navigation';

export default async function AdminPage() {
  const session = await auth();
  if (!session) notFound();

  const client = hcWithAuth(session.user.accessToken);
  const rowResponse = await client.api.v1.admins.$get({
    query: {},
  });

  if (!rowResponse.ok) notFound();

  const admins = await rowResponse.json();

  return (
    <>
      <h1 className="text-center text-4xl font-medium">管理者一覧</h1>
      <AdminsTable admins={admins} />
    </>
  );
}
