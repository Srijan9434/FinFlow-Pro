import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Wallet } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { AddAccountDialog } from "@/components/dialogs/AddAccountDialog";
import { DashboardSummaryCard } from "@/components/DashboardSummaryCard";
import { accountsStore, inr } from "@/lib/store";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — FinFlow Pro" },
      { name: "description", content: "All your accounts and total balance at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const ready = useAuthGuard();
  const [tick, setTick] = useState(0);
  const accounts = useMemo(() => accountsStore.list(), [tick]);
  const total = accounts.reduce((s, a) => s + a.balance, 0);
  if (!ready) return null;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Total Balance</div>
            <div className="text-5xl font-bold mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {inr(total)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Across {accounts.length} {accounts.length === 1 ? "account" : "accounts"}
            </div>
          </div>
          <AddAccountDialog
            onCreated={() => setTick((t) => t + 1)}
            trigger={
              <Button size="lg">
                <Plus className="size-4" /> Add Account
              </Button>
            }
          />
        </motion.section>

        <h2 className="text-lg font-semibold mb-4">Accounts</h2>
        {accounts.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Wallet className="size-10 mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              No accounts yet. Add your first to start tracking.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((a, i) => (
              <DashboardSummaryCard key={a.id} account={a} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
