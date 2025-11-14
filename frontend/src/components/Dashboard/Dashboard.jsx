import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardAnalytics } from "../../redux/slices/analyticsSlice";
import MetricsCard from "./MetricsCard";
import Charts from "./Charts";
import {
  FiUsers,
  FiTrendingUp,
  FiDollarSign,
  FiCheckCircle
} from "react-icons/fi";
import "./Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, loading } = useSelector((state) => state.analytics);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardAnalytics());
  }, [dispatch]);

  if (loading || !dashboardData) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const metrics = [
    {
      title: "Total Leads",
      value: dashboardData.totalLeads,
      icon: <FiUsers />,
      color: "#667eea"
    },
    {
      title: "Conversion Rate",
      value: `${dashboardData.conversionRate}%`,
      icon: <FiTrendingUp />,
      color: "#10b981"
    },
    {
      title: "Total Value",
      value: `$${dashboardData.totalValue}`,
      icon: <FiDollarSign />,
      color: "#f59e0b"
    },
    {
      title: "Leads This Month",
      value: dashboardData.leadsThisMonth,
      icon: <FiCheckCircle />,
      color: "#06b6d4"
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's what's happening with your leads today.</p>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <MetricsCard key={index} {...metric} />
        ))}
      </div>

      <Charts data={dashboardData} />

      <div className="recent-activities">
        <h3>Recent Activities</h3>
        {dashboardData.recentActivities?.length > 0 ? (
          <div className="activity-list">
            {dashboardData.recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.type}</div>
                <div className="activity-content">
                  <p className="activity-title">{activity.title}</p>
                  <p className="activity-lead">
                    Lead: {activity.lead?.name} • By: {activity.user?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent activities</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
