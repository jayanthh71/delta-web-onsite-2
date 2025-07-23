import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 font-sans">
      <h1 className="text-4xl font-bold text-blue-600">Linkedin</h1>
      <div className="flex flex-col gap-5">
        <Link
          className="mt-4 w-80 cursor-pointer rounded-xl bg-blue-600 px-5 py-3 text-center font-medium text-white hover:bg-blue-700 active:bg-blue-800"
          href={"/login"}
        >
          Get started
        </Link>
        <Link
          className="w-80 cursor-pointer rounded-xl bg-blue-600 px-5 py-3 text-center font-medium text-white hover:bg-blue-700 active:bg-blue-800"
          href={"/profile"}
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
