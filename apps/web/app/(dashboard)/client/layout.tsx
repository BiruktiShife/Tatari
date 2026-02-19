import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In real app, get user from auth context
  const user = {
    name: "John Doe",
    email: "john@example.com",
    type: "client" as const,
  };

  return (
    <DashboardLayout userType="client" userName={user.name}>
      {children}
    </DashboardLayout>
  );
}
