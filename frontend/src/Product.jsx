import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Sidebar from "./Components/Sidebar/Sidebar";
import CreateProduct from "./Components/CreateProduct/CreateProduct";
import "./Product.css";

const API_URL = "http://localhost:5000/api/masters/products";

// which field the dropdown searches in ("all" = every field below)
const SEARCH_FIELDS = [
  "product_id",
  "product_code",
  "barcode",
  "product_name",
  "category",
  "brand",
];

function Product() {
  const [addProduct, setAddProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState("all"); // was undefined before

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  // load once when the page opens
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // apply the search box + dropdown to the loaded products
  const filteredProducts = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return products;

    const fields = searchBy === "all" ? SEARCH_FIELDS : [searchBy];
    return products.filter((p) =>
      fields.some((f) => String(p[f] ?? "").toLowerCase().includes(q))
    );
  }, [products, searchText, searchBy]);

  // download the currently shown (filtered) list as a CSV file
  const handleExport = () => {
    if (filteredProducts.length === 0) return;
    const header = ["Product Id", "Product Code", "Barcode", "Product Name", "Active", "Category", "Brand"];
    const rows = filteredProducts.map((p) => [
      p.product_id, p.product_code, p.barcode || "", p.product_name,
      p.active ? "Yes" : "No", p.category, p.brand
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="product-layout">
      <Sidebar />
      <div className="product-main">
        <main className="main-content">
          <header className="topbar">
            ☰ &nbsp; Master &nbsp; › &nbsp;
            <span>Products</span>
            <div className="user-info">👤 {user.username || "Guest"}</div>
          </header>

          <h2 className="page-title">▣ Products</h2>

          {/* Search and filter */}
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search Product..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <select
              className="search-select"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option value="all">All Fields</option>
              <option value="product_id">Product Id</option>
              <option value="product_code">Product Code</option>
              <option value="product_name">Product Name</option>
              <option value="category">Category</option>
              <option value="brand">Brand</option>
            </select>
            <span className="result-count">
              {filteredProducts.length} of {products.length}
            </span>
          </div>

          <div className="page-actions">
            <button className="export-btn" onClick={handleExport} disabled={filteredProducts.length === 0}>
              Export
            </button>
            <button className="import-btn">Import</button>
            <button className="addProduct-btn" onClick={() => setAddProduct(true)}>Add</button>
            <button className="refresh-btn" onClick={loadProducts} disabled={loading}>
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <CreateProduct
            isOpen={addProduct}
            onClose={() => setAddProduct(false)}
            onSaved={loadProducts}
          />

          <div className="product-table">
            <table>
              <thead>
                <tr>
                  <th>Product Id</th>
                  <th>Product Code</th>
                  <th>Barcode</th>
                  <th>Product name</th>
                  <th>Active</th>
                  <th>Category</th>
                  <th>Brand</th>
                </tr>
              </thead>
              <tbody>
                {error && (
                  <tr><td colSpan={6} style={{ color: "#e53935" }}>{error}</td></tr>
                )}

                {!error && !loading && products.length === 0 && (
                  <tr><td colSpan={6}>No products yet. Click Add to create one.</td></tr>
                )}

                {!error && !loading && products.length > 0 && filteredProducts.length === 0 && (
                  <tr><td colSpan={6}>No products match your search.</td></tr>
                )}

                {filteredProducts.map((p) => (
                  <tr key={p.product_id}>
                    <td>{p.product_id}</td>
                    <td>{p.product_code}</td>
                    <td>{p.barcode || "-"}</td>
                    <td>{p.product_name}</td>
                    <td>{p.active ? "✓" : "✗"}</td>
                    <td>{p.category}</td>
                    <td>{p.brand}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Product;