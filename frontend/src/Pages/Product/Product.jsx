import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar/Sidebar";
import CreateProduct from "../../Components/CreateProduct/CreateProduct";
import FilterDropdown from "../../Components/FilterDropDown/FilterDropDown"
import "./Product.css";

const API_URL = "http://localhost:5000/api/masters/products";

// the fields shown as headings in the filter dropdown
const FILTER_FIELDS = [
  { key: "product_id", label: "Product Id" },
  { key: "product_code", label: "Product Code" },
  { key: "product_name", label: "Product Name" },
  { key: "category", label: "Category" },
  { key: "brand", label: "Brand" },
];

// the search box looks in all of these
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

  // what the user is typing / choosing (not applied yet)
  const [searchInput, setSearchInput] = useState("");
  const [filterInput, setFilterInput] = useState("all");

  // what is applied to the table after clicking Search
  const [searchText, setSearchText] = useState("");
  // "all", or "field::value" such as "category::Food"
  const [filterValue, setFilterValue] = useState("all");

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

  // for each field, the unique values found in the products
  const filterGroups = useMemo(
    () =>
      FILTER_FIELDS.map((f) => ({
        ...f,
        values: [
          ...new Set(
            products
              .map((p) => p[f.key])
              .filter((v) => v !== null && v !== undefined && v !== "")
              .map(String)
          ),
        ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
      })),
    [products]
  );

  const hasFilters =
    searchInput !== "" || filterInput !== "all" ||
    searchText.trim() !== "" || filterValue !== "all";

  // apply the typed text and chosen dropdown value (Search button / Enter key)
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchText(searchInput);
    setFilterValue(filterInput);
  };



  // dropdown choice + search text, applied together
  const filteredProducts = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    let field = null;
    let value = null;
    if (filterValue !== "all") {
      const i = filterValue.indexOf("::");
      field = filterValue.slice(0, i);
      value = filterValue.slice(i + 2);
    }

    return products.filter((p) => {
      if (field && String(p[field] ?? "") !== value) return false;
      if (!q) return true;
      return SEARCH_FIELDS.some((f) => String(p[f] ?? "").toLowerCase().includes(q));
    });
  }, [products, searchText, filterValue]);

  // download the currently shown (filtered) list as a CSV file
  const handleExport = () => {
    if (filteredProducts.length === 0) return;
    const header = ["Product Id", "Product Code", "Barcode", "Product name", "Active", "Category", "Brand"];
    const rows = filteredProducts.map((p) => [
      p.product_id, p.product_code, p.barcode || "", p.product_name,
      p.active ? "Yes" : "No", p.category, p.brand || "",
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
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search Product..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            {/* one dropdown: each field is a heading with its values underneath */}
            <FilterDropdown
              groups={filterGroups}
              value={filterInput}
              onChange={setFilterInput}
            />

            <button type="submit" className="search-btn">
              Search
            </button>

            <span className="result-count">
              {filteredProducts.length} of {products.length}
            </span>
          </form>

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
                  <tr><td colSpan={7} style={{ color: "#e53935" }}>{error}</td></tr>
                )}

                {!error && !loading && products.length === 0 && (
                  <tr><td colSpan={7}>No products yet. Click Add to create one.</td></tr>
                )}

                {!error && !loading && products.length > 0 && filteredProducts.length === 0 && (
                  <tr><td colSpan={7}>No products match your search or filter.</td></tr>
                )}

                {filteredProducts.map((p) => (
                  <tr key={p.product_id}>
                    <td>{p.product_id}</td>
                    <td>{p.product_code}</td>
                    <td>{p.barcode || "-"}</td>
                    <td>{p.product_name}</td>
                    <td> <span className={`active-box ${p.active ? "on" : ""}`}>
                        {p.active ? "✓" : ""}
                      </span></td>
                    <td>{p.category}</td>
                    <td>{p.brand || "-"}</td>
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