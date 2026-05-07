import { createFileRoute, Link } from "@tanstack/react-router";

import {
  useState,
  useMemo,
  useEffect,
} from "react";

import { motion } from "framer-motion";

import {
  ArrowLeft,
  Plus,
  Download,
  Wallet,
  TrendingDown,
} from "lucide-react";

import { Header } from "@/components/Header";

import { Button } from "@/components/ui/button";

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

import {
  txStore,
  inr,
  CATEGORIES,
} from "@/lib/store";

import type {
  Transaction,
  Account,
} from "@/lib/store";

import { apiFetch } from "@/lib/api";

import { useAuthGuard } from "@/hooks/useAuthGuard";

export const Route =
  createFileRoute(
    "/account/$id"
  )({
    head: () => ({
      meta: [
        {
          title:
            "Account — FinFlow Pro",
        },
      ],
    }),

    component: AccountPage,
  });

type Sort =
  | "newest"
  | "oldest"
  | "high"
  | "low";

function AccountPage() {
  const ready =
    useAuthGuard();

  const { id } =
    Route.useParams();

  const [tick, setTick] =
    useState(0);

  const refresh = () =>
    setTick((t) => t + 1);

  const [account, setAccount] =
    useState<Account | null>(
      null
    );

  useEffect(() => {
    async function loadAccount() {
      try {
        const accounts =
          await apiFetch(
            "/api/accounts"
          );

        const found =
          accounts.find(
            (a: any) =>
              a._id === id
          );

        if (!found) return;

        setAccount({
          id: found._id,
          userId:
            found.userId,
          name: found.name,
          balance:
            found.balance,
          createdAt:
            found.createdAt,
        });
      } catch (error) {
        console.log(error);
      }
    }

   loadAccount();

const interval =
  setInterval(
    loadAccount,
    1000
  );

return () =>
  clearInterval(interval);
}, [id, tick]);

  const [txs, setTxs] =
  useState<Transaction[]>(
    []
  );

useEffect(() => {
  async function loadTxs() {
    try {
      const data =
        await apiFetch(
          `/api/transactions/${id}`
        );

      const formatted =
        data.map((t: any) => ({
          id: t._id,

          accountId:
            t.accountId,

          amount:
            t.amount,

          category:
            t.category,

          type: t.type,

          mode: t.mode,

          note: t.note,

          date: t.date,
        }));

      setTxs(formatted);
    } catch (error) {
      console.log(error);
    }
  }

  loadTxs();

  const interval =
    setInterval(
      loadTxs,
      1000
    );

  return () =>
    clearInterval(interval);
}, [id, tick]);

  const [cat, setCat] =
    useState<string>("all");

  const currentDate =
    new Date();

  const [month, setMonth] =
    useState(
      `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() +
          1
      ).padStart(2, "0")}`
    );

  const [sort, setSort] =
    useState<Sort>(
      "newest"
    );

  const filtered = useMemo(() => {
    let r = txs.slice();

    if (cat !== "all") {
      r = r.filter(
        (t) =>
          t.category === cat
      );
    }

    if (month) {
      const [year, mon] =
        month.split("-");

      r = r.filter((t) => {
        const d = new Date(
          t.date
        );

        return (
          d
            .getFullYear()
            .toString() ===
            year &&
          String(
            d.getMonth() + 1
          ).padStart(2, "0") ===
            mon
        );
      });
    }

    r.sort((a, b) => {
      if (sort === "newest") {
        return (
          +new Date(
            b.date
          ) -
          +new Date(a.date)
        );
      }

      if (sort === "oldest") {
        return (
          +new Date(
            a.date
          ) -
          +new Date(b.date)
        );
      }

      if (sort === "high") {
        return (
          b.amount -
          a.amount
        );
      }

      return (
        a.amount - b.amount
      );
    });

    return r;
  }, [txs, cat, month, sort]);

  const totalSpend =
    filtered
      .filter(
        (t) =>
          t.type ===
          "expense"
      )
      .reduce((s, t) => {
        return s + t.amount;
      }, 0);

  if (!ready) return null;

  if (!account) {
    return (
      <div className="min-h-screen">
        <Header />

        <main className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-muted-foreground">
            Account not found.
          </p>

          <Link
            to="/"
            className="text-primary hover:underline"
          >
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
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="grid lg:grid-cols-3 gap-4 mb-8"
        >
          <div className="glass rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {account.name}
                </div>

                <div className="text-4xl font-bold mt-2">
                  {inr(
                    account.balance
                  )}
                </div>

                <div className="text-sm text-muted-foreground mt-1">
                  Current Balance
                </div>
              </div>

              <Wallet className="size-8 text-primary" />
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <AddBalanceDialog
                accountId={id}
                onDone={refresh}
                trigger={
                  <Button>
                    <Plus className="size-4" />
                    Add Balance
                  </Button>
                }
              />

              <AddTransactionDialog
                accountId={id}
                onDone={refresh}
                trigger={
                  <Button variant="secondary">
                    <Plus className="size-4" />
                    Add Transaction
                  </Button>
                }
              />

              <DownloadReportDialog
                account={account}
                txs={filtered}
                trigger={
                  <Button variant="outline">
                    <Download className="size-4" />
                    Download Report
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

            <div className="text-3xl font-bold mt-2">
              {inr(totalSpend)}
            </div>

            <div className="text-sm text-muted-foreground mt-1">
              {
                filtered.filter(
                  (t) =>
                    t.type ===
                    "expense"
                ).length
              }{" "}
              expenses in selected month
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CategoryBreakdownCard
              txs={filtered}
            />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-4 grid sm:grid-cols-3 gap-3">
              <Select
                value={cat}
                onValueChange={setCat}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">
                    All Categories
                  </SelectItem>

                  {CATEGORIES.map(
                    (c) => (
                      <SelectItem
                        key={c}
                        value={c}
                      >
                        {c}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={
                    month.split(
                      "-"
                    )[1]
                  }
                  onValueChange={(m) => {
                    const year =
                      month.split(
                        "-"
                      )[0];

                    setMonth(
                      `${year}-${m}`
                    );
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="01">
                      January
                    </SelectItem>

                    <SelectItem value="02">
                      February
                    </SelectItem>

                    <SelectItem value="03">
                      March
                    </SelectItem>

                    <SelectItem value="04">
                      April
                    </SelectItem>

                    <SelectItem value="05">
                      May
                    </SelectItem>

                    <SelectItem value="06">
                      June
                    </SelectItem>

                    <SelectItem value="07">
                      July
                    </SelectItem>

                    <SelectItem value="08">
                      August
                    </SelectItem>

                    <SelectItem value="09">
                      September
                    </SelectItem>

                    <SelectItem value="10">
                      October
                    </SelectItem>

                    <SelectItem value="11">
                      November
                    </SelectItem>

                    <SelectItem value="12">
                      December
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={
                    month.split(
                      "-"
                    )[0]
                  }
                  onValueChange={(y) => {
                    const m =
                      month.split(
                        "-"
                      )[1];

                    setMonth(
                      `${y}-${m}`
                    );
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="2023">
                      2023
                    </SelectItem>

                    <SelectItem value="2024">
                      2024
                    </SelectItem>

                    <SelectItem value="2025">
                      2025
                    </SelectItem>

                    <SelectItem value="2026">
                      2026
                    </SelectItem>

                    <SelectItem value="2027">
                      2027
                    </SelectItem>

                    <SelectItem value="2028">
                      2028
                    </SelectItem>

                    <SelectItem value="2029">
                      2029
                    </SelectItem>

                    <SelectItem value="2030">
                      2030
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select
                value={sort}
                onValueChange={(v) =>
                  setSort(
                    v as Sort
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="newest">
                    Newest First
                  </SelectItem>

                  <SelectItem value="oldest">
                    Oldest First
                  </SelectItem>

                  <SelectItem value="high">
                    High → Low
                  </SelectItem>

                  <SelectItem value="low">
                    Low → High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TransactionTable
              txs={filtered}
              onChange={refresh}
            />
          </div>
        </div>
      </main>
    </div>
  );
}