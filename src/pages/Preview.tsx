
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Heart, ArrowLeft, FileImage, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Preview = () => {
  const navigate = useNavigate();
  const [previewData, setPreviewData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('previewSlamBook');
    if (data) {
      setPreviewData(JSON.parse(data));
    } else {
      navigate('/create');
    }
  }, [navigate]);

  if (!previewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  const themeClasses = {
    'gradient-sunset': 'from-orange-400 to-pink-600',
    'gradient-ocean': 'from-blue-400 to-teal-600',
    'gradient-forest': 'from-green-400 to-blue-600',
    'gradient-purple': 'from-purple-400 to-pink-600',
  };

  const renderQuestionPreview = (question: any) => {
    switch (question.type) {
      case 'text':
        return <Input placeholder="Answer here..." disabled />;
      case 'textarea':
        return <Textarea placeholder="Share your thoughts..." disabled rows={4} />;
      case 'select':
        return (
          <select className="w-full p-2 border border-gray-300 rounded-md" disabled>
            <option>Select an option...</option>
            {question.options?.map((option: string, idx: number) => (
              <option key={idx}>{option}</option>
            ))}
          </select>
        );
      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload a photo</p>
            <Button variant="outline" size="sm" disabled>
              Choose File
            </Button>
          </div>
        );
      case 'rating':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-2xl text-gray-300">★</span>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => window.close()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Editor
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Preview Mode</h1>
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            Preview Only
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardContent className="p-8">
            <div className={`bg-gradient-to-r ${themeClasses[previewData.theme as keyof typeof themeClasses] || themeClasses['gradient-sunset']} text-white p-6 rounded-lg mb-6`}>
              <h1 className="text-2xl font-bold mb-2">{previewData.title || 'Your Slam Book Title'}</h1>
              <p className="opacity-90">Preview Mode</p>
            </div>
            {previewData.description && (
              <p className="text-gray-700 text-lg leading-relaxed">{previewData.description}</p>
            )}
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Heart className="h-4 w-4 text-pink-500" />
              <span>This is how your slam book will look to respondents!</span>
            </div>
          </CardContent>
        </Card>

        {/* Questions Preview */}
        <div className="space-y-6">
          {/* Name Field */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <Label className="text-base font-medium text-gray-900">
                What's your name? (Optional)
              </Label>
            </CardHeader>
            <CardContent>
              <Input placeholder="Your name..." disabled />
            </CardContent>
          </Card>

          {previewData.questions?.map((question: any, index: number) => (
            <Card key={question.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Label className="text-base font-medium text-gray-900">
                      {index + 1}. {question.question}
                    </Label>
                    {question.required && (
                      <span className="ml-2 text-red-500 text-sm">*</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderQuestionPreview(question)}
              </CardContent>
            </Card>
          ))}

          {/* Submit Button Preview */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Button 
                disabled
                className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-lg"
              >
                Submit Response (Preview)
              </Button>
              <p className="text-sm text-gray-600 mt-3">
                This is a preview - responses won't be saved
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Preview;
