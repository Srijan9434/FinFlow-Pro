import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { apiFetch } from "@/lib/api";

export function AddAccountDialog({
  trigger,
  onCreated,
}: {
  trigger: React.ReactNode;

  onCreated?: () => void;
}) {
  const [open, setOpen] =
    useState(false);

  const [name, setName] =
    useState("");

  const [balance, setBalance] =
    useState("");

  async function submit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      await apiFetch(
        "/api/accounts",
        {
          method: "POST",

          body: JSON.stringify({
            name: name.trim(),

            balance:
              Number(balance) || 0,
          }),
        }
      );

      setName("");

      setBalance("");

      setOpen(false);

      onCreated?.();
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
            Add Account
          </DialogTitle>

          <DialogDescription>
            Add your account
            details.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={submit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Name</Label>

            <Input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="HDFC Savings"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Initial Balance (₹)
            </Label>

            <Input
              type="number"
              value={balance}
              onChange={(e) =>
                setBalance(
                  e.target.value
                )
              }
              placeholder="0"
            />
          </div>

          <DialogFooter>
            <Button type="submit">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}