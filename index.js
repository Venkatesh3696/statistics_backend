const express = require("express");
const axios = require("axios");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./config/database.js");
const transactionsRoute = require("./routes/transactions.route.js");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/transactions", transactionsRoute);

app.get("/", (req, res) => {
  res.send("welcome to roxiler systems");
});

const fetchAndPopulateTransactions = async () => {
  const url = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
  const data = (await axios.get(url)).data;

  if (data) {
    for (let item of data) {
      const query = `
   INSERT INTO transactions ( title, price, description, category, image, sold, dateOfSale)
   VALUES (
       '${item.title.replace(/'/g, "''")}',
       ${item.price},
       '${item.description.replace(/'/g, "''")}',
       '${item.category.replace(/'/g, "''")}',
       '${item.image.replace(/'/g, "''")}',
       ${item.sold},
       '${item.dateOfSale.replace(/'/g, "''")}'
   ); `;

      await db.run(query);
    }

    console.log("Transactions table populated successfully!");
  }
};

db.get("SELECT COUNT(*) AS count FROM transactions", (err, rows) => {
  if (rows.count < 1) {
    // Create the table if it doesn't exist
    fetchAndPopulateTransactions().catch(console.error); // Call on startup
  }
});

app.listen(5000, () => {
  console.log(`app is listening at port 5000`);
});
