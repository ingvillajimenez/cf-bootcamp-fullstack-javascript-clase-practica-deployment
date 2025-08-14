import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OrderList from "@/components/OrderList";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { data: orders } = await supabase.from("order").select("*");

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <OrderList orders={orders as any[]} />
    </div>
  );
}
