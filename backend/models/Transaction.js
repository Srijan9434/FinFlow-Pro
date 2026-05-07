const mongoose = require("mongoose");

const transactionSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      accountId: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Account",

        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },

      category: {
        type: String,
        required: true,
      },

      type: {
        type: String,

        enum: [
          "income",
          "expense",
        ],

        required: true,
      },

      mode: {
        type: String,

        default: "Cash",
      },

      note: {
        type: String,

        default: "",
      },

      date: {
        type: Date,

        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Transaction",
    transactionSchema
  );