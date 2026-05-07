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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  txStore,
  PAYMENT_MODES,
  type PaymentMode,
} from "@/lib/store";

import { apiFetch } from "@/lib/api";

export function AddBalanceDialog({
  accountId,
  trigger,
  onDone,
}: {
  accountId: string;

  trigger: React.ReactNode;

  onDone?: () => void;
}) {
  const [open, setOpen] =
    useState(false);

  const [amount, setAmount] =
    useState("");

  const [note, setNote] =
    useState("");

  const [mode, setMode] =
    useState<PaymentMode>("UPI");

  const [date, setDate] =
    useState(
      new Date()
        .toISOString()
        .slice(0, 10)
    );

  async function submit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const v = Number(amount);

    if (!v) return;

    try {
      await apiFetch(
        `/api/accounts/${accountId}/balance`,
        {
          method: "PATCH",

          body: JSON.stringify({
            amount: v,
          }),
        }
      );

     await apiFetch(
  "/api/transactions",
  {
    method: "POST",

    body: JSON.stringify({
      accountId,

      amount: v,

      category:
        "Balance Added",

      type: "income",

      mode,

      date,

      note:
        note.trim() ||
        "Balance top-up",
    }),
  }
);

      setAmount("");

      setNote("");

      setOpen(false);

      onDone?.();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>

      <DialogContent className="glass">
        <DialogHeader>
          <DialogTitle>
            Add Balance
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={submit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>
              Amount (₹)
            </Label>

            <Input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              placeholder="5000"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Payment Mode
            </Label>

            <Select
              value={mode}
              onValueChange={(v) =>
                setMode(
                  v as PaymentMode
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {PAYMENT_MODES.map(
                  (mode) => (
                    <SelectItem
                      key={mode}
                      value={mode}
                    >
                      {mode}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Date
            </Label>

            <Input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label>
              Note
            </Label>

            <Input
              value={note}
              onChange={(e) =>
                setNote(
                  e.target.value
                )
              }
              placeholder="Salary deposit, wallet top-up, etc."
            />
          </div>

          <DialogFooter>
            <Button type="submit">
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}