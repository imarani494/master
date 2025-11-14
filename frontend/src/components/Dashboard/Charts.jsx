import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import "./Dashboard.css";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Charts = ({ data }) => {
  const statusData = {
    labels: data.leadsByStatus?.map((item) => item.status) || [],
    datasets: [
      {
        label: "Leads by Status",
        data: data.leadsByStatus?.map((item) => item.count) || [],
        backgroundColor: [
          "#3b82f6",
          "#8b5cf6",
          "#06b6d4",
          "#f59e0b",
          "#f97316",
          "#10b981",
          "#ef4444"
        ]
      }
    ]
  };

  const priorityData = {
    labels: data.leadsByPriority?.map((item) => item.priority) || [],
    datasets: [
      {
        label: "Leads by Priority",
        data: data.leadsByPriority?.map((item) => item.count) || [],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"]
      }
    ]
  };

  return (
    <div className="charts-container">
      <div className="chart-card">
        <h3>Leads by Status</h3>
        <Pie data={statusData} />
      </div>
      <div className="chart-card">
        <h3>Leads by Priority</h3>
        <Bar data={priorityData} />
      </div>
    </div>
  );
};

export default Charts;
