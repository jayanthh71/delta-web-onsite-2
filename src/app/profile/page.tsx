import { auth } from "@/lib/auth";

export default async function Profile() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 font-sans">
      <h1 className="text-3xl font-bold text-gray-300">My Profile</h1>
      <div className="flex flex-col gap-4"></div>
    </div>
  );
}
