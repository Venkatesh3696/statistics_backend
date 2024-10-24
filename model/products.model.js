const db = require("../config/database");
const { route } = require("../routes/transactions.route");

const getAllTransactions = async () => {
  const results = await db.all("SELECT * FROM transactions", (err, rows) => {
    if (err) {
      console.log(err.message);
    }
    console.log("rows", rows);
  });
  return rows;
};

const getProductById = async (id) => {
  const result = await db.get("SELECT * FROM products WHERE id = ?", [id]);
  return result;
};

module.exports = { getAllTransactions, getProductById };
