import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { inr, txStore, type Transaction } from "@/lib/store";

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
      <div className="grid grid-cols-12 px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground border-b">
        <div className="col-span-3">Date</div>
        <div className="col-span-3">Category</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-3 text-right">Amount</div>
        <div className="col-span-1"></div>
      </div>
      <AnimatePresence initial={false}>
        {txs.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: i * 0.02 }}
            className="grid grid-cols-12 items-center px-4 py-3 border-b last:border-0 hover:bg-secondary/40"
          >
            <div className="col-span-3 text-sm">
              {new Date(t.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div className="col-span-3">
              <span className="px-2 py-1 rounded-full bg-secondary text-xs">{t.category}</span>
            </div>
            <div className="col-span-2">
              <span
                className={`text-xs font-medium ${
                  t.type === "income" ? "text-primary" : "text-accent"
                }`}
              >
                {t.type}
              </span>
            </div>
            <div
              className={`col-span-3 text-right font-semibold ${
                t.type === "income" ? "text-primary" : ""
              }`}
            >
              {t.type === "income" ? "+" : "-"}
              {inr(t.amount)}
            </div>
            <div className="col-span-1 text-right">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  txStore.remove(t.id);
                  onChange();
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
