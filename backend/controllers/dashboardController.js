
import db from "../config/db.js";

export const getDashboardData = async (req, res) => {
   
    try {
        // Total products and active products
        const [productStats] = await db.query(`
            SELECT
                COUNT(*) AS totalProducts,
                SUM(CASE WHEN active = TRUE THEN 1 ELSE 0 END) AS activeProducts
            FROM products
        `);

        // Total inventory value is not calculated here
        // because the current schema has no stock quantity.

        // Products grouped by category
        const [categories] = await db.query(`
            SELECT
                category,
                COUNT(*) AS total
            FROM products
            GROUP BY category
        `);

        // Latest products
        const [recentProducts] = await db.query(`
            SELECT
                product_id,
                product_code,
                product_name,
                category,
                price,
                selling_price
            FROM products
            ORDER BY product_id DESC
            LIMIT 5
        `);

        res.status(200).json({
            success: true,
            productStats: productStats[0],
            categories,
            recentProducts
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch dashboard data"
        });
    }
};
