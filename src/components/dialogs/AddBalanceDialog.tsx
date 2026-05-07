import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { accountsStore } from "@/lib/store";

export function AddBalanceDialog({
  accountId,
  trigger,
  onDone,
}: {
  accountId: string;
  trigger: React.ReactNode;
  onDone?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = Number(amount);
    if (!v) return;
    accountsStore.addBalance(accountId, v);
    setAmount("");
    setOpen(false);
    onDone?.();
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="glass">
        <DialogHeader>
          <DialogTitle>Add Balance</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>Amount (₹)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5000"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
