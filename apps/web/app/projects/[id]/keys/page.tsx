import { API_URL, COOKIE_NAME } from "@/constants";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { DataTable } from "../data-table";
import { columns } from "./columns";
import { ApiUsage, CreateAPIKeyModal } from "./page.client";

async function ApiKeys({ params }: { params: { id: string } }) {
  const cookiesStore = cookies();
  const token = cookiesStore.get(COOKIE_NAME);
  if (!token?.value) return redirect("/login");

  const req = await fetch(`${API_URL}/api-keys/${params.id}`, {
    headers: {
      authorization: `Bearer ${token.value}`,
    },
  });
  const data: {
    id: string;
    key: string;
    createdAt: string;
    name: string;
  }[] = await req.json();

  if (!req.ok) {
    console.log(data);
    return notFound();
  }
  return (
    <div className="container">
      <div className="flex flex-row">
        <h1 className="text-2xl font-bold">Api Keys</h1>

        <CreateAPIKeyModal projectId={params.id} />
        {/* <ApiUsage
        
        /> */}
      </div>
      <div className="my-5 px-auto">
        <DataTable filterName="name" columns={columns} data={data} />
      </div>
    </div>
  );
}

export default ApiKeys;
