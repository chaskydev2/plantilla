// =========================================
// Form Utilities and Constants
// =========================================

// Small util for className concatenation
export const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

// Styles / tokens
export const fieldCls =
  "w-full border-2 rounded-xl px-4 py-3 text-gray-900 bg-white shadow-sm outline-none transition-all duration-200 focus:shadow-md";

export const labelCls = "block text-sm font-semibold mb-2 tracking-wide";

export const helpMuted = { color: "var(--color-secondary)", opacity: 0.8 } as React.CSSProperties;
export const borderPrimary = { borderColor: "var(--color-secondary)" } as React.CSSProperties;

// Initial state values
export const initialBaseAuth = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };

export const initialHomeowner = {
  ...initialBaseAuth,
  userType: "ownerHome" as const,
  phone: "",
  preferredZip: "",
};

export const initialContractor = {
  ...initialBaseAuth,
  userType: "contractor" as const,
  address: "",
  phone: "",
  company: "",
  licenseNumber: "",
  services: "",
  yearsOfExperience: "",
  portfolioUrl: "",
  role_ids: [],
};

// Role data (this could be moved to a separate data file or fetched from API)
export const rolesData = {
  data: {
    roles: [
      { id: 1, name: "Plumber" },
      { id: 2, name: "Electrician" },
      { id: 3, name: "Carpenter" },
      { id: 4, name: "Painter" },
      { id: 5, name: "HVAC Technician" },
      { id: 6, name: "Landscaper" },
      { id: 7, name: "Roofer" },
      { id: 8, name: "General Contractor" },
    ],
  },
};