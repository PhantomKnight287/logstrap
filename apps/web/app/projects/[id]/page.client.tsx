"use client";

import { AreaChart } from "@tremor/react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { API_URL, COOKIE_NAME } from "@/constants";
import { readCookie } from "@/lib/cookie";
import { Log } from "./type";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Chart({ data }: { data: any }) {
  return (
    <AreaChart
      className="mt-4 h-72"
      data={data}
      index="date"
      yAxisWidth={65}
      categories={["Successful", "Failed"]}
      colors={["green", "red"]}
      showYAxis={false}
      curveType="linear"
      showAnimation
      showGridLines
    />
  );
}

export function Table({ projectId, data }: { projectId: string; data: Log[] }) {
  const [logs, setLogs] = useState(data);
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  async function fetchData(signal: AbortSignal) {
    const req = await fetch(
      `${API_URL}/logs/${projectId}?skip=${logs.length}&take=20`,
      {
        signal,
        headers: {
          authorization: `Bearer ${readCookie(COOKIE_NAME)}`,
        },
      }
    );
    if (!req.ok) return;
    const data = await req.json();
    setLogs((old) => [...old, ...data]);
  }

  useEffect(() => {
    const controller = new AbortController();
    if (inView) {
      fetchData(controller.signal);
    }
    return () => {
      controller.abort();
    };
  }, [inView]);

  return (
    <>
      <div className="mx-auto py-10">
        <DataTable columns={columns} data={logs} />
        <div ref={ref} />
      </div>
    </>
  );
}
