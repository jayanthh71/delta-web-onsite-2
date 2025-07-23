"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
    >
      Sign Out
    </button>
  );
}
