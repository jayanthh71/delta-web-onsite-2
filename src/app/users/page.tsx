"use client";

import { useState } from "react";

export default function Users() {
  const [userQuery, setUserQuery] = useState("");

  const handleSubmit = () => {
    // query db
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
          className="w-32 rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 active:bg-blue-800"
          type="submit"
        >
          Search
        </button>
      </form>
    </div>
  );
}
