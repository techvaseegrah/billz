import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import SettingsForm from '@/components/settings/SettingsForm';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const orgId = parseInt(session.user.id, 10);
  const organisationData = await prisma.organisation.findUnique({
    where: { id: orgId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      shopName: true,
      endDate:true,
      subscriptionType: true,
      razorpayAccessToken: true,
      // etc.
    }
  });

  if (!organisationData) {
    redirect('/login');
  }

  // If user subscription is "pro", also fetch mandates
  let mandates = [];
  let activeMandate = null;
  if (organisationData?.subscriptionType !== 'trial') {
    [mandates, activeMandate] = await Promise.all([
      prisma.mandate.findMany({
        where: { organisationId: orgId },
        orderBy: { id: 'desc' },
      }),
      prisma.activeMandate.findUnique({
        where: { organisationId: orgId },
      }),
    ]);
  }

  // Pass everything into the client component
  return (
    <SettingsForm
      initialData={{
        ...organisationData,
        mandates,
        activeMandate,
      }}
    />
  );
}
