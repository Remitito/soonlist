import ClientDashboard from "./ClientDashboard";
import { auth, signIn, signOut } from "@/auth";
export default async function Home() {
  const session = await auth();

  return (
    <div className="">
      <span>{session && session.user?.email}</span>
      <ClientDashboard />
    </div>
  );
}
