import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, GripVertical, Trash2, FileImage } from 'lucide-react';
import { Question } from '@/types/database';

interface DragDropQuestionBuilderProps {
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
}

export const DragDropQuestionBuilder: React.FC<DragDropQuestionBuilderProps> = ({ 
  questions, 
  onQuestionsChange 
}) => {
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const questionTypes = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'select', label: 'Multiple Choice' },
    { value: 'file', label: 'File Upload' },
    { value: 'rating', label: 'Rating' },
  ];

  const defaultQuestions: Question[] = [
    { id: '1', slam_book_id: '', type: 'text', question: "What's your name?", required: true, position: 0, created_at: new Date().toISOString() },
    { id: '2', slam_book_id: '', type: 'text', question: "How old are you?", required: false, position: 1, created_at: new Date().toISOString() },
    { id: '3', slam_book_id: '', type: 'textarea', question: "What's your favorite memory with me?", required: false, position: 2, created_at: new Date().toISOString() },
    { id: '4', slam_book_id: '', type: 'text', question: "Describe me in three words", required: false, position: 3, created_at: new Date().toISOString() },
    { id: '5', slam_book_id: '', type: 'file', question: "Share a photo of us together", required: false, position: 4, created_at: new Date().toISOString() },
    { id: '6', slam_book_id: '', type: 'textarea', question: "What advice would you give me?", required: false, position: 5, created_at: new Date().toISOString() },
    { id: '7', slam_book_id: '', type: 'text', question: "What's your favorite color?", required: false, position: 6, created_at: new Date().toISOString() },
    { id: '8', slam_book_id: '', type: 'textarea', question: "What do you like most about our friendship?", required: false, position: 7, created_at: new Date().toISOString() },
    { id: '9', slam_book_id: '', type: 'select', question: "How would you rate our friendship?", required: false, options: ['Excellent', 'Good', 'Average', 'Needs work'], position: 8, created_at: new Date().toISOString() },
    { id: '10', slam_book_id: '', type: 'text', question: "What's your dream job?", required: false, position: 9, created_at: new Date().toISOString() },
    { id: '11', slam_book_id: '', type: 'textarea', question: "What's the funniest thing that happened to us?", required: false, position: 10, created_at: new Date().toISOString() },
    { id: '12', slam_book_id: '', type: 'text', question: "What's your favorite movie?", required: false, position: 11, created_at: new Date().toISOString() },
    { id: '13', slam_book_id: '', type: 'text', question: "What's your favorite song?", required: false, position: 12, created_at: new Date().toISOString() },
    { id: '14', slam_book_id: '', type: 'textarea', question: "What would you change about me if you could?", required: false, position: 13, created_at: new Date().toISOString() },
    { id: '15', slam_book_id: '', type: 'rating', question: "Rate my sense of humor (1-5)", required: false, position: 14, created_at: new Date().toISOString() },
    { id: '16', slam_book_id: '', type: 'text', question: "What's your favorite food?", required: false, position: 15, created_at: new Date().toISOString() },
    { id: '17', slam_book_id: '', type: 'textarea', question: "What's something you've always wanted to tell me?", required: false, position: 16, created_at: new Date().toISOString() },
    { id: '18', slam_book_id: '', type: 'text', question: "What's your biggest fear?", required: false, position: 17, created_at: new Date().toISOString() },
    { id: '19', slam_book_id: '', type: 'text', question: "What's your biggest dream?", required: false, position: 18, created_at: new Date().toISOString() },
    { id: '20', slam_book_id: '', type: 'textarea', question: "Any final thoughts or message for me?", required: false, position: 19, created_at: new Date().toISOString() },
  ];

  React.useEffect(() => {
    if (questions.length === 0) {
      onQuestionsChange(defaultQuestions);
    }
  }, []);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      slam_book_id: '',
      type: 'text',
      question: 'New Question',
      required: false,
      position: questions.length,
      created_at: new Date().toISOString()
    };
    onQuestionsChange([...questions, newQuestion]);
    setEditingQuestion(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    onQuestionsChange(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    const reorderedQuestions = updatedQuestions.map((q, index) => ({ ...q, position: index }));
    onQuestionsChange(reorderedQuestions);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newQuestions = [...questions];
    const draggedQuestion = newQuestions[draggedItem];
    
    // Remove dragged item
    newQuestions.splice(draggedItem, 1);
    
    // Insert at new position
    newQuestions.splice(dropIndex, 0, draggedQuestion);
    
    // Update positions
    const reorderedQuestions = newQuestions.map((q, index) => ({ ...q, position: index }));
    
    onQuestionsChange(reorderedQuestions);
    setDraggedItem(null);
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
          <CardTitle>Questions ({questions.length})</CardTitle>
          <Button onClick={addQuestion} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card 
              key={question.id} 
              className={`border border-gray-200 ${draggedItem === index ? 'opacity-50' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
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
                          onValueChange={(value) => updateQuestion(question.id, { type: value })}
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
                        <GripVertical className="h-5 w-5 text-gray-400 mt-1 cursor-move" />
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
