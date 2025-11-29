// constants.js

export const COMPANY_SIZES = [
  "Startup (1-10)",
  "Small Business (11-50)",
  "Mid-Market (51-200)",
  "Large Enterprise (201-1000)",
  "Corporate / MNC (1000+)",
];

export const INDUSTRY_DATA = {
  "SaaS / Technology": {
    departments: [
      "Customer Support (L1/L2)",
      "Sales Development (SDR)",
      "DevOps / SRE",
      "Quality Assurance (QA)",
    ],
    tools: ["Zendesk", "Intercom", "Jira", "Salesforce", "GitHub", "PagerDuty"],
  },
  "E-Commerce / Retail": {
    departments: [
      "Order Management",
      "Customer Returns",
      "Inventory Analysis",
      "Digital Marketing",
    ],
    tools: ["Shopify", "Magento", "Gorgias", "Klaviyo", "NetSuite", "Excel"],
  },
  "Healthcare / MedTech": {
    departments: [
      "Patient Scheduling",
      "Medical Billing/Coding",
      "Claims Processing",
      "Compliance Audit",
    ],
    tools: ["Epic", "Cerner", "DrChrono", "Kareo", "AthenaHealth"],
  },
  "Finance / Fintech": {
    departments: [
      "KYC / Compliance",
      "Loan Processing",
      "Fraud Detection",
      "Account Reconciliation",
    ],
    tools: ["Bloomberg", "Quickbooks", "Xero", "Plaid", "Fiserv", "Tableau"],
  },
  "Legal Services": {
    departments: [
      "Paralegal Research",
      "Contract Review",
      "Client Intake",
      "Document Discovery",
    ],
    tools: ["Clio", "LexisNexis", "Westlaw", "DocuSign", "iManage"],
  },
  "HR / Recruitment": {
    departments: [
      "Candidate Screening",
      "Onboarding",
      "Payroll Administration",
      "Employee Relations",
    ],
    tools: ["Workday", "BambooHR", "Greenhouse", "Lever", "ADP"],
  },
  "Logistics / Supply Chain": {
    departments: [
      "Dispatch Coordination",
      "Route Planning",
      "Freight Bill Audit",
      "Warehouse Management",
    ],
    tools: ["SAP", "Oracle SCM", "Flexport", "Samsara", "Descartes"],
  },
  "Real Estate": {
    departments: [
      "Property Management",
      "Lease Administration",
      "Lead Qualification",
    ],
    tools: ["Yardi", "AppFolio", "Zillow Premier", "Buildium"],
  },
};
