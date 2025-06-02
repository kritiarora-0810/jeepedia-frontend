import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { School, Filter, Search, AlertCircle, Check } from 'tabler-icons-react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#8ca87c', '#f97316', '#50483b'];
const SAFETY_COLORS = {
  Safety: '#8ca87c',
  Moderate: '#f97316',
  Ambitious: '#50483b'
};

const ComparisonModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#50483b]">
            {data.college1_name} vs {data.college2_name}
          </h2>
          <button
            onClick={onClose}
            className="text-[#50483b]/70 hover:text-[#50483b] text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-[#8ca87c]/10 p-4 rounded-lg">
            <h3 className="font-medium text-[#50483b] mb-2">Key Comparisons</h3>
            <ul className="list-disc pl-5 space-y-2 text-[#50483b]/80">
              {Array.isArray(data.comparison) ? (
                data.comparison.map((point, i) => (
                  <li key={i}>{point}</li>
                ))
              ) : (
                <li>{data.comparison}</li>
              )}
            </ul>
          </div>

          <div className="bg-[#f97316]/10 p-4 rounded-lg">
            <h3 className="font-medium text-[#50483b] mb-2">Final Recommendation</h3>
            <p className="text-[#50483b]/80">{data.recommendation}</p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-[#8ca87c] text-white rounded-md hover:bg-[#7d9770]"
          >
            Close Comparison
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const JeeRankPredictor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      localStorage.setItem('redirectAfterLogin', '/jee-predictor');
      navigate('/login-register');
    }
  }, [navigate]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    rank: '',
    percentile: '',
    name: '',
    gender: '',
    state: '',
    category: 'General',
    pwd: false,
    recommendations: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ 
    collegeType: 'all', 
    safetyLevel: 'all',
    searchQuery: ''
  });
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'percentile' && value && !validatePercentile(value)) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePercentile = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 100;
  };

  const nextStep = () => {
    if (step === 1) {
      const { rank, percentile } = formData;
      if (!rank && !percentile) {
        setError('Please enter either Rank or Percentile');
        return;
      }
      if (percentile && !validatePercentile(percentile)) {
        setError('Percentile must be between 0 and 100');
        return;
      }
    }
    if (step === 2) {
      const { name, gender, state, category } = formData;
      if (!name || !gender || !state || !category) {
        setError('Please fill in all personal details');
        return;
      }
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      state: formData.state,
      category: formData.category,
      pwd: formData.pwd ? 'Yes' : 'No',
      gender: formData.gender,
      ...(formData.rank && { rank: formData.rank }),
      ...(formData.percentile && { percentile: formData.percentile })
    };

    try {
      const response = await fetch('https://3a49-2405-201-5016-709a-a563-54ee-e3e7-9a63.ngrok-free.app/jeepedia/llm_prediction/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status == 403) {
        alert('You need to subscribe to use this feature');
        window.location.href = '/subscribe';
      }

      const data = await response.json();
      const responseData = data.data;

      setFormData(prev => ({
        ...prev,
        recommendations: responseData.predictions || [],
        rank: responseData.metadata?.parameters_used?.rank || ''
      }));

      nextStep();
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompare = async () => {
    if (selectedColleges.length !== 2) return;

    setIsComparing(true);
    try {
      const response = await fetch('https://3a49-2405-201-5016-709a-a563-54ee-e3e7-9a63.ngrok-free.app/jeepedia/compare_predicted/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          college1: selectedColleges[0],
          college2: selectedColleges[1]
        }),
      });

      if (!response.ok) throw new Error('Comparison failed');
      
      const data = await response.json();
      setComparisonData(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsComparing(false);
    }
  };

  const processData = (recommendations) => {
    if (!recommendations || !Array.isArray(recommendations)) return [];
    return recommendations.filter(college => {
      const matchesType = filters.collegeType === 'all' || 
        college.college_type?.toLowerCase() === filters.collegeType;
      const matchesSafety = filters.safetyLevel === 'all' || 
        college.safety_level === filters.safetyLevel;
      const matchesSearch = college.college_name?.toLowerCase().includes(
        filters.searchQuery.toLowerCase()
      );
      return matchesType && matchesSafety && matchesSearch;
    });
  };

  const getAdmissionStats = () => {
    if (!formData.recommendations || !Array.isArray(formData.recommendations)) return [];
    const stats = { Safety: 0, Moderate: 0, Ambitious: 0 };
    formData.recommendations.forEach(college => {
      if (college.safety_level && stats.hasOwnProperty(college.safety_level)) {
        stats[college.safety_level]++;
      }
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  };

  const CollegeCard = ({ college }) => {
    const isSelected = selectedColleges.some(c => c.college_name === college.college_name);
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`border rounded-lg p-4 mb-4 bg-white shadow-sm relative ${
          isSelected ? 'ring-2 ring-[#8ca87c]' : ''
        }`}
      >
        <button
          onClick={() => {
            setSelectedColleges(prev => {
              if (isSelected) {
                return prev.filter(c => c.college_name !== college.college_name);
              }
              return prev.length < 2 ? [...prev, college] : prev;
            });
          }}
          className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
            isSelected ? 'bg-[#8ca87c] text-white' : 'border border-[#50483b]/30 bg-white'
          }`}
        >
          {isSelected && <Check size={16} />}
        </button>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-[#50483b]">
                {college.college_name}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs 
                ${college.college_type === 'Government' ? 
                  'bg-[#8ca87c]/20 text-[#8ca87c]' : 
                  'bg-[#f97316]/20 text-[#f97316]'}`}
              >
                {college.college_type}
              </span>
            </div>
            <p className="text-sm text-[#50483b]/80 mb-2">
              {college.branch} • {college.location}
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${college.probability_percentage}%`,
                      backgroundColor: SAFETY_COLORS[college.safety_level]
                    }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {college.probability_percentage}%
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <School size={16} className="text-[#50483b]/60" />
                <span className="text-sm text-[#50483b]/80">
                  2023 Cutoff: Rank {college.cutoff_rank_2023}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-2 border-t border-dashed">
          <h4 className="text-sm font-medium text-[#50483b] mb-2">
            Key Factors
          </h4>
          <div className="flex flex-wrap gap-2">
            {college.factors?.map((factor, i) => (
              <span 
                key={i}
                className="px-2 py-1 bg-[#50483b]/10 text-[#50483b]/80 rounded-full text-xs"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderStep1 = () => (
    <Tooltip.Provider delayDuration={200}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${step === 1 ? 'block' : 'hidden'} space-y-6`}
      >
        <div className="relative">
          <label className="block text-sm font-medium text-[#8ca87c] mb-2">
            JEE Main Rank
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <span className="ml-2 cursor-help text-[#f97316]">❓</span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-[#50483b] text-white px-3 py-1 rounded shadow-md text-xs">
                  Enter your All India Rank from the JEE Main exam.
                  <Tooltip.Arrow className="fill-[#50483b]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </label>
          <input
            type="number"
            name="rank"
            value={formData.rank}
            onChange={handleChange}
            placeholder="Eg. 10345"
            className="w-full px-4 py-2 border border-[#50483b] rounded-md bg-[#50483b]/10 text-[#50483b] focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition-all duration-300"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-[#8ca87c] mb-2">
            JEE Main Percentile
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <span className="ml-2 cursor-help text-[#f97316]">❓</span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-[#50483b] text-white px-3 py-1 rounded shadow-md text-xs max-w-xs">
                  Percentile should be a number between 0 and 100 with up to 2 decimal places.
                  <Tooltip.Arrow className="fill-[#50483b]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </label>
          <input
            type="number"
            name="percentile"
            value={formData.percentile}
            onChange={handleChange}
            placeholder="Eg. 98.52"
            min="0"
            max="100"
            step="0.01"
            className="w-full px-4 py-2 border border-[#50483b] rounded-md bg-[#50483b]/10 text-[#50483b] focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition-all duration-300"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={nextStep}
            disabled={!formData.rank && !formData.percentile}
            className="px-4 py-2 bg-[#f97316] text-white rounded-md hover:bg-[#e56712] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 flex items-center gap-1 transition-all disabled:opacity-50"
          >
            Next <span>→</span>
          </motion.button>
        </div>
      </motion.div>
    </Tooltip.Provider>
  );

  const renderStep2 = () => (
    <div className={`${step === 2 ? 'block' : 'hidden'} space-y-6 animate-fadeIn`}>
      <div>
        <label className="block text-sm font-medium text-[#8ca87c] mb-2">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="w-full px-4 py-2 border border-[#50483b] rounded-md bg-[#50483b]/10 text-[#50483b] focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#8ca87c] mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#50483b] rounded-md bg-[#50483b]/10 text-[#50483b] focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#8ca87c] mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#50483b] rounded-md bg-[#50483b]/10 text-[#50483b] focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
            required
          >
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#8ca87c] mb-2">State</label>
        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[#50483b] rounded-md bg-[#50483b]/10 text-[#50483b] focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
          required
        >
          <option value="">Select State</option>
          <option value="Delhi">Delhi</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="West Bengal">West Bengal</option>
          <option value="Telangana">Telangana</option>
          <option value="Gujrat">Gujrat</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="pwd"
          checked={formData.pwd}
          onChange={e => setFormData(prev => ({...prev, pwd: e.target.checked}))}
          className="rounded border-[#50483b]/30"
        />
        <label className="text-sm text-[#50483b]/80">
          Person with Disability (PWD)
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 border border-[#8ca87c] text-[#8ca87c] rounded-md hover:bg-[#8ca87c]/10 focus:outline-none focus:ring-2 focus:ring-[#8ca87c] focus:ring-offset-2"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-4 py-2 bg-[#8ca87c] text-[#50483b] font-medium rounded-md hover:bg-[#7d9770] focus:outline-none focus:ring-2 focus:ring-[#8ca87c] focus:ring-offset-2 disabled:opacity-75 flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#50483b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : 'Get Recommendations'}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const filteredData = processData(formData.recommendations);
    const statsData = getAdmissionStats();

    return (
      <div className={`${step === 3 ? 'block' : 'hidden'} space-y-8`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#50483b] mb-2">
            Admission Overview
          </h2>
          <p className="text-[#50483b]/70">
            Based on your JEE {formData.rank ? `Rank ${formData.rank}` : `${formData.percentile}%ile`}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <h3 className="text-sm font-medium text-[#50483b]/70 mb-2">
              Total Colleges
            </h3>
            <p className="text-3xl font-bold text-[#50483b]">
              {formData.recommendations.length}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <h3 className="text-sm font-medium text-[#50483b]/70 mb-2">
              Average Probability
            </h3>
            <p className="text-3xl font-bold text-[#50483b]">
              {formData.recommendations.length > 0 ? 
                Math.round(
                  formData.recommendations.reduce((acc, curr) => 
                    acc + (curr.probability_percentage || 0), 0
                  ) / formData.recommendations.length
                ) : 0}%
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <h3 className="text-sm font-medium text-[#50483b]/70 mb-2">
              Government vs Private
            </h3>
            <div className="flex gap-4 items-center">
              <PieChart width={80} height={80}>
                <Pie
                  data={[
                    { name: 'Govt', value: formData.recommendations.filter(c => c.college_type === 'Government').length },
                    { name: 'Private', value: formData.recommendations.filter(c => c.college_type === 'Private').length }
                  ]}
                  cx={40}
                  cy={40}
                  innerRadius={25}
                  outerRadius={35}
                >
                  <Cell fill="#8ca87c" />
                  <Cell fill="#f97316" />
                </Pie>
              </PieChart>
            </div>
          </div>
        </div>

        {/* <div className="bg-white p-4 rounded-xl shadow-sm border">
          <h3 className="text-sm font-medium text-[#50483b]/70 mb-4">
            Admission Safety Level Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SAFETY_COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        <div className="flex flex-wrap gap-4 items-center bg-[#8ca87c]/10 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[#50483b]/60" />
            <select
              className="px-3 py-2 rounded-md bg-white border text-sm"
              onChange={e => setFilters(prev => ({...prev, collegeType: e.target.value}))}
            >
              <option value="all">All Types</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
            </select>
          </div>
          
          {/* <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 rounded-md bg-white border text-sm"
              onChange={e => setFilters(prev => ({...prev, safetyLevel: e.target.value}))}
            >
              <option value="all">All Safety Levels</option>
              <option value="Safety">Safety</option>
              <option value="Moderate">Moderate</option>
              <option value="Ambitious">Ambitious</option>
            </select>
          </div> */}
          
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Search size={18} className="text-[#50483b]/60" />
            <input
              type="text"
              placeholder="Search colleges..."
              className="px-3 py-2 rounded-md bg-white border w-full text-sm"
              onChange={e => setFilters(prev => ({...prev, searchQuery: e.target.value}))}
            />
          </div>

          {selectedColleges.length > 0 && (
            <button
              onClick={() => setSelectedColleges([])}
              className="px-3 py-2 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200"
            >
              Clear Selection
            </button>
          )}
        </div>

        <AnimatePresence>
          {filteredData.length > 0 ? (
            filteredData.map((college, index) => (
              <CollegeCard key={`${college.college_name}-${index}`} college={college} />
            ))
          ) : (
            <div className="text-center py-12 text-[#50483b]/60">
              No colleges match your filters
            </div>
          )}
        </AnimatePresence>

        {selectedColleges.length === 2 && (
          <div className="fixed bottom-4 right-4 z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleCompare}
              disabled={isComparing}
              className="px-6 py-3 bg-[#f97316] text-white rounded-full shadow-lg flex items-center gap-2"
            >
              {isComparing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Comparing...
                </>
              ) : (
                `Compare ${selectedColleges[0].college_name} vs ${selectedColleges[1].college_name}`
              )}
            </motion.button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 border border-[#8ca87c] text-[#8ca87c] rounded-md hover:bg-[#8ca87c]/10 focus:outline-none focus:ring-2 focus:ring-[#8ca87c] focus:ring-offset-2"
          >
            ← Back to Form
          </button>
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setFormData(prev => ({
                ...prev,
                recommendations: []
              }));
              setSelectedColleges([]);
            }}
            className="px-4 py-2 bg-[#f97316] text-white rounded-md hover:bg-[#e56712] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
          >
            Start New Prediction
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-center text-[#50483b] mb-2">JEE College Predictor</h1>
            <p className="text-center text-[#50483b]/70 mb-8">Discover your best college matches based on JEE Main performance</p>

            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <button
                    type="button"
                    onClick={() => stepNumber < step && setStep(stepNumber)}
                    className="flex flex-col items-center focus:outline-none"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      step >= stepNumber ? 'bg-[#f97316] text-white' : 'bg-[#50483b]/10 text-[#50483b]'
                    }`}>
                      {stepNumber}
                    </div>
                    <span className={`text-sm mt-2 ${
                      step >= stepNumber ? 'text-[#f97316] font-medium' : 'text-[#50483b]/70'
                    }`}>
                      {stepNumber === 1 ? 'Scores' : stepNumber === 2 ? 'Details' : 'Results'}
                    </span>
                  </button>

                  {stepNumber < 3 && (
                    <div className={`flex-1 h-1 mx-4 transition-colors ${
                      step > stepNumber ? 'bg-[#f97316]' : 'bg-[#50483b]/10'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <form className="space-y-6">
              {renderStep1()}
              {renderStep2()}
              {renderStep3()}
            </form>
          </div>
        </div>
      </div>

      {comparisonData && (
        <ComparisonModal 
          data={comparisonData} 
          onClose={() => {
            setComparisonData(null);
            setSelectedColleges([]);
          }}
        />
      )}
      <Footer />
    </div>
  );
};

export default JeeRankPredictor;