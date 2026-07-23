import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

import { logoutAction } from "../actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline" className="w-full">
        <LogOut className="size-4" aria-hidden="true" />
        Log out
      </Button>
    </form>
  );
}
