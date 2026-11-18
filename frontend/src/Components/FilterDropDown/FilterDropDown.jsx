import { useState, useEffect, useRef } from "react";
import "./FilterDropdown.css";

/**
 * groups:   [{ key: "category", label: "Category", values: ["Food", "Toys"] }, ...]
 * value:    "all" or "key::value"  (e.g. "category::Food")
 * onChange: called with the new value
 */
function FilterDropdown({ groups, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(null); // field whose side list is open
  const ref = useRef(null);

  // close when clicking outside or pressing Escape
  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const close = () => {
    setOpen(false);
    setActiveKey(null);
  };

  const pick = (v) => {
    onChange(v);
    close();
  };

  // text shown on the button, e.g. "Category: Food"
  let label = "All";
  let selectedKey = null;
  if (value !== "all") {
    const i = value.indexOf("::");
    selectedKey = value.slice(0, i);
    const v = value.slice(i + 2);
    const g = groups.find((x) => x.key === selectedKey);
    label = `${g ? g.label : selectedKey}: ${v}`;
  }

  return (
    <div className="fd" ref={ref}>
      <button
        type="button"
        className="fd-button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className="fd-label">{label}</span>
        <span className="fd-caret">▼</span>
      </button>

      {open && (
        <ul className="fd-menu" role="menu">
          <li
            className={`fd-item ${value === "all" ? "selected" : ""}`}
            role="menuitem"
            onMouseEnter={() => setActiveKey(null)}
            onClick={() => pick("all")}
          >
            All
          </li>

          {groups
            .filter((g) => g.values.length > 0)
            .map((g) => (
              <li
                key={g.key}
                className={`fd-item ${activeKey === g.key ? "open" : ""} ${
                  selectedKey === g.key ? "selected" : ""
                }`}
                role="menuitem"
                aria-haspopup="menu"
                onMouseEnter={() => setActiveKey(g.key)}
                onClick={() => setActiveKey(activeKey === g.key ? null : g.key)}
              >
                <span>{g.label}</span>
                <span className="fd-arrow">›</span>

                {/* side list, opens to the right of the field */}
                {activeKey === g.key && (
                  <ul className="fd-sub" role="menu">
                    {g.values.map((v) => {
                      const full = `${g.key}::${v}`;
                      return (
                        <li
                          key={full}
                          className={`fd-sub-item ${value === full ? "selected" : ""}`}
                          role="menuitem"
                          onClick={(e) => {
                            e.stopPropagation(); // don't toggle the parent row
                            pick(full);
                          }}
                        >
                          {v}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default FilterDropdown;