"use client";

export default function Connections({ connections }: { connections: any[] }) {
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
                    <p className="text-sm text-gray-500">(2nd)</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {connection.connection.properties.email}
                  </p>
                </div>
                <button
                  className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 active:bg-red-800"
                  onClick={async () => {
                    await fetch(
                      `/api/connections/remove?id=${encodeURIComponent(connection.connection.properties.id)}`,
                      { method: "DELETE" },
                    );
                  }}
                >
                  Remove
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
