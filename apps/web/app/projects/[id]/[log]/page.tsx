import { API_URL, COOKIE_NAME } from "@/constants";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Log } from "../type";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import LogInfoPage from "./page.client";
import { Callout } from "@/components/callout";

async function LogInfo({ params }: { params: { id: string; log: string } }) {
  const cookiesStore = cookies();
  const token = cookiesStore.get(COOKIE_NAME);
  if (!token?.value) return redirect("/login");

  const req = await fetch(`${API_URL}/logs/${params.id}/${params.log}`, {
    headers: {
      authorization: `Bearer ${token.value}`,
    },
    cache: "force-cache",
  });
  const body = (await req.json()) as Log;
  if (!req.ok) return notFound();
  return (
    <div className="container mb-5">
      <h1 className="text-2xl font-bold line-clamp-1">
        {body.method} {body.path}
      </h1>
      <div className="mt-2 flex items-center flex-row gap-4 text-base flex-wrap justify-center md:justify-start">
        <div className="flex flex-col items-center h-full justify-between">
          <span className="text-muted-foreground ">Created</span>
          <span className="text-sm">
            {dayjs(body.createdAt).format("DD/MM/YY HH:mm")}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-muted-foreground ">Method</span>
          <span className="text-sm ">{body.method}</span>
        </div>
        {body.statusCode ? (
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground ">Status</span>
            <Badge
              className={cn("text-white", {
                "bg-blue-500": body.statusCode >= 100 && body.statusCode < 200,
                "bg-green-500": body.statusCode >= 200 && body.statusCode < 300,
                "bg-red-500": body.statusCode >= 500,
                "bg-purple-500":
                  body.statusCode >= 300 && body.statusCode < 300,
                "bg-yellow-500":
                  body.statusCode >= 400 && body.statusCode < 500,
              })}
              variant="outline"
            >
              {body.statusCode}
            </Badge>
          </div>
        ) : null}
        <div className="flex flex-col items-center">
          <span className="text-muted-foreground ">Log Id</span>
          <Badge className="text-sm" variant={"secondary"}>
            {body.id}
          </Badge>
        </div>
      </div>
      {body.message ? (
        <Callout title={"Error"} type="error">
          {body.message}
        </Callout>
      ) : null}
      <LogInfoPage data={body} />
    </div>
  );
}

export default LogInfo;
