import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Chat from "@/components/Chat";

export default async function PageChat() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return <Chat userId={user.id} email={user.email} />;
}
