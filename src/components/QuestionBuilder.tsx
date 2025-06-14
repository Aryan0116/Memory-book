
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, GripVertical, Trash2, FileImage } from 'lucide-react';

interface Question {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'file' | 'rating';
  question: string;
  required: boolean;
  options?: string[];
}

interface QuestionBuilderProps {
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
}

export const QuestionBuilder: React.FC<QuestionBuilderProps> = ({ questions, onQuestionsChange }) => {
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  const questionTypes = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'select', label: 'Multiple Choice' },
    { value: 'file', label: 'File Upload' },
    { value: 'rating', label: 'Rating' },
  ];

  const defaultQuestions = [
    { id: '1', type: 'text' as const, question: "What's your name?", required: true },
    { id: '2', type: 'textarea' as const, question: "What's your favorite memory with me?", required: false },
    { id: '3', type: 'text' as const, question: "Describe me in three words", required: false },
    { id: '4', type: 'file' as const, question: "Share a photo of us together", required: false },
    { id: '5', type: 'textarea' as const, question: "What advice would you give me?", required: false },
  ];

  React.useEffect(() => {
    if (questions.length === 0) {
      onQuestionsChange(defaultQuestions);
    }
  }, []);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'text',
      question: 'New Question',
      required: false,
    };
    onQuestionsChange([...questions, newQuestion]);
    setEditingQuestion(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    onQuestionsChange(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    onQuestionsChange(questions.filter(q => q.id !== id));
  };

  const renderQuestionPreview = (question: Question) => {
    switch (question.type) {
      case 'text':
        return <Input placeholder="Answer here..." disabled />;
      case 'textarea':
        return <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Write your answer..." disabled />;
      case 'select':
        return (
          <select className="w-full p-2 border rounded-md" disabled>
            <option>Select an option...</option>
            {question.options?.map((option, idx) => (
              <option key={idx}>{option}</option>
            ))}
          </select>
        );
      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            <FileImage className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Upload a file</p>
          </div>
        );
      case 'rating':
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="w-6 h-6 text-gray-300">★</div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Questions</CardTitle>
          <Button onClick={addQuestion} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id} className="border border-gray-200">
              <CardContent className="p-4">
                {editingQuestion === question.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Question Text</Label>
                      <Input
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Question Type</Label>
                        <Select 
                          value={question.type} 
                          onValueChange={(value) => updateQuestion(question.id, { type: value as Question['type'] })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {questionTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-end">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                          />
                          Required
                        </label>
                      </div>
                    </div>

                    {question.type === 'select' && (
                      <div>
                        <Label>Options (one per line)</Label>
                        <textarea
                          className="w-full p-2 border rounded-md mt-1"
                          rows={3}
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                          value={question.options?.join('\n') || ''}
                          onChange={(e) => updateQuestion(question.id, { options: e.target.value.split('\n').filter(Boolean) })}
                        />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setEditingQuestion(null)}>
                        Done
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteQuestion(question.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <GripVertical className="h-5 w-5 text-gray-400 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">Question {index + 1}</span>
                            {question.required && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Required</span>
                            )}
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              {questionTypes.find(t => t.value === question.type)?.label}
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-3">{question.question}</h3>
                          {renderQuestionPreview(question)}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setEditingQuestion(question.id)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {questions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No questions yet. Add your first question!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
