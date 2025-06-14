
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Eye, Calendar, User, Heart, Star, Sparkles, BookOpen, Users, Share2, Printer, FileDown, Image as ImageIcon } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResponses } from '@/hooks/useResponses';
import { useSlamBooks } from '@/hooks/useSlamBooks';
import { SlamBook, Question } from '@/types/database';

const ViewResponses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSlamBookBySlug } = useSlamBooks();
  const { getResponses } = useResponses();
  
  const [slamBook, setSlamBook] = useState<SlamBook | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportMode, setExportMode] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const slamBookData = await getSlamBookBySlug(id!);
      setSlamBook(slamBookData.slamBook);
      setQuestions(slamBookData.questions);
      
      const responsesData = await getResponses(slamBookData.slamBook.id);
      setResponses(responsesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    setExportMode(true);
    setTimeout(() => {
      window.print();
      setExportMode(false);
    }, 100);
  };

  const handleDownloadPDF = () => {
    setExportMode(true);
    setTimeout(() => {
      window.print();
      setExportMode(false);
    }, 100);
  };

  // Helper function to process image URL/data
  const processImageUrl = (fileUrl: string) => {
    if (fileUrl.startsWith('data:')) {
      return fileUrl;
    }
    
    try {
      const parsed = JSON.parse(fileUrl);
      if (parsed.data && typeof parsed.data === 'string' && parsed.data.startsWith('data:')) {
        return parsed.data;
      }
    } catch (e) {
      // Not JSON, continue with original processing
    }
    
    return fileUrl;
  };

  const getAnswerForQuestion = (response: any, questionId: string) => {
    const answer = response.answers?.find((a: any) => a.question_id === questionId);
    if (!answer) return null;

    if (answer.file_url) {
      const processedImageUrl = processImageUrl(answer.file_url);
      
      return (
        <div className="mt-6 memory-photo-container">
          <div className="photo-polaroid">
            <img 
              src={processedImageUrl} 
              alt="Memory" 
              className="memory-image"
              onError={(e) => {
                console.error('Image failed to load:', processedImageUrl);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const errorDiv = target.parentElement?.querySelector('.image-error') as HTMLElement;
                if (errorDiv) {
                  errorDiv.style.display = 'flex';
                }
              }}
            />
            <div className="image-error" style={{ display: 'none' }}>
              <div className="flex items-center justify-center h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <span className="text-gray-500 text-sm font-medium">Image not available</span>
                </div>
              </div>
            </div>
            <div className="polaroid-caption">
              <p className="text-sm text-gray-600 font-handwriting">A precious memory 📸</p>
            </div>
          </div>
        </div>
      );
    }

    if (answer.answer_number !== null) {
      return (
        <div className="mt-6">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-7 h-7 transition-all duration-300 ${
                    star <= answer.answer_number 
                      ? 'text-amber-500 fill-amber-500 drop-shadow-sm' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="ml-4 px-4 py-2 bg-white rounded-full shadow-sm">
              <span className="text-lg font-bold text-amber-600">
                {answer.answer_number}/5
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-6">
        <div className="memory-text-card">
          <div className="memory-text-content">
            <p className="text-gray-800 leading-relaxed text-base font-medium">
              {answer.answer_text || 'No answer provided'}
            </p>
          </div>
          <div className="memory-text-decoration"></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-pink-200 border-b-pink-600 mx-auto animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 text-xl font-semibold">Loading Beautiful Memories...</p>
            <p className="text-gray-500">Preparing your memory book</p>
          </div>
        </div>
      </div>
    );
  }

  if (!slamBook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 to-cyan-100 flex items-center justify-center p-4">
        <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-2xl max-w-md w-full rounded-3xl overflow-hidden">
          <CardContent className="p-12 text-center">
            <div className="text-8xl mb-8">📚</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Memory Book Not Found
            </h2>
            <p className="text-gray-600 mb-8 text-lg">The memory album you're looking for doesn't exist.</p>
            <Button 
              onClick={() => navigate('/')} 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const themeClasses = {
    'gradient-sunset': 'from-orange-400 via-pink-500 to-red-600',
    'gradient-ocean': 'from-blue-500 via-cyan-500 to-teal-600',
    'gradient-forest': 'from-green-500 via-emerald-500 to-blue-600',
    'gradient-purple': 'from-purple-500 via-violet-500 to-pink-600',
  };

  return (
    <div className={`min-h-screen ${exportMode ? 'bg-white' : 'bg-gradient-to-br from-violet-100 via-pink-50 to-cyan-100'}`}>
      {/* Floating Header */}
      <div className={`sticky top-0 z-50 px-4 sm:px-6 py-4 backdrop-blur-md border-b shadow-lg transition-all duration-300 ${exportMode ? 'print:hidden' : 'bg-white/90 border-white/20'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="hover:bg-purple-50 rounded-2xl p-3 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2 text-purple-600" />
              <span className="hidden sm:inline text-purple-700 font-semibold">Dashboard</span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {slamBook.title}
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">Memory Collection</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/s/${slamBook.slug}`)} 
              className="bg-white/90 hover:bg-white border-purple-200 hover:border-purple-300 rounded-2xl px-4 sm:px-6 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Share2 className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDownloadPDF} 
              className="bg-white/90 hover:bg-white border-purple-200 hover:border-purple-300 rounded-2xl px-4 sm:px-6 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <FileDown className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
            <Button 
              onClick={handlePrint} 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl px-4 sm:px-6 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Printer className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Print</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Beautiful Album Cover */}
        <div className="memory-book-cover mb-16">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl overflow-hidden rounded-3xl transform hover:scale-[1.02] transition-transform duration-500">
            <div className={`bg-gradient-to-r ${themeClasses[slamBook.theme as keyof typeof themeClasses] || themeClasses['gradient-sunset']} text-white p-12 sm:p-16 relative overflow-hidden`}>
              {/* Decorative Background Elements */}
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32 animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 animate-bounce"></div>
              
              <div className="relative z-10 text-center">
                <div className="flex justify-center mb-8">
                  <div className="p-6 bg-white/20 rounded-3xl backdrop-blur-sm shadow-2xl">
                    <Heart className="h-16 w-16 text-white animate-pulse" />
                  </div>
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold mb-4 drop-shadow-lg">
                  {slamBook.title}
                </h1>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Sparkles className="h-6 w-6 text-white/90 animate-spin" />
                  <span className="text-xl text-white/90 font-medium">A Collection of Beautiful Memories</span>
                  <Sparkles className="h-6 w-6 text-white/90 animate-spin" />
                </div>
                {slamBook.description && (
                  <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                    {slamBook.description}
                  </p>
                )}
              </div>
            </div>
            
            <CardContent className="p-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center p-6 bg-gradient-to-br from-violet-50 to-violet-100 rounded-3xl transform hover:scale-105 transition-transform duration-300 shadow-lg">
                  <div className="text-4xl font-bold text-violet-600 mb-3">{responses.length}</div>
                  <div className="text-sm text-gray-600 font-semibold flex items-center justify-center gap-2">
                    <Users className="h-5 w-5" />
                    Beautiful Stories
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl transform hover:scale-105 transition-transform duration-300 shadow-lg">
                  <div className="text-4xl font-bold text-emerald-600 mb-3">{questions.length}</div>
                  <div className="text-sm text-gray-600 font-semibold flex items-center justify-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Questions Asked
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl transform hover:scale-105 transition-transform duration-300 shadow-lg">
                  <div className="text-4xl font-bold text-blue-600 mb-3">{slamBook.view_count}</div>
                  <div className="text-sm text-gray-600 font-semibold flex items-center justify-center gap-2">
                    <Eye className="h-5 w-5" />
                    Total Views
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl transform hover:scale-105 transition-transform duration-300 shadow-lg">
                  <div className="text-4xl font-bold text-pink-600 mb-3">
                    {new Date(slamBook.created_at).getFullYear()}
                  </div>
                  <div className="text-sm text-gray-600 font-semibold flex items-center justify-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Year Created
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Memory Pages */}
        {responses.length === 0 ? (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-16 sm:p-24 text-center">
              <div className="text-9xl mb-10 animate-bounce">📖</div>
              <h3 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
                Your Memory Book Awaits
              </h3>
              <p className="text-gray-600 text-xl sm:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Share your memory book link to start collecting beautiful memories and heartfelt stories from friends and family!
              </p>
              <Button 
                onClick={() => navigate(`/s/${slamBook.slug}`)} 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xl px-12 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Sparkles className="h-6 w-6 mr-3" />
                Start Collecting Memories
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-16">
            {responses.map((response, responseIndex) => (
              <div key={response.id} className="memory-story-page">
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl overflow-hidden rounded-3xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.01]">
                  <CardHeader className="bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50 border-b-2 border-white/50 p-8">
                    <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                            {responseIndex + 1}
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            {response.respondent_name ? `${response.respondent_name}'s Story` : `Anonymous Story ${responseIndex + 1}`}
                          </h3>
                          <div className="flex items-center gap-3 text-gray-600">
                            <Calendar className="h-5 w-5" />
                            <span className="font-medium text-lg">
                              {new Date(response.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-pink-100 to-red-100 rounded-3xl shadow-lg">
                        <Heart className="h-8 w-8 text-pink-600 animate-pulse" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-10 sm:p-12">
                    <div className="space-y-12">
                      {questions.map((question, questionIndex) => (
                        <div key={question.id} className="memory-question-block">
                          <div className="flex items-start gap-8 mb-8">
                            <div className="flex-shrink-0 mt-2">
                              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {questionIndex + 1}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
                                {question.question}
                              </h4>
                              <div className="ml-4">
                                {getAnswerForQuestion(response, question.id) || (
                                  <div className="memory-no-answer">
                                    <p className="text-gray-500 italic font-medium">No answer provided</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {questionIndex < questions.length - 1 && (
                            <div className="border-b-2 border-gradient-to-r from-purple-100 to-pink-100 mt-10"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
        
        .font-handwriting {
          font-family: 'Dancing Script', cursive;
        }
        
        /* Memory Photo Styles */
        .memory-photo-container {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }
        
        .photo-polaroid {
          background: linear-gradient(145deg, #ffffff, #f8f9fa);
          padding: 20px 20px 60px 20px;
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
          transform: rotate(-1deg);
          transition: transform 0.3s ease;
          max-width: 350px;
          border: 1px solid #e9ecef;
          position: relative;
        }
        
        .photo-polaroid:hover {
          transform: rotate(0deg) scale(1.05);
        }
        
        .memory-image {
          width: 100%;
          height: auto;
          max-height: 280px;
          object-fit: cover;
          border-radius: 4px;
          display: block;
        }
        
        .polaroid-caption {
          position: absolute;
          bottom: 8px;
          left: 20px;
          right: 20px;
          text-align: center;
        }
        
        /* Memory Text Card Styles */
        .memory-text-card {
          position: relative;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 2px solid #e2e8f0;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .memory-text-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }
        
        .memory-text-content {
          position: relative;
          z-index: 2;
        }
        
        .memory-text-decoration {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #f472b6, #a855f7);
          border-radius: 50%;
          opacity: 0.1;
        }
        
        .memory-text-decoration::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          width: 20px;
          height: 20px;
          background: linear-gradient(45deg, #06b6d4, #3b82f6);
          border-radius: 50%;
        }
        
        /* No Answer Styles */
        .memory-no-answer {
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border: 2px dashed #d1d5db;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
        }
        
        /* Print Styles */
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          @page {
            margin: 0.75in;
            size: A4;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          /* Enhanced photo styling for print */
          .memory-photo-container {
            break-inside: avoid;
            page-break-inside: avoid;
            margin: 1.5rem 0;
          }
          
          .photo-polaroid {
            transform: none !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
            border: 2px solid #e5e7eb !important;
          }
          
          .memory-image {
            border: 1px solid #d1d5db !important;
          }
          
          /* Memory card styling for print */
          .memory-story-page {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 2rem;
          }
          
          .memory-question-block {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .memory-text-card {
            border: 2px solid #d1d5db !important;
            box-shadow: none !important;
            background: #f9fafb !important;
          }
          
          /* Book cover for print */
          .memory-book-cover {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          /* Ensure all elements have proper spacing */
          * {
            color-adjust: exact !important;
          }
        }
        
        /* Responsive Design */
        @media (max-width: 640px) {
          .photo-polaroid {
            max-width: 280px;
            padding: 15px 15px 50px 15px;
          }
          
          .memory-text-card {
            padding: 1.5rem;
          }
        }
        
        /* Animation Classes */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .memory-story-page {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .memory-story-page:nth-child(even) .photo-polaroid {
          transform: rotate(1deg);
        }
        
        .memory-story-page:nth-child(odd) .photo-polaroid {
          transform: rotate(-1deg);
        }
      `}</style>
    </div>
  );
};

export default ViewResponses;
