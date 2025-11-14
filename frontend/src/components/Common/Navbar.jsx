import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { FiBell, FiLogOut } from "react-icons/fi";
import NotificationBell from "../Notifications/NotificationBell";
import "./Common.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>CRM System</h2>
      </div>
      <div className="navbar-actions">
        <NotificationBell />
        <div className="user-menu">
          <span>{user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
