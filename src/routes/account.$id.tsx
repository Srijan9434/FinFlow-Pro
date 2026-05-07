import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Download, Wallet, TrendingDown } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddBalanceDialog } from "@/components/dialogs/AddBalanceDialog";
import { AddTransactionDialog } from "@/components/dialogs/AddTransactionDialog";
import { DownloadReportDialog } from "@/components/dialogs/DownloadReportDialog";
import { CategoryBreakdownCard } from "@/components/CategoryBreakdownCard";
import { TransactionTable } from "@/components/TransactionTable";
import { accountsStore, txStore, inr, CATEGORIES } from "@/lib/store";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export const Route = createFileRoute("/account/$id")({
  head: () => ({
    meta: [{ title: "Account — FinFlow Pro" }],
  }),
  component: AccountPage,
});

type Sort = "newest" | "oldest" | "high" | "low";

function AccountPage() {
  const ready = useAuthGuard();
  const { id } = Route.useParams();
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const account = useMemo(() => accountsStore.get(id), [id, tick]);
  const txs = useMemo(() => txStore.list(id), [id, tick]);

  const [cat, setCat] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [month, setMonth] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  const filtered = useMemo(() => {
    let r = txs.slice();
    if (cat !== "all") r = r.filter((t) => t.category === cat);
    if (from) r = r.filter((t) => t.date >= from);
    if (to) r = r.filter((t) => t.date <= to);
    if (month) r = r.filter((t) => t.date.startsWith(month));
    r.sort((a, b) => {
      if (sort === "newest") return +new Date(b.date) - +new Date(a.date);
      if (sort === "oldest") return +new Date(a.date) - +new Date(b.date);
      if (sort === "high") return b.amount - a.amount;
      return a.amount - b.amount;
    });
    return r;
  }, [txs, cat, from, to, month, sort]);

  const totalSpend = txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  if (!ready) return null;
  if (!account) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-muted-foreground">Account not found.</p>
          <Link to="/" className="text-primary hover:underline">
            Back to dashboard
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="size-4" /> Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-4 mb-8"
        >
          <div className="glass rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {account.name}
                </div>
                <div className="text-4xl font-bold mt-2">{inr(account.balance)}</div>
                <div className="text-sm text-muted-foreground mt-1">Current Balance</div>
              </div>
              <Wallet className="size-8 text-primary" />
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              <AddBalanceDialog
                accountId={id}
                onDone={refresh}
                trigger={
                  <Button>
                    <Plus className="size-4" /> Add Balance
                  </Button>
                }
              />
              <AddTransactionDialog
                accountId={id}
                onDone={refresh}
                trigger={
                  <Button variant="secondary">
                    <Plus className="size-4" /> Add Transaction
                  </Button>
                }
              />
              <DownloadReportDialog
                account={account}
                txs={txs}
                trigger={
                  <Button variant="outline">
                    <Download className="size-4" /> Download Report
                  </Button>
                }
              />
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Total Spending
              </div>
              <TrendingDown className="size-5 text-accent" />
            </div>
            <div className="text-3xl font-bold mt-2">{inr(totalSpend)}</div>
            <div className="text-sm text-muted-foreground mt-1">{txs.length} transactions</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CategoryBreakdownCard txs={txs} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <Select value={cat} onValueChange={setCat}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="From" />
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} placeholder="To" />
              <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
              <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="high">High → Low</SelectItem>
                  <SelectItem value="low">Low → High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TransactionTable txs={filtered} onChange={refresh} />
          </div>
        </div>
      </main>
    </div>
  );
}
