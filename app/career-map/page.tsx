'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { MapPin, TrendingUp, Target, BookOpen, CheckCircle, Star, Award, ExternalLink, Clock, DollarSign, Bookmark } from 'lucide-react';

export default function CareerMapPage() {
  const [isEntering, setIsEntering] = useState(true);
  const [showAIGuidance, setShowAIGuidance] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [interests, setInterests] = useState('');
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [learningResources, setLearningResources] = useState<any[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [bookmarkedUrls, setBookmarkedUrls] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  // Load saved career path and bookmarks on mount
  useEffect(() => {
    loadSavedCareerPath();
    loadBookmarksFromLocalStorage();
  }, []);

  const loadBookmarksFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('bookmarkedResources');
      if (saved) {
        const urls = new Set<string>(JSON.parse(saved));
        setBookmarkedUrls(urls);
      }
    } catch (error) {
      console.error('Error loading bookmarks from localStorage:', error);
    }
  };

  const toggleBookmark = (resource: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔖 Toggling bookmark for:', resource.title);
    const isBookmarked = bookmarkedUrls.has(resource.url);
    console.log('📌 Currently bookmarked:', isBookmarked);
    
    // Load existing resources
    const savedResources = localStorage.getItem('bookmarkedResourcesDetails');
    let resources = savedResources ? JSON.parse(savedResources) : [];
    
    const newSet = new Set(bookmarkedUrls);
    
    if (isBookmarked) {
      // Remove bookmark
      console.log('🗑️ Removing bookmark');
      newSet.delete(resource.url);
      resources = resources.filter((r: any) => r.url !== resource.url);
    } else {
      // Add bookmark
      console.log('➕ Adding bookmark');
      newSet.add(resource.url);
      resources.push(resource);
    }
    
    // Save both URLs and full resource details
    localStorage.setItem('bookmarkedResources', JSON.stringify(Array.from(newSet)));
    localStorage.setItem('bookmarkedResourcesDetails', JSON.stringify(resources));
    console.log('💾 Saved to localStorage. Total bookmarks:', newSet.size);
    
    setBookmarkedUrls(newSet);
  };



  const loadSavedCareerPath = async () => {
    try {
      console.log('🔄 Loading saved career path...');
      const response = await fetch('/api/career-path');
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Received data:', data);
        
        if (data.careerPath) {
          console.log('✅ Found saved career:', data.careerPath.title);
          setSelectedCareer(data.careerPath);
          setShowAIGuidance(false);
        } else {
          console.log('ℹ️ No saved career path found');
        }
      } else {
        console.error('❌ Failed to load career path, status:', response.status);
      }
    } catch (error) {
      console.error('❌ Error loading saved career path:', error);
    }
  };



  const getAICareerSuggestions = async () => {
    try {
      setLoadingAI(true);
      
      const response = await fetch('/api/ai/career-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(data.suggestions || []);
        
        if (!data.suggestions || data.suggestions.length === 0) {
          alert('No career suggestions were generated. Please try again.');
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to get AI suggestions');
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      alert(`Failed to get AI career suggestions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSelectCareer = (career: any) => {
    // Batch state updates together
    setSelectedCareer(career);
    setShowAIGuidance(false);
    
    // Then save to database in the background (don't await)
    fetch('/api/career-path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ careerPath: career }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.careerPath) {
          // Update with the saved data that includes selectedAt timestamp
          setSelectedCareer(data.careerPath);
        }
      })
      .catch(error => {
        console.error('Error saving career path:', error);
      });
  };

  const getLearningResources = async () => {
    if (!selectedCareer) return;
    
    try {
      setLoadingResources(true);
      setShowResources(true);
      
      const response = await fetch('/api/ai/learning-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerTitle: selectedCareer.title,
          skills: selectedCareer.requiredSkills || []
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLearningResources(data.resources || []);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to get learning resources');
      }
    } catch (error) {
      console.error('❌ Error getting learning resources:', error);
      alert('Failed to get learning resources');
    } finally {
      setLoadingResources(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Course': return '🎓';
      case 'Tutorial': return '📚';
      case 'Documentation': return '📖';
      case 'Video': return '🎥';
      case 'Article': return '📝';
      case 'Book': return '📕';
      default: return '📌';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-amber-500/25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-[-10%] bottom-20 h-80 w-80 rounded-full bg-yellow-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-amber-400/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`mb-8 flex flex-col md:flex-row md:items-center gap-4 ${isEntering ? 'auth-panel-enter' : ''}`}>
          <div className="auth-panel flex-1 relative overflow-hidden group/panel">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-amber-500/5 to-yellow-500/5 opacity-0 group-hover/panel:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600 text-white shadow-xl shadow-yellow-500/40 group/icon flex-shrink-0">
                <MapPin className="h-8 w-8 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/50 to-amber-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/30 to-amber-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300"></div>
          </div>
              <div className="min-w-0 flex-1">
                <h1 className="auth-title text-4xl md:text-5xl font-bold animate-[floatUp_0.85s_ease-out]">
                  Career Map
                </h1>
                <p className="auth-subtitle mt-2">
                  {selectedCareer 
                    ? `Your personalized roadmap for ${selectedCareer.title}`
                    : 'Get AI-powered career recommendations based on your skills'}
                </p>
              </div>
            </div>
          </div>
          {selectedCareer && (
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to change your career path? Your current selection will be removed.')) {
                  setShowAIGuidance(true);
                  setSelectedCareer(null);
                  setShowResources(false);
                  setLearningResources([]);
                  // Remove saved career path
                  try {
                    await fetch('/api/career-path', { method: 'DELETE' });
                  } catch (error) {
                    console.error('Error removing career path:', error);
                  }
                }
              }}
              className="relative flex items-center justify-center gap-3 px-10 py-5 text-lg md:text-xl font-bold rounded-[2rem] border border-primary-500/50 bg-white/60 backdrop-blur-xl text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 group/btn flex-shrink-0 hover:scale-110 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500/70 hover:bg-white/80 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-[2rem]"></div>
              <Star className="w-6 h-6 md:w-7 md:h-7 relative z-10 group-hover/btn:rotate-180 group-hover/btn:scale-125 group-hover/btn:drop-shadow-lg group-hover/btn:drop-shadow-primary-500/50 transition-all duration-500" />
              <span className="relative z-10">Change Career Path</span>
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-1000"></div>
            </button>
          )}
        </div>

        {/* AI Career Guidance Section */}
        {showAIGuidance && !selectedCareer && (
          <div className="card mb-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">AI-Powered Career Guidance</h2>
                  <p className="text-secondary-600">Get personalized career recommendations based on your skills</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are your interests? (Optional)
                  </label>
                  <textarea
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g., I enjoy problem-solving, working with data, creating visual designs..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  onClick={getAICareerSuggestions}
                  disabled={loadingAI}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loadingAI ? (
                    <>
                      <div className="futuristic-loader" style={{ width: '20px', height: '20px' }}>
                        <div className="futuristic-loader-inner"></div>
                      </div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Star className="w-5 h-5" />
                      Get AI Career Suggestions
                    </>
                  )}
                </button>
              </div>

              {/* AI Suggestions */}
              {aiSuggestions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recommended Career Paths for You - Select One to Continue
                  </h3>
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="feature-card p-6 hover:shadow-xl transition-all"
                      style={{ '--float-delay': `${0.1 + index * 0.05}s` } as CSSProperties}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-2">
                            {suggestion.title}
                          </h4>
                          <p className="text-secondary-700 mb-3">{suggestion.description}</p>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                            <div className="text-center">
                              <div className="text-xl font-bold">{suggestion.matchScore}</div>
                              <div className="text-xs">Match</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900 mb-2">Why this matches you:</h5>
                          <ul className="space-y-1">
                            {suggestion.reasons?.slice(0, 3).map((reason: string, idx: number) => (
                              <li key={idx} className="text-sm text-secondary-700 flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900 mb-2">Key Details:</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-primary-500" />
                              <span className="text-secondary-700">Salary: {suggestion.salaryRange}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-primary-500" />
                              <span className="text-secondary-700">Growth: {suggestion.growthPotential}</span>
                            </div>
                          </div>
                        </div>
        </div>

                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-900 mb-2">Skills to develop:</h5>
                        <div className="flex flex-wrap gap-2">
                          {suggestion.requiredSkills?.map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
          </div>
          
                      <div className="pt-4 border-t border-gray-100">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectCareer(suggestion);
                          }}
                          className="btn-primary w-full"
                          type="button"
                        >
                          Select This Career Path
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Career Details */}
        {selectedCareer && (
          <div className="card mb-8 relative overflow-hidden group/card hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary-500/40 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_60%)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.15),transparent_60%)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" style={{ transitionDelay: '0.1s' }}></div>
            
            <div className="relative p-6 md:p-8 border-b border-white/40">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white shadow-xl shadow-primary-500/40 group/icon flex-shrink-0">
                    <Target className="h-7 w-7 md:h-8 md:w-8 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400/50 to-secondary-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-primary-400/30 to-secondary-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="feature-heading text-2xl md:text-3xl lg:text-4xl font-bold mb-1 break-words">{selectedCareer.title}</h2>
                    <p className="text-lg md:text-xl text-secondary-600">Your Personalized Career Roadmap</p>
                  </div>
                </div>
                {selectedCareer.selectedAt && (
                  <div className="flex-shrink-0 flex flex-col items-center md:items-end gap-2">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 text-green-700 text-base font-semibold shadow-lg shadow-green-500/20 backdrop-blur whitespace-nowrap">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      Saved
                    </span>
                    <p className="text-sm md:text-base text-secondary-600 font-medium whitespace-nowrap">
                      {new Date(selectedCareer.selectedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="relative p-6 md:p-8">
              <div className="mb-8">
                <h3 className="feature-heading text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">Career Overview</h3>
                <p className="text-base md:text-lg text-secondary-700 mb-6 leading-relaxed">{selectedCareer.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="relative p-5 md:p-6 rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-xl shadow-lg shadow-green-500/20 hover:scale-[1.03] md:hover:scale-[1.05] hover:shadow-xl hover:shadow-green-500/40 transition-all duration-500 group/metric flex flex-col h-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover/metric:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15),transparent_70%)] opacity-0 group-hover/metric:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative flex flex-col gap-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/40 group-hover/metric:scale-110 transition-transform duration-300 flex-shrink-0">
                          <Star className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                        <span className="text-sm md:text-base font-semibold text-gray-900">Match Score</span>
                      </div>
                      <p className="text-xs md:text-sm text-secondary-600 relative break-words">{selectedCareer.matchScore}</p>
                      
                      <div className="pt-3 md:pt-4 border-t border-green-500/20 mt-auto">
                        <h4 className="text-sm md:text-base font-bold text-gray-900 mb-2 md:mb-3">Based on your skills and interests</h4>
                        <p className="text-xs md:text-sm text-secondary-700 leading-relaxed line-clamp-4">{selectedCareer.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative p-5 md:p-6 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:scale-[1.03] md:hover:scale-[1.05] hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-500 group/metric flex flex-col h-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover/metric:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] opacity-0 group-hover/metric:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative flex flex-col gap-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/40 group-hover/metric:scale-110 transition-transform duration-300 flex-shrink-0">
                          <TrendingUp className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                        <span className="text-sm md:text-base font-semibold text-gray-900">Salary Range</span>
                      </div>
                      <p className="text-xs md:text-sm text-secondary-600 relative break-words">{selectedCareer.salaryRange}</p>
                      
                      <div className="pt-3 md:pt-4 border-t border-blue-500/20 mt-auto">
                        <h4 className="text-sm md:text-base font-bold text-gray-900 mb-2 md:mb-3">Why This Career Matches You</h4>
                        <ul className="space-y-2">
                          {selectedCareer.reasons?.map((reason: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-xs md:text-sm text-secondary-700 leading-relaxed flex-1">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="relative p-5 md:p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-xl shadow-lg shadow-purple-500/20 hover:scale-[1.03] md:hover:scale-[1.05] hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-500 group/metric flex flex-col h-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover/metric:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)] opacity-0 group-hover/metric:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative flex flex-col gap-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/40 group-hover/metric:scale-110 transition-transform duration-300 flex-shrink-0">
                          <Award className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                        <span className="text-sm md:text-base font-semibold text-gray-900">Growth Potential</span>
                      </div>
                      <p className="text-xs md:text-sm text-secondary-600 relative break-words">{selectedCareer.growthPotential}</p>
                      
                      <div className="pt-3 md:pt-4 border-t border-purple-500/20 mt-auto">
                        <h4 className="text-sm md:text-base font-bold text-gray-900 mb-2 md:mb-3">Skills You Need to Develop</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCareer.requiredSkills?.map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-700 border border-primary-500/40 shadow-md hover:scale-105 hover:shadow-lg hover:shadow-primary-500/30 hover:from-primary-500/30 hover:to-secondary-500/30 transition-all duration-300 cursor-default"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Learning Resources Section */}
        {selectedCareer && (
          <div className="card mb-8 relative overflow-hidden group/card hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary-500/40 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_60%)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative p-8 border-b border-white/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-xl shadow-blue-500/40 group/icon">
                    <BookOpen className="h-7 w-7 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 to-cyan-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <h3 className="feature-heading text-2xl md:text-3xl font-bold">AI-Curated Learning Resources</h3>
                    <p className="text-base text-secondary-600 mt-1">Personalized resources for {selectedCareer.title}</p>
                  </div>
                </div>
                <button 
                  onClick={getLearningResources}
                  disabled={loadingResources}
                  className="btn-primary flex items-center gap-2 px-6 py-3 group/btn"
                >
                  {loadingResources ? (
                    <>
                      <div className="futuristic-loader" style={{ width: '16px', height: '16px' }}>
                        <div className="futuristic-loader-inner"></div>
                      </div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Star className="w-5 h-5 group-hover/btn:rotate-180 transition-transform duration-500" />
                      {showResources ? 'Refresh Resources' : 'Get Resources'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {showResources && (
              <div className="relative p-8">
                {loadingResources ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="futuristic-loader mb-4" style={{ width: '48px', height: '48px' }}>
                      <div className="futuristic-loader-inner"></div>
                    </div>
                    <p className="text-lg text-secondary-600">AI is searching the internet for the best learning resources...</p>
                  </div>
                ) : learningResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {learningResources.map((resource, index) => {
                      const isBookmarked = bookmarkedUrls.has(resource.url);
                      return (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative feature-card p-6 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 block group/resource overflow-hidden"
                          style={{ '--float-delay': `${0.05 + index * 0.03}s` } as CSSProperties}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover/resource:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Bookmark Button */}
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleBookmark(resource, e);
                            }}
                            className={`absolute top-4 right-4 z-20 p-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-lg ${
                              isBookmarked
                                ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white hover:scale-110 hover:shadow-xl hover:shadow-yellow-500/40'
                                : 'bg-white/60 backdrop-blur border border-white/40 text-gray-400 hover:bg-white/80 hover:text-yellow-600 hover:scale-110 hover:shadow-xl'
                            }`}
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this resource'}
                          >
                            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </div>
            
                          <div className="relative flex items-start gap-4 mb-4 pr-14">
                            <span className="text-4xl">{getResourceIcon(resource.type)}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover/resource:text-primary-600 transition-colors duration-300 line-clamp-2">
                                {resource.title}
                              </h4>
                              <p className="text-sm text-secondary-600 mb-3 line-clamp-2 leading-relaxed">
                                {resource.description}
                              </p>
                            </div>
                            <ExternalLink className="w-5 h-5 text-gray-400 group-hover/resource:text-primary-600 group-hover/resource:scale-110 transition-all duration-300 flex-shrink-0 mt-1" />
                          </div>

                          <div className="relative flex flex-wrap items-center gap-2 mb-4">
                            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-700 border border-primary-500/40 shadow-md">
                              {resource.platform}
                            </span>
                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border shadow-md ${getDifficultyColor(resource.difficulty)}`}>
                              {resource.difficulty}
                            </span>
                            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/60 backdrop-blur text-gray-700 border border-white/40 shadow-md">
                              {resource.type}
                            </span>
                          </div>

                          <div className="relative flex items-center justify-between text-sm text-secondary-600">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1.5 font-medium">
                                <Clock className="w-4 h-4" />
                                {resource.estimatedTime}
                              </span>
                              <span className="flex items-center gap-1.5 font-medium">
                                {resource.isFree ? (
                                  <span className="text-green-600 font-bold">Free</span>
                                ) : (
                                  <>
                                    <DollarSign className="w-4 h-4" />
                                    Paid
                                  </>
                                )}
                              </span>
                            </div>
                            {resource.rating && (
                              <span className="flex items-center gap-1.5 font-semibold">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {resource.rating}
                              </span>
                            )}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-secondary-600">No resources found. Please try again.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Find a Mentor - Always visible */}
        {selectedCareer && (
          <div className="card mb-8 relative overflow-hidden group/card hover:scale-[1.01] hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15),transparent_60%)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/40 group/icon">
                  <Target className="h-7 w-7 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/50 to-emerald-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </div>
                <h3 className="feature-heading text-2xl md:text-3xl font-bold">Find a Mentor</h3>
              </div>
              <p className="text-lg text-secondary-600 mb-6 leading-relaxed">
                Connect with experienced {selectedCareer.title} professionals who can guide you in your career journey
              </p>
              <a 
                href={`/mentors?skills=${encodeURIComponent(selectedCareer.requiredSkills?.join(',') || '')}`}
                className="btn-primary w-full block text-center px-6 py-4 text-lg group/link"
              >
                <span className="flex items-center justify-center gap-2">
                  Find {selectedCareer.title} Mentors
                  <Target className="w-5 h-5 group-hover/link:scale-110 transition-transform duration-300" />
                </span>
              </a>
            </div>
          </div>
        )}

        {/* Other Resources */}
        {!selectedCareer && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Learning Resources</h3>
                </div>
                <p className="text-secondary-600 mb-4">
                  Select a career path to get AI-curated learning resources
                </p>
                <button className="btn-secondary w-full" disabled>
                  Select Career First
                </button>
            </div>
          </div>

            <div className="card">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Find a Mentor</h3>
                </div>
                <p className="text-secondary-600 mb-4">
                  Connect with experienced professionals in your field
                </p>
                <a 
                  href="/mentors"
                  className="btn-secondary w-full block text-center"
                >
                  Find Mentors
                </a>
        </div>
            </div>
        </div>
        )}
      </div>
    </div>
  );
}
