import db from "../config/db.js";


const num = (v) => (v === "" || v === undefined || v === null ? null : Number(v));
const bool = (v) => (v === "true" || v === true ? 1 : 0);

export const createProduct = async (req, res) => {
  try {
    const b = req.body;

    if (!b.productCode || !b.productName || !b.category || !b.brand || !b.unit) {
      return res.status(400).json({
        success: false,
        message: "Product code, name, category, brand and unit are required.",
      });
    }

    const sql = `
      INSERT INTO products
        (product_id,product_code, product_name, barcode, category, brand, unit,
         display_order, display_group, active, display_in_pos, customer_card,
         price, selling_price, tax_inclusive, tax_category, tax_percentage,
         tax, price_no_tax, sellable, redeemable, point_value, cost_per_point,
         minimum_stock)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
      b.productId,
      b.productCode, b.productName, b.barcode || null, b.category, b.brand, b.unit,
      num(b.displayOrder), b.group || null, bool(b.active), bool(b.displayInPOS),
      bool(b.customerCard),
      num(b.price), num(b.sellingPrice), bool(b.taxInclusive), b.taxCategory || null,
      num(b.taxPercentage), num(b.tax), num(b.priceNoTax),
      bool(b.sellable), bool(b.redeemable), num(b.pointValue), num(b.costPerPoint),
      num(b.minimumStock),
      req.file ? `/uploads/${req.file.filename}` : null,
      b.updatedBy || null,
    ];

    const [result] = await db.query(sql, values);

    return res.status(201).json({
      success: true,
      message: "Product saved",
      id: result.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Product code already exists.",
      });
    }
    console.error("Create product error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getProducts = async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT product_id, product_code, barcode, product_name, active, category
       FROM products ORDER BY product_id DESC`
    );
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};