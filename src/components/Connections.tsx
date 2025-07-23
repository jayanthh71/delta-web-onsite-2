"use client";

import { useState } from "react";

export default function Connections({ connections }: { connections: any[] }) {
  const [removingUsers, setRemovingUsers] = useState<{
    [key: string]: boolean;
  }>({});
  const [removedUsers, setRemovedUsers] = useState<{ [key: string]: boolean }>(
    {},
  );
  return (
    <div>
      <p className="mb-8 text-xl">Your Connections:</p>
      {connections.length > 0 ? (
        <div className="w-full max-w-2xl">
          <div className="space-y-2">
            {connections.map((connection: any, index: number) => (
              <div
                key={index}
                className="flex w-3xl items-center justify-between rounded-xl border border-gray-300 p-4"
              >
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <p className="font-semibold">
                      {connection.connection.properties.name}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {connection.connection.properties.email}
                  </p>
                </div>
                <button
                  className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 active:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                  disabled={
                    removingUsers[connection.connection.properties.id] ||
                    removedUsers[connection.connection.properties.id]
                  }
                  onClick={async () => {
                    const userId = connection.connection.properties.id;
                    setRemovingUsers((prev) => ({ ...prev, [userId]: true }));

                    try {
                      await fetch(
                        `/api/connections/remove?id=${encodeURIComponent(userId)}`,
                        { method: "DELETE" },
                      );
                      setRemovedUsers((prev) => ({ ...prev, [userId]: true }));
                    } catch (error) {
                      console.error("Failed to remove connection:", error);
                    } finally {
                      setRemovingUsers((prev) => ({
                        ...prev,
                        [userId]: false,
                      }));
                    }
                  }}
                >
                  {removingUsers[connection.connection.properties.id]
                    ? "Removing..."
                    : removedUsers[connection.connection.properties.id]
                      ? "Removed"
                      : "Remove"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-500">No connections</div>
      )}
    </div>
  );
}
