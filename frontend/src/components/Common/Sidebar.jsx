import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiBarChart2, FiSettings } from "react-icons/fi";
import "./Common.css";

const Sidebar = () => {
  const menuItems = [
    { path: "/dashboard", icon: <FiHome />, label: "Dashboard" },
    { path: "/leads", icon: <FiUsers />, label: "Leads" },
    { path: "/analytics", icon: <FiBarChart2 />, label: "Analytics" },
    { path: "/settings", icon: <FiSettings />, label: "Settings" }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
