import { motion } from "framer-motion";
import { CATEGORIES, inr, type Transaction } from "@/lib/store";

export function CategoryBreakdownCard({ txs }: { txs: Transaction[] }) {
  const expenses = txs.filter((t) => t.type === "expense");
  const total = expenses.reduce((s, t) => s + t.amount, 0);
  const byCat = new Map<string, number>();
  for (const c of CATEGORIES) byCat.set(c, 0);
  for (const t of expenses) byCat.set(t.category, (byCat.get(t.category) ?? 0) + t.amount);

  const entries = Array.from(byCat.entries()).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map((e) => e[1]), 1);

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="font-semibold">Category Breakdown</h3>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Total Spending</div>
          <div className="text-xl font-bold">{inr(total)}</div>
        </div>
      </div>
      <div className="space-y-3">
        {entries.map(([cat, val], i) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="flex justify-between text-sm mb-1">
              <span>{cat}</span>
              <span className="font-medium">{inr(val)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${(val / max) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.04 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
