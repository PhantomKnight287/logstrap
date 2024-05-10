"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CopyToClipboard({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (error) {
      toast.error("Error copying to clipboard");
    } finally {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <>
      {copied === false ? (
        <button onClick={copyToClipboard}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#fff"
            viewBox="0 0 256 256"
          >
            <path d="M216,40V168H168V88H88V40Z" opacity="0.2"></path>
            <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>
          </svg>
        </button>
      ) : (
        <Check className="text-green-500" />
      )}
    </>
  );
}
