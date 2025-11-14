import { Outlet } from "react-router-dom";
import Navbar from "../Common/Navbar";
import Sidebar from "../Common/Sidebar";
import "./Layout.css";

const MainLayout = () => {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
