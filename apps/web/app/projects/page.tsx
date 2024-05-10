import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { API_URL, COOKIE_NAME } from "@/constants";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { Metadata } from "next";
import { CreateProjectModal } from "./page.client";

dayjs.extend(relativeTime);

export const metadata: Metadata = {
  title: "Projects",
  description: "View your LogsTrap Projects",
};

async function Projects() {
  const cookiesStore = cookies();
  const token = cookiesStore.get(COOKIE_NAME);
  if (!token?.value) return redirect("/login");

  const req = await fetch(`${API_URL}/projects`, {
    headers: {
      authorization: `Bearer ${token.value}`,
    },
  });
  if (!req.ok) return notFound();
  const data: {
    name: string;
    description: null | string;
    createdAt: string;
    id: string;
  }[] = await req.json();

  return (
    <div className="container">
      <div className="flex flex-row">
        <h1 className="text-2xl font-bold">Projects</h1>
        <CreateProjectModal />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-5">
        {data.map((data) => (
          <Link key={data.id} href={`/projects/${data.id}`}>
            <Card>
              <CardHeader>
                <CardTitle>{data.name}</CardTitle>
                <CardDescription>{data.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <p>{dayjs(data.createdAt).fromNow()}</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Projects;
