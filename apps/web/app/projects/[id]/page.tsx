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
    grouped: {
      date: string;
      total: string;
      Successful: string;
      Failed: string;
    }[];
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

      <div className="flex flex-row items-start gap-4">
        <div className="flex flex-col items-center">
          <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content mt-2">
            Successful
          </h3>
          <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
            {data.grouped
              .map((data) => Number(data.Successful))
              .reduce((partial, a) => partial + a, 0)}{" "}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content mt-2">
            Failed
          </h3>
          <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
            {data.grouped
              .map((data) => Number(data.Failed))
              .reduce((partial, a) => partial + a, 0)}{" "}
          </p>
        </div>
      </div>

      <Chart data={data.grouped} />
      <Table projectId={params.id} data={data.logs} />
    </div>
  );
}

export default ProjectInfo;

export const metadata: Metadata = {
  title: "Project Info",
  description: "View your project logs",
};
