import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Heart, Send, Upload, Shield, Lock, Eye, Star, CheckCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSlamBooks } from '@/hooks/useSlamBooks';
import { useResponses } from '@/hooks/useResponses';
import { SlamBook, Question } from '@/types/database';

const SlamBookShare = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSlamBookBySlug } = useSlamBooks();
  const { submitResponse, loading: submitting } = useResponses();
  
  const [slamBook, setSlamBook] = useState<SlamBook | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [respondentName, setRespondentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (id) {
      loadSlamBook();
    }
  }, [id]);

  useEffect(() => {
    // Update completed questions
    const completed = new Set<string>();
    Object.entries(responses).forEach(([questionId, response]) => {
      if (response && response !== '' && response !== 0) {
        completed.add(questionId);
      }
    });
    setCompletedQuestions(completed);
  }, [responses]);

  const loadSlamBook = async () => {
    try {
      setLoading(true);
      const data = await getSlamBookBySlug(id!);
      setSlamBook(data.slamBook);
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error loading slam book:', error);
      setError('Slam book not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slamBook) return;

    // Validate required fields
    const requiredQuestions = questions.filter(q => q.required);
    const missingResponses = requiredQuestions.filter(q => !responses[q.id]);
    
    if (missingResponses.length > 0) {
      alert('Please answer all required questions');
      return;
    }

    try {
      const answers = Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer,
        type: questions.find(q => q.id === questionId)?.type || 'text'
      }));

      await submitResponse({
        slamBookId: slamBook.id,
        respondentName: respondentName || undefined,
        answers
      });

      // Redirect to thank you page or show success message
      alert('Thank you for your response! 💕');
      navigate('/');
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const updateResponse = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  // Convert file to base64 data URL
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (questionId: string, file: File) => {
    // Set uploading state
    setUploadingFiles(prev => new Set(prev).add(questionId));
    
    try {
      // Check file size (limit to 5MB for base64 storage)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      // Convert file to base64
      const base64Data = await convertFileToBase64(file);
      
      // Store the base64 data URL along with file metadata
      updateResponse(questionId, {
        data: base64Data,
        name: file.name,
        type: file.type,
        size: file.size
      });
      
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process file. Please try again.');
    } finally {
      // Remove uploading state
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  };

  const renderQuestion = (question: Question) => {
    const value = responses[question.id] || '';

    switch (question.type) {
      case 'text':
        return (
          <div className="group">
            <Input
              placeholder="Your answer..."
              value={value}
              onChange={(e) => updateResponse(question.id, e.target.value)}
              className="transition-all duration-300 border-gray-200 focus:border-purple-400 focus:ring-purple-200 hover:border-purple-300 text-base"
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div className="group">
            <Textarea
              placeholder="Share your thoughts..."
              value={value}
              onChange={(e) => updateResponse(question.id, e.target.value)}
              rows={4}
              className="transition-all duration-300 border-gray-200 focus:border-purple-400 focus:ring-purple-200 hover:border-purple-300 text-base resize-none"
            />
          </div>
        );
      
      case 'select':
        return (
          <div className="group">
            <select
              value={value}
              onChange={(e) => updateResponse(question.id, e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 hover:border-purple-300 text-base bg-white"
            >
              <option value="">Select an option...</option>
              {question.options?.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      
      case 'file':
      case 'image':
        const isUploading = uploadingFiles.has(question.id);
        const fileData = value?.data ? value : null;
        
        return (
          <div className="space-y-4">
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 hover:border-purple-400 hover:bg-purple-50/50 ${
              fileData ? 'border-green-300 bg-green-50/30' : 'border-gray-300 bg-gray-50/30'
            }`}>
              <div className="flex flex-col items-center space-y-3">
                <div className={`p-3 rounded-full transition-all duration-300 ${
                  fileData ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-700 mb-1">
                    {question.type === 'image' ? 'Upload an image' : 'Upload a file'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Maximum file size: 5MB
                  </p>
                </div>
                <input
                  type="file"
                  accept={question.type === 'image' ? 'image/*' : '*'}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(question.id, file);
                    }
                  }}
                  className="hidden"
                  id={`file-${question.id}`}
                  disabled={isUploading}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => document.getElementById(`file-${question.id}`)?.click()}
                  type="button"
                  disabled={isUploading}
                  className="transition-all duration-300 hover:scale-105 border-purple-200 hover:border-purple-400 hover:bg-purple-50"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>Choose {question.type === 'image' ? 'Image' : 'File'}</>
                  )}
                </Button>
              </div>
            </div>
            
            {fileData && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                {question.type === 'image' && fileData.type?.startsWith('image/') ? (
                  <div className="space-y-3">
                    <div className="relative group">
                      <img 
                        src={fileData.data} 
                        alt="Uploaded" 
                        className="max-w-full h-auto max-h-64 rounded-xl border shadow-lg transition-transform duration-300 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-xl"></div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {fileData.name} • {(fileData.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-base font-medium text-green-800">
                          File uploaded successfully!
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                          {fileData.name} • {(fileData.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => updateResponse(question.id, '')}
                  className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
                  type="button"
                >
                  Remove File
                </Button>
              </div>
            )}
          </div>
        );
      
      case 'rating':
        return (
          <div className="flex gap-2 justify-center sm:justify-start">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => updateResponse(question.id, star)}
                className={`text-3xl sm:text-4xl transition-all duration-300 hover:scale-110 ${
                  (value || 0) >= star 
                    ? 'text-yellow-400 drop-shadow-lg' 
                    : 'text-gray-300 hover:text-yellow-200'
                }`}
              >
                <Star className={`h-8 w-8 sm:h-10 sm:w-10 ${(value || 0) >= star ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full bg-purple-100 animate-ping opacity-20"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Memory Book</h2>
          <p className="text-gray-500">Preparing your magical experience...</p>
        </div>
      </div>
    );
  }

  if (error || !slamBook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Memory Book Not Found</h2>
            <p className="text-gray-600 mb-6">The memory book you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => navigate('/')} 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const themeClasses = {
    'gradient-sunset': 'from-orange-400 to-pink-600',
    'gradient-ocean': 'from-blue-400 to-teal-600',
    'gradient-forest': 'from-green-400 to-blue-600',
    'gradient-purple': 'from-purple-400 to-pink-600',
  };

  const progressPercentage = questions.length > 0 ? (completedQuestions.size / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 ease-out" 
             style={{ width: `${progressPercentage}%` }}></div>
        <div className="px-4 py-2 text-center">
          <p className="text-sm text-gray-600">
            Progress: {completedQuestions.size} of {questions.length} questions completed
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pt-20">
        {/* Header */}
        <div className="animate-in slide-in-from-top-6 duration-800">
          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-2xl mb-8 overflow-hidden">
            <CardContent className="p-0">
              <div className={`bg-gradient-to-r ${themeClasses[slamBook.theme as keyof typeof themeClasses] || themeClasses['gradient-sunset']} text-white relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="relative p-6 sm:p-8">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-3">{slamBook.title}</h1>
                  <p className="opacity-90 text-lg">A collection of memories waiting to be filled</p>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                {slamBook.description && (
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">{slamBook.description}</p>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-2 text-pink-600">
                    <Heart className="h-5 w-5 animate-pulse" />
                    <span className="font-medium">Fill this out with love and honesty!</span>
                  </div>
                  
                  {/* Privacy Notice */}
                  <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700 font-medium">Encrypted & Private</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Information */}
        <div className="animate-in slide-in-from-bottom-4 duration-800 delay-200 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Your Privacy is Protected</h3>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    All your responses are encrypted in our database and only visible to the memory book owner. 
                    Your personal information is never shared or sold to third parties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Respondent Name */}
          <div className="animate-in slide-in-from-left-4 duration-800 delay-300">
            <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <Label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  What's your name? (Optional)
                </Label>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Your name..."
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  className="text-base border-gray-200 focus:border-purple-400 focus:ring-purple-200 transition-all duration-300"
                />
              </CardContent>
            </Card>
          </div>

          {questions.map((question, index) => (
            <div 
              key={question.id} 
              className="animate-in slide-in-from-right-4 duration-800"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <Card className={`bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
                completedQuestions.has(question.id) ? 'ring-2 ring-green-200 bg-green-50/50' : ''
              }`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                          completedQuestions.has(question.id) 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {completedQuestions.has(question.id) ? '✓' : index + 1}
                        </div>
                        <Label className="text-lg font-semibold text-gray-900 leading-relaxed">
                          {question.question}
                        </Label>
                      </div>
                      {question.required && (
                        <div className="flex items-center gap-1 text-red-500 text-sm ml-11">
                          <span>*</span>
                          <span>Required</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderQuestion(question)}
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Submit Button */}
          <div className="animate-in slide-in-from-bottom-6 duration-800 delay-500">
            <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <Button 
                    type="submit" 
                    disabled={submitting || uploadingFiles.size > 0}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Submitting your memories...
                      </>
                    ) : uploadingFiles.size > 0 ? (
                      <>
                        <div className="animate-pulse mr-2">📤</div>
                        Processing files...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Submit My Response
                      </>
                    )}
                  </Button>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Your response will be shared with the memory book owner
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-green-600">
                      <Shield className="h-3 w-3" />
                      <span>All data encrypted and secure</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlamBookShare;