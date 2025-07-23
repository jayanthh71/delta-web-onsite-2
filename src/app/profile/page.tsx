import ConnectionRequests from "@/components/ConnectionRequests";
import Connections from "@/components/Connections";
import SignOutButton from "@/components/SignOutButton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/");
  }

  const myConnectionData = await fetch(
    "http://localhost:3000/api/connections?id=" + encodeURIComponent(user.id!),
  );
  const { connections } = await myConnectionData.json();

  const connectionData = await fetch(
    "http://localhost:3000/api/connections/request?for=" +
      encodeURIComponent(user.id!),
  );
  const { requests } = await connectionData.json();

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 font-sans">
      <h1 className="mt-20 text-4xl font-bold text-gray-300">My Profile</h1>
      <div className="flex flex-col gap-4">
        <p className="text-lg font-bold">Hello, {user.name}</p>
        <p className="text-sm text-gray-300">{user.email}</p>
        <SignOutButton />
      </div>
      <Connections connections={connections} />
      <ConnectionRequests requests={requests} />
    </div>
  );
}
