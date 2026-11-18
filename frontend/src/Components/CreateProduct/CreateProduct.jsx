import { useState } from "react";
import axios from "axios";
import "./CreateProduct.css";

const API_URL = "http://localhost:5000/api/masters/products";

const initialForm = {
  productId: "", productCode: "", productName: "", category: "",
  brand: "", unit: "", displayOrder: "", group: "", active: true,
  displayInPOS: true, customerCard: false, price: "",
  sellingPrice: "",
  taxInclusive: true,
  sellable: true,
  redeemable: true,
  pointValue: "",
  costPerPoint: "",
  barcode: "",
  minimumStock: "",
  taxCategory: "",
  taxPercentage: "",
  tax: "",
  priceNoTax: "",
};

function CreateProduct({ isOpen, onClose }) {
  // all hooks first
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);         // preview url
  const [imageFile, setImageFile] = useState(null); // real file to upload
  const [saving, setSaving] = useState(false);

  // only after the hooks
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleReset = () => {
    setForm(initialForm);
    setImage(null);
    setImageFile(null);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be 2MB or smaller.");
      return;
    }
    setImage(URL.createObjectURL(file));
    setImageFile(file);
  };

  const generateCode = () =>
    setForm((f) => ({ ...f, productCode: "PRD-" + Date.now().toString().slice(-8) }));

  const generateBarcode = () =>
    setForm((f) => ({
      ...f,
      barcode: Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join(""),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`dataaa:${form}`);
    if (!form.productCode || !form.productName || !form.category || !form.brand || !form.unit) {
      alert("Please fill Product Code, Name, Category, Brand and Unit.");
      return;
    }

    // multipart so the image can go along with the data
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    const user = JSON.parse(localStorage.getItem("user") || "{}");
const payload = { ...form, updatedBy: user.username || "" };

try {
  const res = await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  setForm((f) => ({ ...f, productId: String(res.data.id) }));
  alert("Product saved successfully!");
} catch (err) {
  console.error(err);
  alert(err.response?.data?.message || err.message);
} 
  };

  const field = (label, name, placeholder = "", type = "text") => (
    <div className="form-field">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );

  // signature: (label, name, options)
  const selectField = (label, name, options = []) => (
    <div className="form-field">
      <label>{label}</label>
      <select name={name} value={form[name]} onChange={handleChange}>
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  const checkField = (label, name) => (
    <label className="check-field">
      <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} />
      {label}
    </label>
  );

  return (
    <div className="modal-overlay">
      <div className="product-modal">
        <div className="modal-header">
          <h3>🟠 &nbsp; Add Products</h3>
          <button type="button" className="close-btn" onClick={onClose}>x</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* General information */}
          <section className="form-section">
            <h4>General Information</h4>
            <div className="form-row">
              {field("Product Id", "productId","343456")}
              {field("Product Code (SKU)*", "productCode", "")}
              <button type="button" className="generate-btn" onClick={generateCode}>
                Generate
              </button>
              {field("Product name*", "productName", "")}
            </div>
            <div className="form-row">
              {selectField("Category*", "category", ["Electronics", "Food", "Clothing", "Accessories"])}
              {selectField("Brand*", "brand", ["Hot wheels", "Nestle", "Fun World", "Gucci"])}
              {selectField("Unit of Measure*", "unit", ["Pieces", "Kg", "Box", "Liter"])}
              <button type="button" className="add-btn">+</button>
            </div>
            <div className="form-row">
              {field("Display Order", "displayOrder", "", "number")}
              {selectField("Display Group", "group", ["Pizza > Medium", "Pizza > Large", "General"])}
              <div className="checkbox-group">
                {checkField("Active", "active")}
                {checkField("Display in POS", "displayInPOS")}
                {checkField("Customer Card", "customerCard")}
              </div>
            </div>
          </section>

          {/* Bottom sections */}
          <div className="bottom-sections">
            {/* Price */}
            <section className="form-section price-section">
              <h4>Price</h4>
              <div className="form-row">
                {field("Price*", "price", "", "number")}
                {field("Selling price", "sellingPrice", "", "number")}
              </div>
              {checkField("Tax Inclusive", "taxInclusive")}
              <div className="form-row">
                {selectField("Tax Category", "taxCategory", ["FNB Tax (16%)", "Standard Tax", "No Tax"])}
                {field("Tax %", "taxPercentage", "", "number")}
              </div>
              <div className="form-row">
                {field("Tax", "tax", "", "number")}
                {field("Price No Tax", "priceNoTax", "", "number")}
              </div>
            </section>

            {/* Entitlements */}
            <section className="form-section entitlement-section">
              <h4>Entitlements</h4>
              <div className="checkbox-group">
                {checkField("Sellable?", "sellable")}
                {checkField("Redeemable?", "redeemable")}
              </div>
              <div className="form-row">
                {field("Point value", "pointValue", "", "number")}
                {field("Cost Per Point", "costPerPoint", "", "number")}
              </div>
              <div className="form-row">
                {field("Barcode", "barcode", "Type Barcode & Press Enter")}
                <button type="button" className="generate-btn" onClick={generateBarcode}>
                  Auto Generate
                </button>
              </div>
              <div className="form-row">
                {field("Minimum Stock", "minimumStock", "", "number")}
              </div>
            </section>

            {/* Product preview */}
            <section className="form-section preview-section">
              <h4>Product Preview</h4>
              <p>PNG, JPG or JPEG (Max 2MB)</p>
              <label className="image-upload">
                {image ? <img src={image} alt="Product preview" /> : <span>+</span>}
                <input type="file" accept="image/png,image/jpeg" onChange={handleImage} hidden />
              </label>
            </section>
          </div>

          {/* Last updated */}
          <div className="updated-info">
            <span>Last Updated Date: &nbsp; {new Date().toLocaleString()}</span>
            <span>Last Updated User: &nbsp; {JSON.parse(localStorage.getItem("user") || "{}").username}</span>
          </div>

          {/* Buttons */}
          <div className="modal-footer">
            <button type="button" className="reset-btn" onClick={handleReset}>Reset</button>
            <div className="footer-actions">
              <button type="button" className="new-btn" onClick={handleReset}>New</button>
              <button type="button" className="duplicate-btn" onClick={() => alert("Duplicate product")}>
                Duplicate
              </button>
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;
