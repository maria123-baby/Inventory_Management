import Sidebar from "../../Components/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import "./Dashboard.css";

const stats = [
  { label: "Today's Products", value: "1,245", sub: "Active Items", color: "#7c4dff", icon: "▣" },
  { label: "Inventory Value", value: "JD 1,456.00", sub: "Total Stock Value", color: "#1e5eff", icon: "🏷" },
  { label: "Low Stock Items", value: "456", sub: "Below Minimum", color: "#22b55e", icon: "⚠" },
  { label: "Out of Stocks", value: "167", sub: "Items", color: "#ff9a3c", icon: "✕" },
  { label: "Non-Moving Items", value: "56", sub: "Over 90 Days", color: "#f2557f", icon: "▦" },
];

const quick = [
  { label: "Purchase Orders", value: 12, sub: "Pending", icon: "🧺" },
  { label: "Goods Receipt", value: 34, sub: "Today", icon: "🧾" },
  { label: "Stock Transfer", value: 45, sub: "Pending", icon: "🚚" },
  { label: "Stock Adjustment", value: 9, sub: "Today", icon: "⚙" },
  { label: "Stock Issue", value: 31, sub: "Today", icon: "⬇" },
  { label: "Supplier", value: 9, sub: "Active", icon: "👥" },
];

const categories = [
  { name: "Food & Beverage", pct: 45.6, color: "#1e5eff" },
  { name: "Redemption Items", pct: 21.6, color: "#22b55e" },
  { name: "Merchandise", pct: 19.8, color: "#ff9f1c" },
  { name: "Spare Parts", pct: 11.2, color: "#f2557f" },
  { name: "Others", pct: 6.0, color: "#9b5de5" },
];

// builds a conic-gradient string from the category data
const donut = (() => {
  let start = 0;
  return categories
    .map((c) => {
      const seg = `${c.color} ${start}% ${start + c.pct}%`;
      start += c.pct;
      return seg;
    })
    .join(", ");
})();

const alerts = [
  { label: "Out of Stocks", value: 22, color: "#e53935" },
  { label: "Low Stock Items", value: 34, color: "#1e5eff" },
  { label: "Over Stock Items", value: 56, color: "#f5b700" },
  { label: "Stocks (90+ Days)", value: 90, color: "#222" },
];

const lowStock = [
  { product: "Coco Cola Can", current: 22, min: 22, low: true },
  { product: "Nachos Cheese", current: 11, min: 11, low: true },
  { product: "Teddy Bear Small", current: 3, min: 3, low: true },
  { product: "Balloon Red", current: 45, min: 45, low: true },
  { product: "Hotwheels Car", current: 22, min: 22, low: true },
];

const transactions = [
  { type: "Goods Receipt", ref: "GRN-000123", desc: "Goods Receipt from Al Noor supplies", wh: "Main Warehouse", time: "10:12 AM" },
  { type: "Stock Transfer", ref: "ST-000098", desc: "Goods Receipt from Al Noor supplies", wh: "Main Warehouse", time: "10:12 AM" },
  { type: "Stock Adjustment", ref: "ADJ-000098", desc: "Goods Receipt from Al Noor supplies", wh: "Main Warehouse", time: "10:12 AM" },
  { type: "Purchase Order", ref: "ISS - 234588", desc: "Goods Receipt from Al Noor supplies", wh: "Main Warehouse", time: "10:12 AM" },
];

const warehouses = [
  { name: "Main Warehouse", value: "JD 12,312.00", pct: 90, color: "#1e5eff", items: 345 },
  { name: "Main Warehouse", value: "JD 12,312.00", pct: 75, color: "#22b55e", items: 345 },
  { name: "Main Warehouse", value: "JD 12,312.00", pct: 50, color: "#f5b700", items: 345 },
  { name: "Main Warehouse", value: "JD 12,312.00", pct: 60, color: "#9b5de5", items: 345 },
  { name: "Main Warehouse", value: "JD 12,312.00", pct: 15, color: "#e53935", items: 345 },
];

function Dashboard() {
    const [user, setUser] = useState(null);
   useEffect(() => {
    const data = localStorage.getItem("user");
    if(data){
      setUser(JSON.parse(data));
    }
 
  }, []);
  return (
    <div className="dash-layout">
      <Sidebar />

      <div className="dash-main">
        {/* Top bar */}
        <header className="topbar">
          <h1>Inventory &amp; Warehouse Management</h1>
          <div className="topbar-right">
            <select className="pill"><option>All Warehouse</option></select>
            <select className="pill"><option>Today</option></select>
            <div className="user">
              <div className="avatar" />
              <div>
                <strong>{user?.username}</strong>
                <small>manager</small>
              </div>
            </div>
          </div>
        </header>

        <div className="content">
          <section className="welcome">
            <h2>Welcome Back, Super Admin</h2>
            <p>Here is what's happening in your amusement park today.</p>
          </section>

          {/* Stat cards (5) */}
          <section className="grid grid-5">
            {stats.map((s) => (
              <div className="card stat" key={s.label}>
                <span className="icon-box" style={{ background: s.color }}>{s.icon}</span>
                <div>
                  <small>{s.label}</small>
                  <b>{s.value}</b>
                  <small className="muted">{s.sub}</small>
                </div>
              </div>
            ))}
          </section>

          {/* Quick cards (6) */}
          <section className="grid grid-6">
            {quick.map((q) => (
              <div className="card quick" key={q.label}>
                <span className="quick-icon">{q.icon}</span>
                <small>{q.label}</small>
                <b>{q.value}</b>
                <small className="muted">{q.sub}</small>
              </div>
            ))}
          </section>

        
          <section className="grid row-3">
            <div className="panel">
              <div className="panel-head">Inventory Value by Category</div>
              <div className="chart-body">
                <div className="donut" style={{ background: `conic-gradient(${donut})` }}>
                  <div className="donut-hole" />
                </div>
                <ul className="legend">
                  {categories.map((c) => (
                    <li key={c.name}>
                      <i style={{ background: c.color }} />
                      <span>{c.name}</span>
                      <em>{c.pct}%</em>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="total">Total Value : JD 234,500.90</p>
            </div>

            <div className="panel">
              <div className="panel-head">Stock Alert Summary</div>
              <ul className="alerts">
                {alerts.map((a) => (
                  <li key={a.label}>
                    <span>{a.label}</span>
                    <b style={{ color: a.color }}>{a.value}</b>
                  </li>
                ))}
              </ul>
              <button className="btn-blue">View All Alerts</button>
            </div>

            <div className="panel">
              <div className="panel-head">
                Top 5 Low Stock Items <a href="#all">View all</a>
              </div>
              <table className="table">
                <thead>
                  <tr><th>Product</th><th>Current Stock</th><th>Minimum Stock</th></tr>
                </thead>
                <tbody>
                  {lowStock.map((r) => (
                    <tr key={r.product}>
                      <td>{r.product}</td>
                      <td className="red">{r.current}</td>
                      <td>{r.min}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Row: transactions / warehouse value */}
          <section className="grid row-2">
            <div className="panel">
              <div className="panel-head">
                Recent Transaction <a href="#all">View all</a>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Type</th><th>Reference No.</th><th>Description</th>
                    <th>Warehouse</th><th>Time</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.ref}>
                      <td>{t.type}</td>
                      <td>{t.ref}</td>
                      <td>{t.desc}</td>
                      <td>{t.wh}</td>
                      <td>{t.time}</td>
                      <td><span className="badge">Completed</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel">
              <div className="panel-head">
                Stock Value By Warehouse <a href="#all">View all</a>
              </div>
              <table className="table">
                <thead>
                  <tr><th>Warehouse</th><th>Stock Value by Warehouse</th><th>Items</th></tr>
                </thead>
                <tbody>
                  {warehouses.map((w, i) => (
                    <tr key={i}>
                      <td>{w.name}</td>
                      <td>
                        <div className="wh-cell">
                          <span>{w.value}</span>
                          <div className="bar">
                            <div style={{ width: `${w.pct}%`, background: w.color }} />
                          </div>
                        </div>
                      </td>
                      <td>{w.items}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;