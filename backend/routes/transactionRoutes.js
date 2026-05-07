const express = require("express");

const Transaction = require(
  "../models/Transaction"
);

const Account = require(
  "../models/Account"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router = express.Router();


// CREATE TRANSACTION
router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        accountId,
        amount,
        category,
        type,
        mode,
        note,
        date,
      } = req.body;

      const transaction =
        await Transaction.create({
          userId: req.userId,

          accountId,

          amount,

          category,

          type,

          mode,

          note,

          date,
        });

      // UPDATE ACCOUNT BALANCE
      const account =
        await Account.findById(
          accountId
        );

      if (account) {
        if (type === "income") {
          account.balance +=
            amount;
        } else {
          account.balance -=
            amount;
        }

        await account.save();
      }

      res.status(201).json(
        transaction
      );
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  }
);


// GET ACCOUNT TRANSACTIONS
router.get(
  "/:accountId",
  authMiddleware,
  async (req, res) => {
    try {
      const transactions =
        await Transaction.find({
          userId: req.userId,

          accountId:
            req.params.accountId,
        }).sort({
          date: -1,
        });

      res.json(transactions);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  }
);


// DELETE TRANSACTION
router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const transaction =
        await Transaction.findById(
          req.params.id
        );

      if (!transaction) {
        return res
          .status(404)
          .json({
            message:
              "Transaction not found",
          });
      }

      const account =
        await Account.findById(
          transaction.accountId
        );

      if (account) {
        // REVERSE BALANCE
        if (
          transaction.type ===
          "income"
        ) {
          account.balance -=
            transaction.amount;
        } else {
          account.balance +=
            transaction.amount;
        }

        await account.save();
      }

      await transaction.deleteOne();

      res.json({
        message:
          "Transaction deleted",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  }
);

module.exports = router;