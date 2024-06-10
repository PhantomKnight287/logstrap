import { API_URL, COOKIE_NAME } from "@/constants";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Log } from "./type";
import { Metadata } from "next";
import Chart from "./page.client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import nextDynamic from "next/dynamic";

const Table = nextDynamic(
  () => import("./page.client").then((mod) => mod.Table),
  { ssr: false, loading: () => <p>Loading...</p> }
);

export const dynamic = "force-dynamic";

async function ProjectInfo({ params }: { params: { id: string } }) {
  const cookiesStore = cookies();
  const token = cookiesStore.get(COOKIE_NAME);
  if (!token?.value) return redirect("/login");

  const req = await fetch(`${API_URL}/logs/${params.id}`, {
    headers: {
      authorization: `Bearer ${token.value}`,
    },
  });
  const data: {
    logs: Log[];
  } = await req.json();

  if (!req.ok) {
    console.log(data);
    return notFound();
  }

  return (
    <div className="container">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold">Project Info</h1>

        <Link
          href={`/projects/${params.id}/keys`}
          className={buttonVariants({
            variant: "secondary",
          })}
        >
          Api Keys
        </Link>
      </div>

      <Table projectId={params.id} data={data.logs} />
    </div>
  );
}

export default ProjectInfo;

export const metadata: Metadata = {
  title: "Project Info",
  description: "View your project logs",
};
