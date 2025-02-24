import { auth } from '@/auth';
import { MembersTable } from '@/components/layout/admin/dashboard/member';
import { hcWithAuth } from '@/utils/hc';
import { notFound } from 'next/navigation';

export default async function MemberPage() {
  const session = await auth();
  if (!session) notFound();

  const client = hcWithAuth(session.user.accessToken);
  const rowResponse = await client.api.v1.members.$get({
    query: {},
  });

  if (!rowResponse.ok) notFound();

  const members = await rowResponse.json();

  return (
    <>
      <h1 className="text-center text-4xl font-medium">会員一覧</h1>
      <MembersTable members={members} />
    </>
  );
}
