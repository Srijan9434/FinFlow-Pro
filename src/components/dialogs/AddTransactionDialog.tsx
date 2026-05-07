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
  CATEGORIES,
  PAYMENT_MODES,
  txStore,
  type TxType,
  type PaymentMode,
} from "@/lib/store";

import { apiFetch } from "@/lib/api";

export function AddTransactionDialog({
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

  const [category, setCategory] =
    useState<string>("Food");

  const [customCat, setCustomCat] =
    useState("");

  const [type, setType] =
    useState<TxType>("expense");

  const [mode, setMode] =
    useState<PaymentMode>("UPI");

  const [date, setDate] =
    useState(
      new Date()
        .toISOString()
        .slice(0, 10)
    );

  const [note, setNote] =
    useState("");

  async function submit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const v = Number(amount);

    if (!v) return;

    const cat =
      category === "__custom"
        ? customCat.trim() ||
          "Misc"
        : category;

    try {
      await apiFetch(
        "/api/transactions",
        {
          method: "POST",

          body: JSON.stringify({
            accountId,

            amount: v,

            category: cat,

            type,

            mode,

            date,

            note,
          }),
        }
      );

      txStore.add({
        accountId,

        amount: v,

        category: cat,

        type,

        mode,

        date,

        note,
      });

      setAmount("");

      setCustomCat("");

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
            Add Transaction
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={submit}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
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
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>

              <Select
                value={type}
                onValueChange={(v) =>
                  setType(
                    v as TxType
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="expense">
                    Expense
                  </SelectItem>

                  <SelectItem value="income">
                    Income
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Category
            </Label>

            <Select
              value={category}
              onValueChange={
                setCategory
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
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

                <SelectItem value="__custom">
                  + Custom...
                </SelectItem>
              </SelectContent>
            </Select>

            {category ===
              "__custom" && (
              <Input
                placeholder="Custom category"
                value={
                  customCat
                }
                onChange={(e) =>
                  setCustomCat(
                    e.target
                      .value
                  )
                }
              />
            )}
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Date</Label>

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
              <Label>Note</Label>

              <Input
                value={note}
                onChange={(e) =>
                  setNote(
                    e.target.value
                  )
                }
                placeholder="Optional"
              />
            </div>
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