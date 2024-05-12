"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Log } from "./type";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Timestamp } from "./[log]/page.client";

export const columns: ColumnDef<Log>[] = [
  {
    accessorKey: "path",
    header: "Path",
    cell: ({ renderValue, row }) => {
      return (
        <a
          href={`/projects/${row.original.projectId}/${row.original.id}`}
          target="_blank"
        >
          {renderValue() as string}
        </a>
      );
    },
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ renderValue }) => {
      const method = renderValue() as string;
      return (
        <Badge
          className={cn("text-white", {
            "bg-blue-500": method === "GET",
            "bg-green-500": method === "POST",
            "bg-yellow-500": method === "PATCH",
            "bg-red-500": method === "DELETE",
            "bg-gray-500": method === "OPTIONS",
            "bg-purple-500": method === "PUT",
          })}
          variant="outline"
        >
          {method}
        </Badge>
      );
    },
  },
  {
    accessorKey: "statusCode",
    header: "StatusCode",
    cell: ({ renderValue }) => {
      const code = renderValue() as number;
      return (
        <Badge
          className={cn("text-white", {
            "bg-blue-500": code >= 100 && code < 200,
            "bg-green-500": code >= 200 && code < 300,
            "bg-red-500": code >= 500,
            "bg-purple-500": code >= 300 && code < 300,
            "bg-yellow-500": code >= 400 && code < 500,
          })}
          variant="outline"
        >
          {code}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Timestamp",
    cell: ({ renderValue, row }) => {
      return <Timestamp t={row.original.createdAt} />;
    },
  },
];
