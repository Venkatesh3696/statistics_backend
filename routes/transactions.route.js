const express = require("express");
const {
  getAllTransactions,
  getTransaction,
  getMonthTransactions,
  getPriceRanges,
  getCategoryCount,
} = require("../controllers/transactions.controller");

const router = express.Router();

router.get("/", getAllTransactions);
router.get("/months/:month", getMonthTransactions);
router.get("/get-price-ranges/:month", getPriceRanges);
router.get("/get-category/:month", getCategoryCount);

router.get("/:id", getTransaction);

module.exports = router;
