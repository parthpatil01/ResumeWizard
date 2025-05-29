import { Upload, FileText, Briefcase, TrendingUp, AlertCircle, CheckCircle, Sparkles, Target, Brain, Zap } from 'lucide-react';
import { useState } from 'react';

const App = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeText(e.target.result);
      };
      reader.readAsText(file);
    } else {
      setError('Please upload a plain text (.txt) file');
    }
  };

  const analyzeResume = async () => {
  if (!jobDescription.trim() || !resumeText.trim()) {
    setError('Please provide both job description and resume text');
    return;
  }

  setLoading(true);
  setError('');
  setResults(null);

  try {
    const API_URL = import.meta.env.VITE_API_URL;
    
    console.log('API_URL from env:', API_URL);
    
    if (!API_URL || API_URL === 'undefined') {
      throw new Error('VITE_API_URL environment variable is not set');
    }
    
    const fullUrl = `${API_URL}/analyze`;
    console.log('Making request to:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        job_description: jobDescription,
        resume_text: resumeText,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setResults(data);
  } catch (err) {
    console.error('Error details:', err);
    setError(`Failed to analyze resume: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-pink-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-4">
              Resume Wizard AI
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Unlock your career potential with AI-powered resume analysis and personalized optimization insights
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            {/* Job Description Input */}
            <div className="group">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/20">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl mr-4">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Job Description</h2>
                </div>
                <div className="relative">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here and watch the magic happen..."
                    className="w-full h-72 p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-200 hover:bg-white/10"
                  />
                  <div className="absolute bottom-4 right-4 text-slate-400 text-sm">
                    {jobDescription.length} characters
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Input */}
            <div className="group">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/20">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl mr-4">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Your Resume</h2>
                </div>

                <div className="relative">
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Or paste your resume text here for instant analysis..."
                    className="w-full h-72 p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-none transition-all duration-200 hover:bg-white/10"
                  />
                  <div className="absolute bottom-4 right-4 text-slate-400 text-sm">
                    {resumeText.length} characters
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Analyze Button */}
          <div className="text-center mb-8">
            <button
              onClick={analyzeResume}
              disabled={loading}
              className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 disabled:scale-100 disabled:shadow-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative flex items-center">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    <span className="text-lg">Analyzing Magic in Progress...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                    <span className="text-lg">Analyze with AI Power</span>
                    <Zap className="h-5 w-5 ml-2 group-hover:animate-bounce" />
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Enhanced Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-rose-900/50 to-red-900/50 backdrop-blur-lg border border-rose-500/50 text-rose-200 px-6 py-4 rounded-2xl mb-8 flex items-center shadow-lg">
              <div className="bg-rose-500 p-2 rounded-lg mr-4">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg">{error}</span>
            </div>
          )}

          {/* Enhanced Results */}
          {results && (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl mr-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Analysis Results</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Enhanced Match Score */}
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all">
                    <div className="flex items-center justify-center mb-4">
                      <Target className="h-6 w-6 text-white mr-2" />
                      <h3 className="text-xl font-bold text-white">Match Score</h3>
                    </div>
                    <div className={`text-6xl font-bold mb-4 bg-gradient-to-r ${getScoreGradient(results.score)} bg-clip-text text-transparent`}>
                      {results.score}%
                    </div>
                    <div className="relative">
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full bg-gradient-to-r ${getScoreGradient(results.score)} transition-all duration-1000 ease-out shadow-lg`}
                          style={{ width: `${results.score}%` }}
                        ></div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Missing Keywords */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-amber-400" />
                    Missing Keywords
                  </h3>
                  <div className="text-sm">
                    {results.missing_keywords === 'N/A' ? (
                      <div className="flex items-center text-emerald-400 font-medium text-lg">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Perfect match!
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {results.missing_keywords.split(',').map((keyword, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 text-amber-200 px-3 py-2 rounded-lg text-sm backdrop-blur-sm hover:from-amber-500/30 hover:to-orange-500/30 transition-all"
                          >
                            {keyword.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Quick Stats */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-cyan-400" />
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Job Description:</span>
                      <span className="font-bold text-white bg-cyan-500/20 px-3 py-1 rounded-lg">
                        {jobDescription.split(' ').length} words
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Resume:</span>
                      <span className="font-bold text-white bg-emerald-500/20 px-3 py-1 rounded-lg">
                        {resumeText.split(' ').length} words
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Suggestions */}
              <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 backdrop-blur-lg rounded-2xl p-8 border border-indigo-400/30">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Sparkles className="h-6 w-6 mr-3 text-yellow-400" />
                  AI-Powered Improvement Suggestions
                </h3>
                <div className="text-slate-200 leading-relaxed text-lg">
                  {results.suggestions === 'N/A' ? (
                    <div className="flex items-center text-emerald-400 font-medium">
                      <CheckCircle className="h-6 w-6 mr-3" />
                      <span className="text-xl">Outstanding! Your resume is already well-optimized.</span>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      {results.suggestions}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;