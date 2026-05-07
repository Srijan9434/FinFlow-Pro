const express = require("express");

const Account = require("../models/Account");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router = express.Router();


// CREATE ACCOUNT
router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const { name, balance } =
        req.body;

      const account =
        await Account.create({
          userId: req.userId,

          name,

          balance,
        });

      res.status(201).json(
        account
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


// GET USER ACCOUNTS
router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const accounts =
        await Account.find({
          userId: req.userId,
        });

      res.json(accounts);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  }
);


// ADD BALANCE
router.patch(
  "/:id/balance",
  authMiddleware,
  async (req, res) => {
    try {
      const { amount } =
        req.body;

      const account =
        await Account.findById(
          req.params.id
        );

      if (!account) {
        return res
          .status(404)
          .json({
            message:
              "Account not found",
          });
      }

      account.balance +=
        Number(amount);

      await account.save();

      res.json(account);
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