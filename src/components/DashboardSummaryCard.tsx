import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { inr, type Account } from "@/lib/store";

export function DashboardSummaryCard({ account, index }: { account: Account; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <Link
        to="/account/$id"
        params={{ id: account.id }}
        className="group block glass rounded-2xl p-6 transition-shadow hover:shadow-2xl hover:shadow-primary/10"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Account</div>
            <div className="text-lg font-semibold mt-1">{account.name}</div>
          </div>
          <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div className="mt-6">
          <div className="text-xs text-muted-foreground">Balance</div>
          <div className="text-3xl font-bold mt-1">{inr(account.balance)}</div>
        </div>
      </Link>
    </motion.div>
  );
}
