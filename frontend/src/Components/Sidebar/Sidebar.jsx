import { useState } from "react";
import axios from "axios";
import {useNavigate, NavLink} from "react-router-dom"
import "./Sidebar.css";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: "▦" },
  {
    name: "Masters",
    icon: "♛",
    children: [
      { name: "Product", path: "/masters/product" },
      { name: "Product Category", path: "/masters/category" },
      { name: "Suppliers", path: "/masters/suppliers" },
      { name: "Brand", path: "/masters/brand" },
      { name: "Storage Locations", path: "/masters/locations" },
      { name: "Units", path: "/masters/units" },
    ],
  },
  { name: "Purchasing", path: "/purchasing", icon: "⇄", caret: true },
  { name: "Inventory", path: "/inventory", icon: "☑", caret: true },
  { name: "Reports", path: "/reports", icon: "▤", caret: true },
  { name: "Administration", path: "/administration", icon: "☺", caret: true },
];

function Sidebar() {
  const [open, setOpen] = useState("Masters");
  const navigate = useNavigate();
   const handleLogout = async () => {
    try {
      // optional: tell the backend (your controller already has a logout)
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (err) {
      console.error("Logout request failed:", err);   // log out locally anyway
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("authChange"));
      navigate("/", { replace: true });    
    }
  };
  return (
    <aside className="side-container">
      <h2 className="side-logo">FAPSS</h2>

      <nav className="side-menu">
        {menu.map((item) =>
          item.children ? (
            <div key={item.name}>
              <button
                className={`side-link ${open === item.name ? "active" : ""}`}
                onClick={() => setOpen(open === item.name ? "" : item.name)}
              >
                <span className="side-icon">{item.icon}</span>
                <span className="side-text">{item.name}</span>
                <span className="side-caret">{open === item.name ? "▲" : "▼"}</span>
              </button>
              {open === item.name && (
                <div className="side-sub">
                  {item.children.map((c) => (
                    <NavLink
                      key={c.name}
                      to={c.path}
                      className={({ isActive }) =>
                        isActive ? "sub-link sub-active" : "sub-link"
                      }
                    >
                      {c.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "side-link active" : "side-link"
              }
            >
              <span className="side-icon">{item.icon}</span>
              <span className="side-text">{item.name}</span>
              {item.caret && <span className="side-caret">▼</span>}
            </NavLink>
          )
        )}
      </nav>

      <button className="side-logout" onClick={handleLogout}>
    <span className="side-icon">⏻</span> Logout
  </button>
    </aside>
  );
}

export default Sidebar;