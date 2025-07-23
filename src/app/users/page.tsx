"use client";

import { useState } from "react";

export default function Users() {
  const [userQuery, setUserQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDegrees, setUserDegrees] = useState<{ [key: string]: number }>({});
  const [connectingUsers, setConnectingUsers] = useState<{
    [key: string]: boolean;
  }>({});
  const [connectedUsers, setConnectedUsers] = useState<{
    [key: string]: boolean;
  }>({});

  const fetchUserDegree = async (userId: string) => {
    try {
      const response = await fetch(
        `/api/connections/degree?id=${encodeURIComponent(userId)}`,
      );
      const data = await response.json();
      return data.degree;
    } catch (error) {
      console.error("Failed to fetch user degree:", error);
      return 0;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(userQuery)}`,
      );
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);

        const degrees: { [key: string]: number } = {};
        for (const user of data.users) {
          const degree = await fetchUserDegree(user.users.properties.id);
          degrees[user.users.properties.id] = degree;
        }
        setUserDegrees(degrees);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDegreeLabel = (degree: number) => {
    switch (degree) {
      case 0:
        return "new";
      case 1:
        return "1st";
      case 2:
        return "2nd";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 font-sans">
      <h1 className="mt-20 text-4xl font-bold text-gray-300">Users</h1>
      <form
        className="flex flex-col items-center gap-5"
        onSubmit={handleSubmit}
      >
        <input
          className="w-80 rounded-xl border border-gray-300 px-5 py-2"
          type="text"
          placeholder="Search users"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
        />
        <button
          className="w-32 cursor-pointer rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400"
          type="submit"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {users.length > 0 ? (
        <div className="w-full max-w-2xl">
          <h2 className="mb-4 text-xl font-semibold text-gray-300">Results:</h2>
          <div className="space-y-2">
            {users.map((user: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-gray-300 p-4"
              >
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <p className="font-semibold">
                      {user.users.properties.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      (
                      {getDegreeLabel(
                        userDegrees[user.users.properties.id] || 0,
                      )}
                      )
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {user.users.properties.email}
                  </p>
                </div>
                <button
                  className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                  disabled={
                    connectingUsers[user.users.properties.id] ||
                    connectedUsers[user.users.properties.id]
                  }
                  onClick={async () => {
                    const userId = user.users.properties.id;
                    setConnectingUsers((prev) => ({ ...prev, [userId]: true }));

                    try {
                      await fetch(
                        `/api/connections/request?id=${encodeURIComponent(userId)}`,
                        { method: "POST" },
                      );
                      setConnectedUsers((prev) => ({
                        ...prev,
                        [userId]: true,
                      }));
                    } catch (error) {
                      console.error(
                        "Failed to send connection request:",
                        error,
                      );
                    } finally {
                      setConnectingUsers((prev) => ({
                        ...prev,
                        [userId]: false,
                      }));
                    }
                  }}
                >
                  {connectingUsers[user.users.properties.id]
                    ? "Connecting..."
                    : connectedUsers[user.users.properties.id]
                      ? "Connection Sent"
                      : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-500">No users found</div>
      )}
    </div>
  );
}
