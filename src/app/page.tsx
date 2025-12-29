import Image from "next/image";
import prisma from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.t_user.findMany();

  return (
    <div className="flex min-h-screen bg-zinc-50 ">
      <main className="">
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.name}
          </li>
        ))}
      </main>
    </div>
  );
}
