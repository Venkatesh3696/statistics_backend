const db = require("../config/database");

// GET transactions
const getAllTransactions = async (req, res) => {
  var total = 0;
  const rows = await new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) AS total FROM transactions", (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });

  total = rows.total;
  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 10);
  const search = req.query.search || "";
  const month = req.query.month || "03";
  const offset = (page - 1) * limit;

  const getAllTransactionsQuery = `SELECT * FROM transactions WHERE title LIKE '%${search}%' AND strftime('%m', dateOfSale) = '${month}' LIMIT ${limit} OFFSET ${offset} `;
  const lastPage = Math.ceil(total / limit);

  const data = await new Promise((resolve, reject) => {
    db.all(getAllTransactionsQuery, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
  res.send({
    total: total.total,
    current_page: page,
    per_page: limit,
    last_page: lastPage,
    data,
  });
};

const getTransaction = async (req, res) => {
  const { id } = req.params;
  const query = ` SELECT * FROM transactions WHERE id LIKE '${id}'`;
  const data = await new Promise((resolve, reject) => {
    db.get(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
      console.log(rows);
    });
  });
  // console.log(data);
  res.send({
    data,
  });
};

const getMonthTransactions = async (req, res) => {
  const { month } = req.params;
  // console.log("month", month);

  const query = `
    SELECT
    SUM(price) AS totalSale,
    SUM(CASE WHEN sold = TRUE THEN 1 ELSE 0 END) AS sold_count,
    SUM(CASE WHEN sold = FALSE THEN 1 ELSE 0 END) AS unsold_count
    FROM transactions
    WHERE strftime('%m',dateOfSale) = '${month}';
    `;
  // console.log("query", query);
  const data = await new Promise((resolve, reject) => {
    db.get(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
  res.send({
    data,
  });
};

const getPriceRanges = async (req, res) => {
  const { month } = req.params;
  const query = `
    SELECT
    price_range,
    COUNT(*) AS total_products
FROM
    (
        SELECT 
            title,
            price,
            CASE
                WHEN price >= 0 AND price <= 100 THEN '0 - 100'
                WHEN price > 100 AND price <= 200 THEN '101 - 200'
                WHEN price > 200 AND price <= 300 THEN '201 - 300'
                WHEN price > 300 AND price <= 400 THEN '301 - 400'
                WHEN price > 400 AND price <= 500 THEN '401 - 500'
                WHEN price > 500 AND price <= 600 THEN '501 - 600'
                WHEN price > 600 AND price <= 700 THEN '601 - 700'
                WHEN price > 700 AND price <= 800 THEN '701 - 800'
                WHEN price > 800 AND price <= 900 THEN '801 - 900'
                WHEN price > 900 THEN '901 - above'
            END AS price_range
        FROM 
            transactions
        WHERE
            strftime('%m', dateOfSale) = '${month}'
    ) AS price_ranges
GROUP BY
    price_range
    `;
  const data = await new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
  res.status(200).json({
    status: "success",
    data: data,
  });
};

const getCategoryCount = async (req, res) => {
  const { month } = req.params;
  let query = `
    SELECT category, COUNT(*) AS items_count
FROM transactions
WHERE strftime('%m', dateOfSale) = '${month}'
GROUP BY category;
`;
  const data = await new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
  res.status(200).json({
    status: "success",
    data: data,
  });
};

module.exports = {
  getAllTransactions,
  getTransaction,
  getMonthTransactions,
  getPriceRanges,
  getCategoryCount,
};
