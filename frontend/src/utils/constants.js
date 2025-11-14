export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  SALES_EXECUTIVE: "sales_executive"
};

export const LEAD_STATUS = {
  NEW: "new",
  CONTACTED: "contacted",
  QUALIFIED: "qualified",
  PROPOSAL: "proposal",
  NEGOTIATION: "negotiation",
  WON: "won",
  LOST: "lost"
};

export const LEAD_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high"
};

export const ACTIVITY_TYPES = {
  NOTE: "note",
  CALL: "call",
  MEETING: "meeting",
  EMAIL: "email",
  STATUS_CHANGE: "status_change",
  ASSIGNMENT: "assignment"
};
