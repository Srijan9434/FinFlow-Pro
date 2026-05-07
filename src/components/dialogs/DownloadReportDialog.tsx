import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  CATEGORIES,
  type Account,
  type Transaction,
} from "@/lib/store";

export function DownloadReportDialog({
  account,
  txs,
  trigger,
}: {
  account: Account;
  txs: Transaction[];
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  function generate() {
    const doc = new jsPDF();

    const expenses = txs.filter(
      (t) => t.type === "expense"
    );

    const total = expenses.reduce((s, t) => {
      return s + t.amount;
    }, 0);

    const incomeTotal = txs
      .filter((t) => t.type === "income")
      .reduce((s, t) => {
        return s + t.amount;
      }, 0);

    const byCat = new Map<string, number>();

    for (const c of CATEGORIES) {
      byCat.set(c, 0);
    }

    for (const t of expenses) {
      byCat.set(
        t.category,
        (byCat.get(t.category) ?? 0) +
          t.amount
      );
    }

    const reportMonth =
      txs.length > 0
        ? new Date(
            txs[0].date
          ).toLocaleString("en-IN", {
            month: "long",
            year: "numeric",
          })
        : "Custom Period";

    // Header
    doc.setFontSize(22);

    doc.setFont("helvetica", "bold");

    doc.text(
      "FinFlow Pro Report",
      14,
      20
    );

    doc.setFontSize(11);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setTextColor(110);

    doc.text(
      `Report Month: ${reportMonth}`,
      14,
      27
    );

    doc.text(
      `Generated on ${new Date().toLocaleString(
        "en-IN"
      )}`,
      14,
      34
    );

    // Summary
    doc.setTextColor(0);

    doc.setFontSize(13);

    doc.setFont("helvetica", "bold");

    doc.text(
      "Account Summary",
      14,
      48
    );

    doc.setFontSize(11);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      `Account Name: ${account.name}`,
      14,
      56
    );

    doc.text(
      `Current Balance: Rs. ${account.balance.toLocaleString(
        "en-IN"
      )}`,
      14,
      63
    );

    doc.text(
      `Total Income: Rs. ${incomeTotal.toLocaleString(
        "en-IN"
      )}`,
      14,
      70
    );

    doc.text(
      `Total Spending: Rs. ${total.toLocaleString(
        "en-IN"
      )}`,
      14,
      77
    );

    // Category Breakdown
    doc.setFontSize(13);

    doc.setFont("helvetica", "bold");

    doc.text(
      "Category Breakdown",
      14,
      90
    );

    autoTable(doc, {
      startY: 95,

      head: [
        ["Category", "Amount (Rs.)"],
      ],

      body: Array.from(
        byCat.entries()
      )
        .filter(
          ([, value]) => value > 0
        )
        .map(
          ([category, value]) => [
            category,
            value.toLocaleString(
              "en-IN"
            ),
          ]
        ),

      theme: "striped",

      headStyles: {
        fillColor: [40, 50, 70],
      },
    });

    // Transactions
    const afterY =
      (
        doc as unknown as {
          lastAutoTable: {
            finalY: number;
          };
        }
      ).lastAutoTable.finalY + 12;

    doc.setFontSize(13);

    doc.setFont("helvetica", "bold");

    doc.text(
      "Transactions",
      14,
      afterY
    );

    autoTable(doc, {
      startY: afterY + 5,

      head: [
        [
          "Date",
          "Category",
          "Type",
          "Mode",
          "Amount (Rs.)",
          "Note",
        ],
      ],

      body: txs
        .slice()
        .sort(
          (a, b) =>
            +new Date(b.date) -
            +new Date(a.date)
        )
        .map((t) => [
          new Date(
            t.date
          ).toLocaleDateString(
            "en-IN"
          ),

          t.category,

          t.type,

          t.mode || "-",

          `${
            t.type === "income"
              ? "+"
              : "-"
          }${t.amount.toLocaleString(
            "en-IN"
          )}`,

          t.note || "-",
        ]),

      theme: "striped",

      headStyles: {
        fillColor: [40, 50, 70],
      },

      styles: {
        fontSize: 9,
      },
    });

    doc.save(
      `FinFlow-${account.name.replace(
        /\s+/g,
        "_"
      )}.pdf`
    );

    setOpen(false);
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
            Download Report
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Generate a professional PDF
          report for{" "}
          <span className="font-medium text-foreground">
            {account.name}
          </span>{" "}
          including balances,
          category analytics,
          payment modes, notes,
          income history, and
          transaction records.
        </p>

        <DialogFooter>
          <Button onClick={generate}>
            Generate PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}