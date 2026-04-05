import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role, email:id") // email is not in profiles by default in my schema, but let's see
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/login");
  }

  return (
    <DashboardLayout
      user={{
        name: profile.name,
        role: "admin",
        email: user.email || "",
      }}
    >
      {children}
    </DashboardLayout>
  );
}
