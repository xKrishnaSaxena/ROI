import { useState, useRef } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { INDUSTRY_DATA, COMPANY_SIZES } from "./constants";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Loader2,
  DollarSign,
  Clock,
  Users,
  Download,
  Zap,
  CheckCircle,
  ArrowRight,
  Server,
  ShieldAlert,
  Briefcase,
} from "lucide-react";
import { mcqQuestions } from "./questions";
import html2pdf from "html2pdf.js";

// --- Register ChartJS ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- REPORT COMPONENT (Standard) ---
const ROIReport = ({ reportData, formData }) => {
  const componentRef = useRef(null);
  const handleDownloadPDF = () => {
    const element = componentRef.current;
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `AI_ROI_Report_${formData.department || "Analysis"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans">
      <div className="fixed bottom-8 right-8 z-50 print:hidden">
        <button
          onClick={handleDownloadPDF}
          className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-slate-900 flex items-center gap-3 font-bold text-lg"
        >
          <Download size={20} /> Download PDF
        </button>
      </div>

      <div
        ref={componentRef}
        className="max-w-5xl mx-auto bg-white p-12 rounded-xl shadow-sm print:shadow-none"
      >
        {/* Header */}
        <div className="border-b pb-8 mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">
              GenFox AI Strategy Report
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              {formData.organization_industry} | {formData.department}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-slate-100 px-4 py-2 rounded-lg">
              <p className="text-xs text-slate-500 uppercase font-bold">
                Confidence Score
              </p>
              <p className="text-xl font-bold text-slate-800">
                {reportData.confidence_score || "High"}
              </p>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-blue-600 mb-10">
          <h3 className="font-bold text-slate-800 mb-2 uppercase text-sm">
            Executive Summary
          </h3>
          <p className="text-slate-700 leading-relaxed">
            {reportData.strategic_analysis.executive_summary}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="col-span-1 bg-green-50 border border-green-100 p-6 rounded-xl">
            <div className="text-green-600 mb-2">
              <DollarSign size={24} />
            </div>
            <div className="text-3xl font-extrabold text-green-800">
              ${reportData.metrics.net_annual_savings.toLocaleString()}
            </div>
            <div className="text-sm font-medium text-green-700 mt-1">
              Projected Annual Savings
            </div>
          </div>
          <div className="col-span-1 bg-orange-50 border border-orange-100 p-6 rounded-xl">
            <div className="text-orange-600 mb-2">
              <Clock size={24} />
            </div>
            <div className="text-3xl font-extrabold text-orange-800">
              {reportData.metrics.break_even_months} Mo
            </div>
            <div className="text-sm font-medium text-orange-700 mt-1">
              Break-Even Point
            </div>
          </div>
          <div className="col-span-1 bg-blue-50 border border-blue-100 p-6 rounded-xl">
            <div className="text-blue-600 mb-2">
              <Zap size={24} />
            </div>
            <div className="text-3xl font-extrabold text-blue-800">
              {reportData.metrics.productivity_multiplier}x
            </div>
            <div className="text-sm font-medium text-blue-700 mt-1">
              Efficiency Gain
            </div>
          </div>
        </div>

        {/* Cost Tables */}
        <div className="grid grid-cols-2 gap-10 mb-12">
          {/* Human Costs */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="text-red-500" /> Human Operational Costs
            </h3>
            <div className="bg-white border rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-4 py-3">Cost Item</th>
                    <th className="px-4 py-3 text-right">Annual Est.</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-3">
                      Base Salaries ({formData.human_count} employees)
                    </td>
                    <td className="px-4 py-3 text-right font-bold">
                      $
                      {reportData.human_cost_breakdown.salary_overhead.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Benefits & Insurance</td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      $
                      {reportData.human_cost_breakdown.benefits_insurance?.toLocaleString() ||
                        "0"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Recruiting & Training Churn</td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      $
                      {reportData.human_cost_breakdown.recruiting_training_waste.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Software Licenses</td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      $
                      {reportData.human_cost_breakdown.tool_licensing_cost.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="px-4 py-3 font-bold text-red-900">
                      Total Human Cost
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-red-900">
                      $
                      {reportData.metrics.total_human_annual_cost.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Costs */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Server className="text-blue-500" /> AI Infrastructure Costs
            </h3>
            <div className="bg-white border rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-4 py-3">Cost Item</th>
                    <th className="px-4 py-3 text-right">Annual Est.</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-3">LLM Token Consumption</td>
                    <td className="px-4 py-3 text-right font-bold">
                      $
                      {reportData.ai_cost_breakdown.llm_token_costs?.toLocaleString() ||
                        0}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Server & Hosting</td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      $
                      {reportData.ai_cost_breakdown.server_hosting_costs?.toLocaleString() ||
                        0}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Implementation (Amortized)</td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      $
                      {reportData.ai_cost_breakdown.implementation_fee.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Human-in-the-Loop Review</td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      $
                      {reportData.ai_cost_breakdown.maintenance_cost.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 font-bold text-blue-900">
                      Total AI Cost
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-blue-900">
                      $
                      {reportData.metrics.total_ai_annual_cost.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Charts & Risks */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="h-64">
            <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase text-center">
              Cost Comparison
            </h4>
            <Bar
              data={{
                labels: ["Human Dept", "AI Agent System"],
                datasets: [
                  {
                    label: "Annual Cost",
                    data: [
                      reportData.metrics.total_human_annual_cost,
                      reportData.metrics.total_ai_annual_cost,
                    ],
                    backgroundColor: ["#ef4444", "#3b82f6"],
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-500 mb-2 uppercase">
              Operational Impact
            </h4>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3">
                <ShieldAlert
                  className="text-amber-500 flex-shrink-0"
                  size={20}
                />
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-gray-800">Churn Risk:</span>{" "}
                  Current turnover ({formData.turnover_rate}) requires constant
                  retraining. GenFox retains 100% of knowledge.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="text-blue-500 flex-shrink-0" size={20} />
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-gray-800">Scalability:</span>{" "}
                  With projected growth ({formData.growth_projection}), hiring
                  will become a bottleneck. AI scales instantly.
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 mt-8">
          <p className="text-xs text-gray-400 text-center">
            Calculations based on 2024-2025 market data. Optimized for GenFox
            Self-Hosted Infrastructure.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // --- Dynamic State for Departments ---
  const [generatedDepartments, setGeneratedDepartments] = useState([]);
  const [isFetchingDepts, setIsFetchingDepts] = useState(false);
  const [selectedDeptOption, setSelectedDeptOption] = useState("");

  const [formData, setFormData] = useState({
    organization_industry: "",
    company_size: "",
    department: "",
    human_count: 5,
    description: "",
    // Initialize fields from your questions.js
    seniority_level: "Mid-Level Specialist (3-5 years experience)",
    turnover_rate: "Moderate (10% - 20%)",
    training_time: "1 - 4 weeks",
    monthly_task_volume: 2000,
    avg_task_duration_minutes: 20,
    coverage_hours: "Standard Business Hours",
    context_switching: "Occasionally",
    error_rate: "Low (1-3%)",
    decision_complexity: "Balanced",
    growth_projection: "Steady (10-20%)",
    primary_bottleneck: "Hiring Speed",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 1. Industry Change Handler: Fetch Departments ---
  const handleIndustryChange = async (e) => {
    const industry = e.target.value;

    // Reset departments when industry changes
    setFormData({
      ...formData,
      organization_industry: industry,
      department: "",
    });
    setSelectedDeptOption("");
    setGeneratedDepartments([]);

    if (industry) {
      setIsFetchingDepts(true);
      try {
        const res = await axios.post(
          "https://roi-backend-ggx3.onrender.com/generate-departments",
          { industry }
        );
        setGeneratedDepartments(res.data.departments);
      } catch (err) {
        console.error("Failed to fetch departments", err);
        // Fallback or leave empty so they use "Other"
      } finally {
        setIsFetchingDepts(false);
      }
    }
  };

  // --- 2. Department Select Handler ---
  const handleDepartmentSelect = (e) => {
    const val = e.target.value;
    setSelectedDeptOption(val);
    if (val === "Other") {
      setFormData({ ...formData, department: "" }); // Clear so they can type
    } else {
      setFormData({ ...formData, department: val });
    }
  };

  const handleOptionSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const nextStep = step < mcqQuestions.length ? step + 1 : "REVIEW";
    setTimeout(() => setStep(nextStep), 300);
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        human_count: parseInt(formData.human_count),
        monthly_task_volume: parseInt(formData.monthly_task_volume),
        avg_task_duration_minutes: parseInt(formData.avg_task_duration_minutes),
        current_tools: [],
      };

      const res = await axios.post(
        "https://roi-backend-ggx3.onrender.com/calculate-roi",
        payload
      );
      setReportData(res.data);
      setStep("REPORT");
    } catch (err) {
      alert(
        "Error generating report. Ensure Backend is running. \n" + err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERING ---

  // Step 0: Input Form
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Zap className="text-blue-600" /> AI ROI Calculator
          </h1>
          <div className="space-y-5">
            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                name="organization_industry"
                value={formData.organization_industry}
                onChange={handleIndustryChange}
                className="w-full p-2.5 border rounded-lg bg-white"
              >
                <option value="">Select Industry...</option>
                {Object.keys(INDUSTRY_DATA).map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Size
              </label>
              <select
                name="company_size"
                value={formData.company_size}
                onChange={handleInputChange}
                className="w-full p-2.5 border rounded-lg bg-white"
              >
                <option value="">Select Size...</option>
                {COMPANY_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Department Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <div className="relative">
                <select
                  name="department_select"
                  value={selectedDeptOption}
                  onChange={handleDepartmentSelect}
                  disabled={!formData.organization_industry || isFetchingDepts}
                  className="w-full p-2.5 border rounded-lg bg-white disabled:bg-gray-100"
                >
                  <option value="">
                    {isFetchingDepts
                      ? "Asking GenFox AI..."
                      : formData.organization_industry
                      ? "Select Department..."
                      : "Select Industry First"}
                  </option>

                  {/* Generated Options */}
                  {generatedDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}

                  {/* Divider and Other */}
                  {generatedDepartments.length > 0 && (
                    <option disabled>──────────</option>
                  )}
                  <option value="Other">Other / Custom Role</option>
                </select>

                {isFetchingDepts && (
                  <div className="absolute right-8 top-3">
                    <Loader2 className="animate-spin text-blue-500" size={16} />
                  </div>
                )}
              </div>

              {/* Custom Input if "Other" is selected */}
              {selectedDeptOption === "Other" && (
                <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-medium text-blue-600 mb-1">
                    Enter Custom Department Name:
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g. specialized underwriting team..."
                    className="w-full p-2.5 border border-blue-300 rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-200"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tools & Operational Context
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="List the tools you use (e.g. Jira, Salesforce) and describe your main workflow challenges..."
                rows="4"
                className="w-full p-2.5 border rounded-lg bg-white resize-none"
              />
            </div>

            {/* Human Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Employees in Department
              </label>
              <input
                type="number"
                name="human_count"
                min="1"
                value={formData.human_count}
                onChange={handleInputChange}
                className="w-full p-2.5 border rounded-lg"
              />
            </div>

            <button
              onClick={() => {
                if (!formData.organization_industry || !formData.department) {
                  alert("Please fill in all required fields.");
                  return;
                }
                setStep(1);
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2 font-semibold shadow-md"
            >
              Start Assessment <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Steps 1-N: MCQ Wizard
  if (typeof step === "number" && step > 0 && step <= mcqQuestions.length) {
    const q = mcqQuestions[step - 1];
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                Section: {q.section}
              </span>
              <span className="text-xs text-gray-400">
                {step}/{mcqQuestions.length}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{q.question}</h2>
            <div className="w-full bg-gray-200 h-2 mt-4 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${(step / mcqQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-3">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(q.field, opt.value)}
                className="w-full text-left p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition duration-200 flex items-center justify-between group"
              >
                <span className="font-medium text-gray-700 group-hover:text-blue-800">
                  {opt.label}
                </span>
                <CheckCircle
                  className="text-transparent group-hover:text-blue-600 transition"
                  size={20}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Review Step
  if (step === "REVIEW") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Assessment Complete
          </h2>
          <p className="text-gray-600 mb-8">
            Gathered {Object.keys(formData).length} data points. Ready to
            analyze.
          </p>
          {loading ? (
            <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-xl shadow-lg">
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <p className="text-sm text-gray-500">Calculating ROI...</p>
            </div>
          ) : (
            <button
              onClick={generateReport}
              className="w-full bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-700 shadow-xl transition transform hover:scale-105"
            >
              Generate Detailed ROI Report
            </button>
          )}
        </div>
      </div>
    );
  }

  // Report Step
  if (step === "REPORT" && reportData) {
    return <ROIReport reportData={reportData} formData={formData} />;
  }

  return <div>Loading...</div>;
}

export default App;
