import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Wallet, Calendar } from "lucide-react";

import { apiFetch } from "@/lib/api";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { AddAccountDialog } from "@/components/dialogs/AddAccountDialog";
import { DashboardSummaryCard } from "@/components/DashboardSummaryCard";

import { txStore, inr } from "@/lib/store";

import type { Transaction, Account } from "@/lib/store";

import { useAuthGuard } from "@/hooks/useAuthGuard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — FinFlow Pro" },
      {
        name: "description",
        content: "All your accounts and total balance at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const ready = useAuthGuard();

  const [tick, setTick] = useState(0);

  const [accounts, setAccounts] =
    useState<Account[]>([]);

  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`
  );

  useEffect(() => {
    async function loadAccounts() {
      try {
        const data = await apiFetch(
          "/api/accounts"
        );

        const formatted =
          data.map((account: any) => ({
            id: account._id,
            userId: account.userId,
            name: account.name,
            balance: account.balance,
            createdAt:
              account.createdAt,
          }));

        setAccounts(formatted);
      } catch (error) {
        console.log(error);
      }
    }

    loadAccounts();
  }, [tick]);

  const total = accounts.reduce(
    (sum, account) => {
      return sum + account.balance;
    },
    0
  );

  const allTransactions: Transaction[] =
    useMemo(() => {
      return accounts.flatMap(
        (account) => {
          return txStore.list(
            account.id
          );
        }
      );
    }, [accounts]);

  const filteredTransactions =
    allTransactions.filter(
      (transaction) => {
        const txDate = new Date(
          transaction.date
        );

        const txMonth = `${txDate.getFullYear()}-${String(
          txDate.getMonth() + 1
        ).padStart(2, "0")}`;

        return (
          txMonth === selectedMonth
        );
      }
    );

  const totalSpent =
    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          "expense"
      )
      .reduce(
        (sum, transaction) => {
          return (
            sum +
            transaction.amount
          );
        },
        0
      );

  if (!ready) return null;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <motion.section
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="glass rounded-3xl p-8 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Total Balance
              </div>

              <div className="text-5xl font-bold mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {inr(total)}
              </div>

              <div className="text-sm text-muted-foreground mt-2">
                Across {accounts.length}{" "}
                {accounts.length === 1
                  ? "account"
                  : "accounts"}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="glass rounded-2xl px-4 py-3 min-w-[220px]">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="size-4" />
                  Select Month
                </div>

                <div className="flex gap-2">
                  <select
                    value={
                      selectedMonth.split(
                        "-"
                      )[1]
                    }
                    onChange={(e) => {
                      const year =
                        selectedMonth.split(
                          "-"
                        )[0];

                      setSelectedMonth(
                        `${year}-${e.target.value}`
                      );
                    }}
                    className="bg-black/40 text-white rounded-xl px-3 py-2 outline-none text-sm border border-white/10 appearance-none"
                  >
                    <option value="01">
                      Jan
                    </option>
                    <option value="02">
                      Feb
                    </option>
                    <option value="03">
                      Mar
                    </option>
                    <option value="04">
                      Apr
                    </option>
                    <option value="05">
                      May
                    </option>
                    <option value="06">
                      Jun
                    </option>
                    <option value="07">
                      Jul
                    </option>
                    <option value="08">
                      Aug
                    </option>
                    <option value="09">
                      Sep
                    </option>
                    <option value="10">
                      Oct
                    </option>
                    <option value="11">
                      Nov
                    </option>
                    <option value="12">
                      Dec
                    </option>
                  </select>

                  <select
                    value={
                      selectedMonth.split(
                        "-"
                      )[0]
                    }
                    onChange={(e) => {
                      const month =
                        selectedMonth.split(
                          "-"
                        )[1];

                      setSelectedMonth(
                        `${e.target.value}-${month}`
                      );
                    }}
                    className="bg-black/40 text-white rounded-xl px-3 py-2 outline-none text-sm border border-white/10 appearance-none"
                  >
                    {Array.from(
                      {
                        length: 15,
                      },
                      (_, i) => {
                        const year =
                          2020 + i;

                        return (
                          <option
                            key={
                              year
                            }
                            value={
                              year
                            }
                          >
                            {year}
                          </option>
                        );
                      }
                    )}
                  </select>
                </div>
              </div>

              <AddAccountDialog
                onCreated={() =>
                  setTick(
                    (t) => t + 1
                  )
                }
                trigger={
                  <Button size="lg">
                    <Plus className="size-4" />
                    Add Account
                  </Button>
                }
              />
            </div>
          </div>
        </motion.section>

        <p className="text-sm text-muted-foreground mb-8 px-1">
          Month selection updates only spending analytics and reports.
          Current account balances always remain live and unchanged.
        </p>

        <h2 className="text-lg font-semibold mb-4">
          Accounts
        </h2>

        {accounts.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Wallet className="size-10 mx-auto text-muted-foreground" />

            <p className="mt-4 text-muted-foreground">
              No accounts yet.
              Add your first to
              start tracking.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {accounts.map(
              (
                account,
                index
              ) => {
                const spent =
                  filteredTransactions
                    .filter(
                      (
                        transaction
                      ) => {
                        return (
                          transaction.type ===
                            "expense" &&
                          transaction.accountId ===
                            account.id
                        );
                      }
                    )
                    .reduce(
                      (
                        sum,
                        transaction
                      ) => {
                        return (
                          sum +
                          transaction.amount
                        );
                      },
                      0
                    );

                return (
                  <div
                    key={
                      account.id
                    }
                    className="space-y-3"
                  >
                    <DashboardSummaryCard
                      account={
                        account
                      }
                      index={
                        index
                      }
                    />

                    <div className="glass rounded-2xl p-4">
                      <div className="text-sm text-muted-foreground">
                        Spent This Month
                      </div>

                      <div className="text-2xl font-bold text-red-400 mt-1">
                        {inr(
                          spent
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

        <motion.section
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="glass rounded-3xl p-8"
        >
          <div className="text-sm uppercase tracking-wider text-muted-foreground">
            Total Spending This Month
          </div>

          <div className="text-4xl font-bold mt-3 text-red-400">
            {inr(totalSpent)}
          </div>

          <div className="text-sm text-muted-foreground mt-2">
            Based on expenses recorded in selected month
          </div>
        </motion.section>
      </main>
    </div>
  );
}