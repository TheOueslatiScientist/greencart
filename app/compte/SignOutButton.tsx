"use client";

import { Button } from "@/components/ui/Button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-brand-red hover:bg-red-50"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOut size={14} />
    </Button>
  );
}
