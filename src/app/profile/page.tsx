"use client";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/");
  }

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
      </div>

      <div>
        <p className="mb-8 text-xl">Your Connection Requests:</p>
        {requests.length > 0 ? (
          <div className="w-full max-w-2xl">
            <div className="space-y-2">
              {requests.map((request: any, index: number) => (
                <div
                  key={index}
                  className="flex w-3xl items-center justify-between rounded-xl border border-gray-300 p-4"
                >
                  <div>
                    <div className="flex items-center justify-center gap-2">
                      <p className="font-semibold">
                        {request.requester.properties.name}
                      </p>
                      <p className="text-sm text-gray-500">(2nd)</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {request.requester.properties.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 active:bg-blue-800"
                      onClick={async () => {
                        await fetch(
                          `/api/connections/accept?id=${encodeURIComponent(request.requester.properties.id)}`,
                          { method: "POST" },
                        );
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 active:bg-red-800"
                      onClick={async () => {
                        await fetch(
                          `/api/connections/reject?id=${encodeURIComponent(request.requester.properties.id)}`,
                          { method: "POST" },
                        );
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No connection requests</div>
        )}
      </div>
    </div>
  );
}
