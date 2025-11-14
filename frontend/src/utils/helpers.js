import { format, formatDistance } from "date-fns";

// Format date
export const formatDate = (date) => {
  if (!date) return "";
  return format(new Date(date), "MMM dd, yyyy");
};

// Format date with time
export const formatDateTime = (date) => {
  if (!date) return "";
  return format(new Date(date), "MMM dd, yyyy HH:mm");
};

// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) return "";
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    new: "#3b82f6",
    contacted: "#8b5cf6",
    qualified: "#06b6d4",
    proposal: "#f59e0b",
    negotiation: "#f97316",
    won: "#10b981",
    lost: "#ef4444"
  };
  return colors[status] || "#6b7280";
};

// Get priority color
export const getPriorityColor = (priority) => {
  const colors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444"
  };
  return colors[priority] || "#6b7280";
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
