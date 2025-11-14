import "./Dashboard.css";

const MetricsCard = ({ title, value, icon, color }) => {
  return (
    <div className="metrics-card">
      <div className="metrics-icon" style={{ background: `${color}20`, color }}>
        {icon}
      </div>
      <div className="metrics-content">
        <p className="metrics-title">{title}</p>
        <h2 className="metrics-value">{value}</h2>
      </div>
    </div>
  );
};

export default MetricsCard;
