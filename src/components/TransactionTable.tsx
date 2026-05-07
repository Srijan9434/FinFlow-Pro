import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  inr,
  txStore,
  type Transaction,
} from "@/lib/store";

export function TransactionTable({
  txs,
  onChange,
}: {
  txs: Transaction[];

  onChange: () => void;
}) {
  if (!txs.length) {
    return (
      <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1.2fr_1fr_0.8fr_1fr_1.4fr_1fr_50px] px-5 py-4 text-xs uppercase tracking-wider text-muted-foreground border-b">
        <div>Date</div>

        <div>Category</div>

        <div>Type</div>

        <div>Mode</div>

        <div className="pl-3">
          Note
        </div>

        <div className="text-right">
          Amount
        </div>

        <div></div>
      </div>

      {/* Rows */}
      <AnimatePresence initial={false}>
        {txs.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              x: -20,
            }}
            transition={{
              delay:
                i * 0.02,
            }}
            className="grid grid-cols-[1.2fr_1fr_0.8fr_1fr_1.4fr_1fr_50px] items-center px-5 py-4 border-b last:border-0 hover:bg-secondary/30"
          >
            {/* Date */}
            <div className="text-sm font-medium">
              {new Date(
                t.date
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",

                  month:
                    "short",

                  year:
                    "numeric",
                }
              )}
            </div>

            {/* Category */}
            <div>
              <span className="px-3 py-1 rounded-full bg-secondary text-xs whitespace-nowrap">
                {t.category}
              </span>
            </div>

            {/* Type */}
            <div>
              <span
                className={`text-xs font-semibold capitalize ${
                  t.type ===
                  "income"
                    ? "text-primary"
                    : "text-accent"
                }`}
              >
                {t.type}
              </span>
            </div>

            {/* Payment Mode */}
            <div>
              <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-lg whitespace-nowrap">
                {t.mode || "—"}
              </span>
            </div>

            {/* Note */}
            <div className="text-sm text-muted-foreground truncate pl-3 pr-3">
              {t.note?.trim()
                ? t.note
                : "—"}
            </div>

            {/* Amount */}
            <div
              className={`text-right font-bold ${
                t.type ===
                "income"
                  ? "text-primary"
                  : "text-white"
              }`}
            >
              {t.type ===
              "income"
                ? "+"
                : "-"}

              {inr(
                t.amount
              )}
            </div>

            {/* Delete */}
            <div className="flex justify-end">
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-destructive/10"
                onClick={async () => {
                  try {
                    await fetch(
                      `${import.meta.env.VITE_API_URL}/api/transactions/${t.id}`,
                      {
                        method:
                          "DELETE",

                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      }
                    );

                    txStore.remove(
                      t.id
                    );

                    onChange();
                  } catch (
                    error
                  ) {
                    console.log(
                      error
                    );
                  }
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}