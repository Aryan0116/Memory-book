import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useSlamBooks } from '@/hooks/useSlamBooks';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Search, 
  Sparkles, 
  Heart, 
  Star, 
  MessageCircle, 
  Image as ImageIcon, 
  Hash,
  BookOpen,
  ArrowLeft,
  Wand2,
  Users,
  Camera,
  FileText,
  Globe,
  PaintBucket,
  Upload,
  Palette,
  Sunset,
  Waves,
  TreePine,
  Zap,
  Moon,
  Sun,
  Coffee,
  Flower,
  Filter,
  Mountain,
  Sparkle,
  Rainbow,
  CloudRain,
  Flame,
  Leaf,
  Shell,
  Snowflake,
  Cherry
} from 'lucide-react';

interface Question {
  id: string;
  type: string;
  question: string;
  required: boolean;
  options?: string[];
  position: number;
  category?: string;
}

const questionBank = {
  personal: [
    "What's your favorite memory of {name}?",
    "How would you describe {name} in three words?",
    "What's the funniest thing {name} has ever done?",
    "What's one thing you admire most about {name}?",
    "If {name} were a superhero, what would their power be?",
    "What's the best advice {name} has given you?"
  ],
  friendship: [
    "How did you first meet {name}?",
    "What's your favorite activity to do with {name}?",
    "Share a secret or inside joke you have with {name}",
    "What's something {name} taught you?",
    "If you could go anywhere with {name}, where would it be?",
    "What's the best gift {name} has given you (doesn't have to be material)?"
  ],
  memories: [
    "Share your most treasured memory with {name}",
    "What's the craziest adventure you've had with {name}?",
    "Describe a time when {name} made you laugh until you cried",
    "What's a moment with {name} you'll never forget?",
    "Share a story about {name} that always makes you smile",
    "What's the most embarrassing thing that happened to you and {name}?"
  ],
  future: [
    "What do you predict {name} will be doing in 10 years?",
    "What's one wish you have for {name}'s future?",
    "Where do you see your friendship with {name} in 5 years?",
    "What's one goal you hope {name} achieves?",
    "What advice would you give {name} for their future?",
    "What's one thing you want to do with {name} before you're both old?"
  ],
  rating: [
    "Rate {name}'s sense of humor (1-5 stars)",
    "How likely are you to recommend {name} as a friend? (1-5 stars)",
    "Rate {name}'s cooking skills (1-5 stars)",
    "How adventurous is {name}? (1-5 stars)",
    "Rate {name}'s dance moves (1-5 stars)",
    "How good is {name} at keeping secrets? (1-5 stars)"
  ],
  creative: [
    "Upload a photo that reminds you of {name}",
    "Draw or upload something that represents your friendship",
    "Share a photo of you and {name} together",
    "Upload a picture of something {name} loves",
    "Add a photo from your favorite memory with {name}",
    "Share an image that describes {name}'s personality"
  ]
};

const categoryConfig = {
  personal: { 
    color: 'from-purple-500 to-pink-500', 
    bgColor: 'bg-purple-50', 
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    icon: Heart 
  },
  friendship: { 
    color: 'from-blue-500 to-cyan-500', 
    bgColor: 'bg-blue-50', 
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: Users 
  },
  memories: { 
    color: 'from-orange-500 to-red-500', 
    bgColor: 'bg-orange-50', 
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    icon: Camera 
  },
  future: { 
    color: 'from-green-500 to-emerald-500', 
    bgColor: 'bg-green-50', 
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    icon: Globe 
  },
  rating: { 
    color: 'from-yellow-500 to-amber-500', 
    bgColor: 'bg-yellow-50', 
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
    icon: Star 
  },
  creative: { 
    color: 'from-indigo-500 to-purple-500', 
    bgColor: 'bg-indigo-50', 
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    icon: PaintBucket 
  }
};

const themeOptions = [
  { value: 'gradient-sunset', label: 'Sunset', colors: 'from-orange-400 via-pink-500 to-red-600', icon: Sunset },
  { value: 'gradient-ocean', label: 'Ocean', colors: 'from-blue-500 via-cyan-500 to-teal-600', icon: Waves },
  { value: 'gradient-forest', label: 'Forest', colors: 'from-green-500 via-emerald-500 to-blue-600', icon: TreePine },
  { value: 'gradient-purple', label: 'Purple', colors: 'from-purple-500 via-violet-500 to-pink-600', icon: Zap },
  { value: 'gradient-midnight', label: 'Midnight', colors: 'from-slate-900 via-purple-900 to-slate-900', icon: Moon },
  { value: 'gradient-sunrise', label: 'Sunrise', colors: 'from-yellow-300 via-orange-400 to-red-500', icon: Sun },
  { value: 'gradient-coffee', label: 'Coffee', colors: 'from-amber-800 via-orange-600 to-yellow-500', icon: Coffee },
  { value: 'gradient-spring', label: 'Spring', colors: 'from-green-300 via-blue-500 to-purple-600', icon: Flower },
  { value: 'gradient-mountain', label: 'Mountain', colors: 'from-slate-600 via-gray-500 to-blue-400', icon: Mountain },
  { value: 'gradient-cosmic', label: 'Cosmic', colors: 'from-indigo-900 via-purple-800 to-pink-800', icon: Sparkle },
  { value: 'gradient-rainbow', label: 'Rainbow', colors: 'from-red-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-purple-400', icon: Rainbow },
  { value: 'gradient-storm', label: 'Storm', colors: 'from-gray-700 via-blue-600 to-slate-800', icon: CloudRain },
  { value: 'gradient-fire', label: 'Fire', colors: 'from-red-600 via-orange-500 to-yellow-400', icon: Flame },
  { value: 'gradient-nature', label: 'Nature', colors: 'from-green-600 via-lime-500 to-emerald-400', icon: Leaf },
  { value: 'gradient-beach', label: 'Beach', colors: 'from-cyan-400 via-blue-300 to-sand-200', icon: Shell },
  { value: 'gradient-winter', label: 'Winter', colors: 'from-blue-200 via-indigo-300 to-purple-200', icon: Snowflake },
  { value: 'gradient-sakura', label: 'Sakura', colors: 'from-pink-300 via-rose-400 to-pink-500', icon: Cherry },
];

const presetQuestions = [
  { id: 'preset-1', type: 'text', question: "Give me a name?", required: true, category: 'personal' },
  { id: 'preset-2', type: 'text', question: "How old are you?", required: false, category: 'personal' },
  { id: 'preset-3', type: 'textarea', question: "What's your favorite memory with me?", required: false, category: 'memories' },
  { id: 'preset-4', type: 'text', question: "Describe me in three words", required: false, category: 'personal' },
  { id: 'preset-5', type: 'image', question: "Share a photo of us together", required: false, category: 'creative' },
  { id: 'preset-6', type: 'textarea', question: "What advice would you give me?", required: false, category: 'future' }
];

const CreateSlamBook = () => {
  const navigate = useNavigate();
  const { createSlamBook, loading } = useSlamBooks();
  const { toast } = useToast();
  
  const [personName, setPersonName] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('gradient-sunset');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);

  // Initialize with preset questions
  useEffect(() => {
    if (questions.length === 0) {
      const initialQuestions = presetQuestions.map((q, index) => ({
        ...q,
        id: `preset-${Date.now()}-${index}`,
        position: index
      }));
      setQuestions(initialQuestions);
    }
  }, []);

  // Auto-generate title based on person's name
  const getTitle = () => {
    return personName ? `${personName}'s Memory Book` : 'Memory Book';
  };

  const addQuestion = (questionText: string, type: string = 'text', category: string = 'personal') => {
    const processedQuestion = questionText.replace(/{name}/g, personName || '[Name]');
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: processedQuestion,
      required: false,
      position: questions.length,
      category
    };
    setQuestions([...questions, newQuestion]);
  };

  const addCustomQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'text',
      question: '',
      required: false,
      position: questions.length,
      category: 'personal'
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const filteredQuestions = () => {
    if (selectedCategory === 'all') {
      return Object.entries(questionBank).flatMap(([category, items]) => 
        items.map(item => ({ category, question: item }))
      );
    }
    return questionBank[selectedCategory as keyof typeof questionBank]?.map(item => 
      ({ category: selectedCategory, question: item })
    ) || [];
  };

  const getCategoryIcon = (category: string) => {
    const config = categoryConfig[category as keyof typeof categoryConfig];
    const IconComponent = config?.icon || MessageCircle;
    return <IconComponent className="h-4 w-4" />;
  };

  const getCategoryStyle = (category: string) => {
    return categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.personal;
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'textarea': return <MessageCircle className="h-4 w-4" />;
      case 'rating': return <Star className="h-4 w-4" />;
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'select': return <Hash className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'text': return 'Short Text';
      case 'textarea': return 'Long Text';
      case 'rating': return 'Rating';
      case 'image': return 'Image Upload';
      case 'select': return 'Multiple Choice';
      default: return 'Short Text';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter the person's name for the memory book.",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "No Questions",
        description: "Please add at least one question to your memory book.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const slamBook = await createSlamBook({
        title: getTitle(),
        description,
        theme,
        questions: questions.map((q, index) => ({
          type: q.type,
          question: q.question,
          required: q.required,
          options: q.options,
          position: index,
        })),
      });

      toast({
        title: "Success!",
        description: "Your memory book has been created successfully!",
      });

      navigate(`/responses/${slamBook.slug}`);
    } catch (error) {
      console.error('Error creating memory book:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const CreateButton = ({ className = "" }) => (
    <Button
      onClick={handleSubmit}
      disabled={loading || isCreating || !personName.trim() || questions.length === 0}
      className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold ${className}`}
    >
      {isCreating ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
          <span className="hidden sm:inline">Creating Memory Book...</span>
          <span className="sm:hidden">Creating...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          <span className="hidden sm:inline">Create Memory Book</span>
          <span className="sm:hidden">Create</span>
        </div>
      )}
    </Button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-cyan-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="hover:bg-purple-50 rounded-full p-2 sm:p-3"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-purple-600" />
                <span className="hidden md:inline text-purple-700">Back to Dashboard</span>
                <span className="md:hidden text-purple-700 text-sm">Back</span>
              </Button>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg sm:rounded-xl">
                  <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Create Memory Book
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden lg:block">Design a beautiful collection of memories</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs sm:text-sm">
                {questions.length} Questions
              </Badge>
              <CreateButton className="px-3 sm:px-6 py-2 sm:py-4 text-sm sm:text-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  Memory Book Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="personName" className="text-sm sm:text-base font-semibold text-gray-700">
                    Person's Name *
                  </Label>
                  <Input
                    id="personName"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    placeholder="Enter the person's name"
                    className="text-base sm:text-lg p-3 sm:p-4 rounded-xl border-2 border-purple-100 focus:border-purple-300 bg-gradient-to-r from-purple-50/50 to-pink-50/50"
                  />
                  {personName && (
                    <p className="text-xs sm:text-sm text-purple-600 font-medium">
                      Title will be: "{getTitle()}"
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm sm:text-base font-semibold text-gray-700">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a beautiful description for this memory book..."
                    className="min-h-[80px] sm:min-h-[100px] rounded-xl border-2 border-purple-100 focus:border-purple-300 bg-gradient-to-r from-purple-50/50 to-pink-50/50"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Theme
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                    {themeOptions.map((themeOption) => {
                      const IconComponent = themeOption.icon;
                      return (
                        <div
                          key={themeOption.value}
                          onClick={() => setTheme(themeOption.value)}
                          className={`p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                            theme === themeOption.value 
                              ? 'ring-4 ring-purple-300 scale-105' 
                              : 'hover:scale-102'
                          }`}
                        >
                          <div className={`h-10 sm:h-12 w-full rounded-lg bg-gradient-to-r ${themeOption.colors} mb-2 relative overflow-hidden`}>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white/80" />
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-center text-gray-700">{themeOption.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions Management */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 p-4 sm:p-6">
                <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    Questions ({questions.length})
                  </div>
                  <Button onClick={addCustomQuestion} variant="outline" size="sm" className="rounded-full text-xs sm:text-sm px-2 sm:px-4">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Add Custom</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {questions.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl sm:text-6xl mb-4">📝</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Questions Yet</h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-6">Add questions from the question bank or create custom ones</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {questions.map((question, index) => {
                      const categoryStyle = getCategoryStyle(question.category || 'personal');
                      return (
                        <div key={question.id} className={`group ${categoryStyle.bgColor} p-4 sm:p-5 rounded-xl border-2 ${categoryStyle.borderColor} hover:shadow-lg transition-all duration-300`}>
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex items-center gap-2 mt-1">
                              <GripVertical className="h-4 w-4 text-gray-400 cursor-move hidden sm:block" />
                              <span className={`w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r ${categoryStyle.color} rounded-full flex items-center justify-center text-white text-sm sm:text-base font-bold`}>
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1 space-y-3 sm:space-y-4">
                              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg border shadow-sm">
                                  {getQuestionTypeIcon(question.type)}
                                  <Select
                                    value={question.type}
                                    onValueChange={(value) => updateQuestion(question.id, 'type', value)}
                                  >
                                    <SelectTrigger className="border-0 bg-transparent p-0 h-auto shadow-none text-sm font-medium">
                                      <SelectValue>
                                        {getQuestionTypeLabel(question.type)}
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text">
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4" />
                                          Short Text
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="textarea">
                                        <div className="flex items-center gap-2">
                                          <MessageCircle className="h-4 w-4" />
                                          Long Text
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="rating">
                                        <div className="flex items-center gap-2">
                                          <Star className="h-4 w-4" />
                                          Rating
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="image">
                                        <div className="flex items-center gap-2">
                                          <ImageIcon className="h-4 w-4" />
                                          Image Upload
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="select">
                                        <div className="flex items-center gap-2">
                                          <Hash className="h-4 w-4" />
                                          Multiple Choice
                                        </div>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg border shadow-sm">
                                  {getCategoryIcon(question.category || 'personal')}
                                  <Select
                                    value={question.category || 'personal'}
                                    onValueChange={(value) => updateQuestion(question.id, 'category', value)}
                                  >
                                    <SelectTrigger className="border-0 bg-transparent p-0 h-auto shadow-none text-sm font-medium">
                                      <SelectValue>
                                        <span className="capitalize">{question.category || 'personal'}</span>
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(categoryConfig).map(([category, config]) => (
                                        <SelectItem key={category} value={category}>
                                          <div className="flex items-center gap-2">
                                            {getCategoryIcon(category)}
                                            <span className="capitalize">{category}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg border shadow-sm">
                                  <Switch
                                    checked={question.required}
                                    onCheckedChange={(checked) => updateQuestion(question.id, 'required', checked)}
                                    className="data-[state=checked]:bg-purple-600 scale-90"
                                  />
                                  <Label className="text-sm font-medium cursor-pointer">
                                    {question.required ? 'Required' : 'Optional'}
                                  </Label>
                                </div>
                              </div>
                              
                              <Input
                                value={question.question}
                                onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                                placeholder="Enter your question..."
                                className="text-sm sm:text-base bg-white/80 border-white/60 focus:border-purple-300 rounded-lg"
                              />

                              {question.type === 'image' && (
                                <div className="mt-3 p-4 bg-white/60 rounded-lg border-2 border-dashed border-purple-300">
                                  <div className="flex items-center justify-center gap-3 text-purple-600">
                                    <Upload className="h-5 w-5" />
                                    <span className="text-sm font-medium">Image upload will be available for responses</span>
                                  </div>
                                </div>
                              )}

                              {question.type === 'select' && (
                                <div className="mt-3">
                                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Options (one per line)</Label>
                                  <Textarea
                                    value={question.options?.join('\n') || ''}
                                    onChange={(e) => updateQuestion(question.id, 'options', e.target.value.split('\n').filter(Boolean))}
                                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                                    className="bg-white/80 min-h-[80px] text-sm rounded-lg"
                                  />
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(question.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 mt-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mobile Create Button */}
            <div className="lg:hidden">
              <CreateButton className="w-full py-3 sm:py-4 text-base sm:text-lg" />
            </div>
          </div>

          {/* Question Bank Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden sticky top-20 sm:top-24">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  Question Bank
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-xs sm:text-sm bg-white/80 rounded-lg"
                    />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-white/80 text-xs sm:text-sm rounded-lg">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.entries(categoryConfig).map(([category, config]) => (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(category)}
                            <span className="capitalize">{category}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="custom-scrollbar max-h-64 sm:max-h-96 overflow-y-auto space-y-2">
                    {filteredQuestions()
                      .filter(item => 
                        item.question.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((item, index) => {
                        const categoryStyle = getCategoryStyle(item.category);
                        return (
                          <div
                            key={index}
                            onClick={() => addQuestion(item.question, item.category === 'rating' ? 'rating' : item.category === 'creative' ? 'image' : 'text', item.category)}
                            className={`p-3 ${categoryStyle.bgColor} rounded-lg border ${categoryStyle.borderColor} hover:shadow-md cursor-pointer transition-all duration-200 group`}
                          >
                            <div className="flex items-center justify-between">
                              <p className={`text-xs sm:text-sm ${categoryStyle.textColor} group-hover:font-medium transition-all`}>
                                {item.question.replace(/{name}/g, personName || '[Name]')}
                              </p>
                              <Plus className={`h-3 w-3 sm:h-4 sm:w-4 ${categoryStyle.textColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                            </div>
                            <Badge variant="outline" className={`mt-2 text-xs ${categoryStyle.textColor} border-current`}>
                              <div className="flex items-center gap-1">
                                {getCategoryIcon(item.category)}
                                <span className="capitalize">{item.category}</span>
                              </div>
                            </Badge>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Desktop Create Button */}
            <div className="hidden lg:block">
              <CreateButton className="w-full py-3 sm:py-4 text-base sm:text-lg" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreateSlamBook;
