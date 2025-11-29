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
} from "lucide-react";
import { mcqQuestions } from "./questions";
import html2pdf from "html2pdf.js";

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
      {/* Floating Download Button */}
      <div className="fixed bottom-8 right-8 z-50 print:hidden">
        <button
          onClick={handleDownloadPDF}
          className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-slate-900 flex items-center gap-3 font-bold text-lg"
        >
          <Download size={20} /> Download PDF
        </button>
      </div>

      {/* Printable Document */}
      <div
        ref={componentRef}
        className="max-w-5xl mx-auto bg-white p-12 rounded-xl shadow-sm print:shadow-none"
      >
        {/* Header */}
        <div className="border-b pb-8 mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">
              ROI & Cost Analysis
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

        {/* Key Metrics Grid */}
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

        {/* Detailed Cost Breakdown Section */}
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
                    <td className="px-4 py-3">Benefits & Insurance (20-30%)</td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      $
                      {reportData.human_cost_breakdown.benefits_insurance?.toLocaleString() ||
                        "N/A"}
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
                    <td className="px-4 py-3">Software Licenses (Seats)</td>
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
                    <td className="px-4 py-3">Server & Vector DB Hosting</td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      $
                      {reportData.ai_cost_breakdown.server_hosting_costs?.toLocaleString() ||
                        0}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      Integration & Setup (Amortized)
                    </td>
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

        {/* Charts Row */}
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
              Hidden Risks Analysis
            </h4>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3">
                <ShieldAlert
                  className="text-amber-500 flex-shrink-0"
                  size={20}
                />
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-gray-800">Human Risk:</span>{" "}
                  High turnover ({formData.turnover_rate}) creates constant
                  knowledge gaps and retraining costs.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <Server className="text-blue-500 flex-shrink-0" size={20} />
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-gray-800">AI Risk:</span>{" "}
                  Requires supervision. We factored in{" "}
                  {reportData.ai_cost_breakdown.maintenance_cost
                    ? "$" +
                      reportData.ai_cost_breakdown.maintenance_cost.toLocaleString()
                    : ""}{" "}
                  for human oversight to prevent hallucinations.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-6 mt-8">
          <p className="text-xs text-gray-400 text-center">
            Calculations based on {formData.organization_industry} market rates
            (2024-2025). Salary data retrieved via Gemini AI search. Token costs
            estimated using GPT-4o / Claude 3.5 Sonnet equivalent pricing
            models.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- 2. MAIN APP COMPONENT ---
function App() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // --- Dynamic Form State ---
  const [formData, setFormData] = useState({
    organization_industry: "",
    company_size: "",
    department: "",
    current_tools: [],
    human_count: 5,
  });

  // Helper to get dropdown options
  const departments = formData.organization_industry
    ? INDUSTRY_DATA[formData.organization_industry]?.departments || []
    : [];

  const availableTools = formData.organization_industry
    ? INDUSTRY_DATA[formData.organization_industry]?.tools || []
    : [];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleTool = (tool) => {
    setFormData((prev) => {
      const exists = prev.current_tools.includes(tool);
      if (exists) {
        return {
          ...prev,
          current_tools: prev.current_tools.filter((t) => t !== tool),
        };
      } else {
        return { ...prev, current_tools: [...prev.current_tools, tool] };
      }
    });
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
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    organization_industry: e.target.value,
                    department: "",
                    current_tools: [],
                  });
                }}
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

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={!formData.organization_industry}
                className="w-full p-2.5 border rounded-lg bg-white disabled:bg-gray-100"
              >
                <option value="">
                  {formData.organization_industry
                    ? "Select Department..."
                    : "Select Industry First"}
                </option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Tools */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tools Used
              </label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-lg min-h-[60px] bg-gray-50">
                {availableTools.length > 0 ? (
                  availableTools.map((tool) => (
                    <button
                      key={tool}
                      onClick={() => toggleTool(tool)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                        formData.current_tools.includes(tool)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {tool}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">
                    Select Industry first
                  </span>
                )}
              </div>
            </div>

            {/* Human Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Employees
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

  // Step Review
  if (step === "REVIEW") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Assessment Complete
          </h2>
          <p className="text-gray-600 mb-8">
            We have gathered 15+ data points. Our AI CFO is now ready to
            generate a conservative, detailed cost analysis.
          </p>
          {loading ? (
            <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-xl shadow-lg">
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <div className="text-left space-y-2">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />{" "}
                  Retrieving market salaries...
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />{" "}
                  Calculating token consumption...
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />{" "}
                  Estimating server & vector DB costs...
                </p>
              </div>
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

  if (step === "REPORT" && reportData) {
    return <ROIReport reportData={reportData} formData={formData} />;
  }

  return <div>Loading...</div>;
}

export default App;
