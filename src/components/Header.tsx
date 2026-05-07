import { Link, useNavigate } from "@tanstack/react-router";
import { auth } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogOut, Wallet } from "lucide-react";

export function Header() {
  const navigate = useNavigate();
  const user = auth.user();
  return (
    <header className="sticky top-0 z-30 glass border-b">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="grid place-items-center size-9 rounded-xl bg-primary text-primary-foreground">
            <Wallet className="size-5" />
          </span>
          <span className="text-lg">
            FinFlow <span className="text-primary">Pro</span>
          </span>
        </Link>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                auth.logout();
                navigate({ to: "/auth" });
              }}
            >
              <LogOut className="size-4" /> Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
