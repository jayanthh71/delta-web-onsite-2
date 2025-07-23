"use client";

import { useEffect, useState } from "react";

export default function ConnectionRequests({ requests }: { requests: any[] }) {
  const [userDegrees, setUserDegrees] = useState<{ [key: string]: number }>({});
  const [acceptingUsers, setAcceptingUsers] = useState<{
    [key: string]: boolean;
  }>({});
  const [acceptedUsers, setAcceptedUsers] = useState<{
    [key: string]: boolean;
  }>({});
  const [rejectingUsers, setRejectingUsers] = useState<{
    [key: string]: boolean;
  }>({});
  const [rejectedUsers, setRejectedUsers] = useState<{
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

  useEffect(() => {
    const fetchDegrees = async () => {
      const degrees: { [key: string]: number } = {};
      for (const request of requests) {
        const degree = await fetchUserDegree(request.requester.properties.id);
        degrees[request.requester.properties.id] = degree;
      }
      setUserDegrees(degrees);
    };

    if (requests.length > 0) {
      fetchDegrees();
    }
  }, [requests]);
  return (
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
                    <p className="text-sm text-gray-500">
                      (
                      {getDegreeLabel(
                        userDegrees[request.requester.properties.id] || 0,
                      )}
                      )
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {request.requester.properties.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                    disabled={
                      acceptingUsers[request.requester.properties.id] ||
                      acceptedUsers[request.requester.properties.id] ||
                      rejectingUsers[request.requester.properties.id] ||
                      rejectedUsers[request.requester.properties.id]
                    }
                    onClick={async () => {
                      const userId = request.requester.properties.id;
                      setAcceptingUsers((prev) => ({
                        ...prev,
                        [userId]: true,
                      }));

                      try {
                        await fetch(
                          `/api/connections/accept?id=${encodeURIComponent(userId)}`,
                          { method: "POST" },
                        );
                        setAcceptedUsers((prev) => ({
                          ...prev,
                          [userId]: true,
                        }));
                      } catch (error) {
                        console.error("Failed to accept connection:", error);
                      } finally {
                        setAcceptingUsers((prev) => ({
                          ...prev,
                          [userId]: false,
                        }));
                      }
                    }}
                  >
                    {acceptingUsers[request.requester.properties.id]
                      ? "Accepting..."
                      : acceptedUsers[request.requester.properties.id]
                        ? "Accepted"
                        : "Accept"}
                  </button>
                  <button
                    className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 active:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                    disabled={
                      rejectingUsers[request.requester.properties.id] ||
                      rejectedUsers[request.requester.properties.id] ||
                      acceptingUsers[request.requester.properties.id] ||
                      acceptedUsers[request.requester.properties.id]
                    }
                    onClick={async () => {
                      const userId = request.requester.properties.id;
                      setRejectingUsers((prev) => ({
                        ...prev,
                        [userId]: true,
                      }));

                      try {
                        await fetch(
                          `/api/connections/reject?id=${encodeURIComponent(userId)}`,
                          { method: "POST" },
                        );
                        setRejectedUsers((prev) => ({
                          ...prev,
                          [userId]: true,
                        }));
                      } catch (error) {
                        console.error("Failed to reject connection:", error);
                      } finally {
                        setRejectingUsers((prev) => ({
                          ...prev,
                          [userId]: false,
                        }));
                      }
                    }}
                  >
                    {rejectingUsers[request.requester.properties.id]
                      ? "Rejecting..."
                      : rejectedUsers[request.requester.properties.id]
                        ? "Rejected"
                        : "Reject"}
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
  );
}
