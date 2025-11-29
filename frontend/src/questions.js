export const mcqQuestions = [
  // Section A
  {
    id: 1,
    field: "seniority_level",
    section: "Human Cost",
    question: "What is the average seniority level of the employees?",
    options: [
      { label: "A) Entry Level / Intern", value: "Entry Level / Intern" },
      {
        label: "B) Junior Associate (1-3 yrs)",
        value: "Junior Associate (1-3 years experience)",
      },
      {
        label: "C) Mid-Level Specialist (3-5 yrs)",
        value: "Mid-Level Specialist (3-5 years experience)",
      },
      { label: "D) Senior / Expert Level", value: "Senior / Expert Level" },
    ],
  },
  {
    id: 2,
    field: "turnover_rate",
    section: "Human Cost",
    question: "What is the approximate annual turnover rate?",
    options: [
      { label: "A) Low (< 10%)", value: "Low (< 10% - Stable team)" },
      {
        label: "B) Moderate (10% - 20%)",
        value: "Moderate (10% - 20% - Standard churn)",
      },
      {
        label: "C) High (20% - 40%)",
        value: "High (20% - 40% - Frequent hiring needed)",
      },
      {
        label: "D) Very High (> 40%)",
        value: "Very High (> 40% - Burn and churn)",
      },
    ],
  },
  {
    id: 3,
    field: "training_time",
    section: "Human Cost",
    question: "How much training time does a new hire need?",
    options: [
      { label: "A) Less than 1 week", value: "Less than 1 week" },
      { label: "B) 1 - 4 weeks", value: "1 - 4 weeks" },
      { label: "C) 1 - 3 months", value: "1 - 3 months" },
      { label: "D) 3+ months", value: "3+ months" },
    ],
  },
  // Section B
  {
    id: 4,
    field: "monthly_task_volume",
    section: "Efficiency",
    question: "Estimated volume of tasks/tickets per month?",
    options: [
      { label: "A) Low (< 500)", value: 500 },
      { label: "B) Medium (500 - 2,000)", value: 2000 },
      { label: "C) High (2,000 - 10,000)", value: 10000 },
      { label: "D) Enterprise (10,000+)", value: 15000 },
    ],
  },
  {
    id: 5,
    field: "avg_task_duration_minutes",
    section: "Efficiency",
    question: "Time to complete one task (minutes)?",
    options: [
      { label: "A) < 2 minutes", value: 2 },
      { label: "B) 2 - 10 minutes", value: 6 },
      { label: "C) 10 - 30 minutes", value: 20 },
      { label: "D) 30+ minutes", value: 45 },
    ],
  },
  {
    id: 6,
    field: "coverage_hours",
    section: "Efficiency",
    question: "Current 'Coverage Window' for this team?",
    options: [
      { label: "A) Standard Business Hours", value: "Standard Business Hours" },
      { label: "B) Extended Hours", value: "Extended Hours" },
      { label: "C) 24/5 (Weekdays)", value: "24/5" },
      { label: "D) 24/7 (Always on)", value: "24/7" },
    ],
  },
  // Section C
  {
    id: 7,
    field: "context_switching",
    section: "Quality",
    question: "How often does this task require 'Context Switching'?",
    options: [
      { label: "A) Never", value: "Never" },
      { label: "B) Occasionally", value: "Occasionally" },
      { label: "C) Frequently", value: "Frequently" },
      { label: "D) Constantly", value: "Constantly" },
    ],
  },
  {
    id: 8,
    field: "error_rate",
    section: "Quality",
    question: "Estimated error/rework rate?",
    options: [
      { label: "A) Negligible (< 1%)", value: "Negligible (< 1%)" },
      { label: "B) Low (1-3%)", value: "Low (1-3%)" },
      { label: "C) Moderate (3-10%)", value: "Moderate (3-10%)" },
      { label: "D) High (> 10%)", value: "High (> 10%)" },
    ],
  },
  {
    id: 9,
    field: "decision_complexity",
    section: "Quality",
    question: "How repetitive is the decision-making?",
    options: [
      { label: "A) 100% Rules-based", value: "100% Rules-based" },
      { label: "B) Mostly Standard", value: "Mostly Standard" },
      { label: "C) Balanced", value: "Balanced" },
      { label: "D) Highly Creative", value: "Highly Creative" },
    ],
  },
  // Section D
  {
    id: 10,
    field: "growth_projection",
    section: "Scalability",
    question: "Projected growth in volume next 12 months?",
    options: [
      { label: "A) Flat (0%)", value: "Flat (0% growth)" },
      { label: "B) Steady (10-20%)", value: "Steady (10-20% growth)" },
      { label: "C) Aggressive (20-50%)", value: "Aggressive (20-50% growth)" },
      {
        label: "D) Hyper-growth (2x)",
        value: "Hyper-growth (2x volume or more)",
      },
    ],
  },
  {
    id: 11,
    field: "primary_bottleneck",
    section: "Scalability",
    question: "What is your biggest bottleneck to doubling output?",
    options: [
      { label: "A) Budget", value: "Budget" },
      { label: "B) Hiring Speed", value: "Hiring Speed" },
      { label: "C) Training", value: "Training" },
      { label: "D) Management Bandwidth", value: "Management Bandwidth" },
    ],
  },
];
