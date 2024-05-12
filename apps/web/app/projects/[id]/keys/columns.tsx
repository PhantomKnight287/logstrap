"use client";

import { ColumnDef } from "@tanstack/react-table";
import { APIKey } from "./type";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Timestamp } from "../[log]/page.client";

export const columns: ColumnDef<APIKey>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "key",
    header: "Key",
    cell: ({ renderValue }) => {
      return <PasswordView password={renderValue() as string} />;
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

function PasswordView({ password }: { password: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <button onClick={() => setVisible((o) => !o)}>
        {password.substring(0, 4)}
        <span
          className={cn({
            "blur-sm": !visible,
          })}
        >
          {password.substring(4)}
        </span>
      </button>
    </div>
  );
}
