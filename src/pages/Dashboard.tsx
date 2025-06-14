import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Eye, Share, Users, BarChart3, Copy, Trash2, QrCode, Edit, Sparkles, TrendingUp, Calendar, ExternalLink } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSlamBooks } from '@/hooks/useSlamBooks';
import { SlamBook } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface MemoryBookWithResponses extends SlamBook {
  response_count: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserSlamBooks, deleteSlamBook, loading: deleteLoading } = useSlamBooks();
  const { toast } = useToast();
  const [memoryBooks, setMemoryBooks] = useState<MemoryBookWithResponses[]>([]);
  const [loading, setLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    loadMemoryBooks();
  }, []);

  // Refresh when coming back from create page
  useEffect(() => {
    if (location.state?.refresh) {
      loadMemoryBooks();
      // Clear the state to prevent infinite refreshing
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadMemoryBooks = async () => {
    try {
      setLoading(true);
      const data = await getUserSlamBooks();
      setMemoryBooks(data || []);
      setTimeout(() => setAnimateStats(true), 300);
    } catch (error) {
      console.error('Error loading memory books:', error);
      toast({
        title: "Error",
        description: "Failed to load memory books. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMemoryBook = async (id: string, title: string) => {
    try {
      await deleteSlamBook(id);
      // Remove from local state
      setMemoryBooks(prev => prev.filter(book => book.id !== id));
    } catch (error) {
      console.error('Error deleting memory book:', error);
    }
  };

  const copyShareLink = (slug: string) => {
    const shareUrl = `${window.location.origin}/s/${slug}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied!",
      description: "Share link has been copied to clipboard.",
    });
  };

  const shareToWhatsApp = (slug: string, title: string) => {
    const shareUrl = `${window.location.origin}/s/${slug}`;
    const message = `Hey! 👋 I've created a special memory book "${title}" and would love for you to fill it out! It's a fun way to collect memories and messages. Please take a moment to share your thoughts: ${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const themeClasses = {
    'gradient-sunset': 'from-orange-400 via-pink-500 to-red-500',
    'gradient-ocean': 'from-blue-400 via-cyan-500 to-teal-500',
    'gradient-forest': 'from-green-400 via-emerald-500 to-blue-500',
    'gradient-purple': 'from-purple-400 via-pink-500 to-indigo-500',
  };

  const totalResponses = memoryBooks.reduce((sum, book) => sum + book.response_count, 0);
  const totalViews = memoryBooks.reduce((sum, book) => sum + book.view_count, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/20 via-pink-100/20 to-blue-100/20"></div>
        <div className="text-center z-10">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-pink-200 border-r-pink-600 mx-auto animate-spin" style={{animationDirection: 'reverse', animationDuration: '3s'}}></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-700 animate-pulse">Loading your dashboard</p>
            <p className="text-sm text-gray-500">Preparing something amazing...</p>
          </div>
        </div>
        <div className="absolute top-20 left-20 w-2 h-2 bg-purple-300 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-pink-300 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-blue-300 rounded-full animate-bounce delay-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-200/20 to-blue-200/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    My Memory Books
                  </h1>
                  <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
                </div>
                <p className="text-sm text-gray-600 mt-1">Create, share, and manage your collection</p>
              </div>
            </div>
             <Button onClick={() => navigate('/create')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "Total Memory Books",
              value: memoryBooks.length,
              subtitle: "Published projects",
              icon: BarChart3,
              gradient: "from-purple-500 to-pink-500",
              delay: "delay-100"
            },
            {
              title: "Total Responses",
              value: totalResponses,
              subtitle: "People who participated",
              icon: Users,
              gradient: "from-blue-500 to-purple-500",
              delay: "delay-300"
            },
            {
              title: "Total Views",
              value: totalViews,
              subtitle: "Page visits",
              icon: TrendingUp,
              gradient: "from-pink-500 to-orange-500",
              delay: "delay-500"
            }
          ].map((stat, index) => (
            <Card key={index} className={`bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group animate-fade-in-up ${stat.delay}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
                      {stat.title}
                    </p>
                    <p className={`text-4xl font-bold text-gray-900 transition-all duration-1000 ${animateStats ? 'animate-count-up' : ''}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  </div>
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Memory Books Section */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="animate-fade-in-up delay-700">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Your Memory Books
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {memoryBooks.length} active
                </span>
              </h2>
              <p className="text-sm text-gray-600 mt-1">Manage and share your collections</p>
            </div>
            {memoryBooks.length > 0 && (
              <Button variant="outline" onClick={loadMemoryBooks} className="hover:bg-white/50 transition-all duration-300 hover:scale-105">
                <Eye className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
          </div>
          
          {memoryBooks.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl animate-fade-in-up delay-1000">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl animate-bounce">
                  <Plus className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No memory books yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Create your first memory book and start collecting memories, messages, and feedback from friends, family, or colleagues!
                </p>
                <Button 
                  onClick={() => navigate('/create')} 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Memory Book
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {memoryBooks.map((book, index) => (
                <Card 
                  key={book.id} 
                  className={`bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-105 animate-fade-in-up`}
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <CardHeader className="pb-4">
                    <div className={`w-full h-32 rounded-2xl bg-gradient-to-r ${themeClasses[book.theme as keyof typeof themeClasses] || themeClasses['gradient-sunset']} mb-4 flex items-center justify-center relative overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <h3 className="text-white font-bold text-lg text-center px-4 relative z-10 group-hover:scale-105 transition-transform duration-300">
                        {book.title}
                      </h3>
                    </div>
                    <CardTitle className="text-lg text-gray-900 group-hover:text-gray-700 transition-colors">
                      {book.title}
                    </CardTitle>
                    {book.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {book.description}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <div className="text-center">
                        <div className="font-bold text-lg text-gray-900">{book.response_count}</div>
                        <div className="text-xs text-gray-600">Responses</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-gray-900">{book.view_count}</div>
                        <div className="text-xs text-gray-600">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-sm text-gray-900">
                          {new Date(book.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-xs text-gray-600">Created</div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 hover:scale-105"
                          onClick={() => navigate(`/responses/${book.slug}`)}
                        >
                          <Users className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Responses</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="hover:bg-green-50 hover:border-green-200 transition-all duration-300 hover:scale-105"
                          onClick={() => navigate(`/s/${book.slug}`)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="hover:bg-purple-50 hover:border-purple-200 transition-all duration-300 hover:scale-105" 
                          onClick={() => copyShareLink(book.slug)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Copy Link</span>
                          <span className="sm:hidden">Copy</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-300 hover:scale-105"
                          onClick={() => navigate(`/qr/${book.slug}`)}
                        >
                          <QrCode className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">QR Code</span>
                          <span className="sm:hidden">QR</span>
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="hover:bg-green-50 hover:border-green-200 transition-all duration-300 hover:scale-105" 
                          onClick={() => shareToWhatsApp(book.slug, book.title)}
                        >
                          <Share className="h-3 w-3 mr-1" />
                          WhatsApp
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-all duration-300 hover:scale-105"
                              disabled={deleteLoading}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="sm:max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl">Delete Memory Book</AlertDialogTitle>
                              <AlertDialogDescription className="text-base leading-relaxed">
                                Are you sure you want to permanently delete <strong>"{book.title}"</strong>? This action cannot be undone and all responses will be lost forever.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteMemoryBook(book.id, book.title)}
                                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 transition-all duration-300"
                                disabled={deleteLoading}
                              >
                                {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes count-up {
          from {
            transform: scale(0.8);
          }
          to {
            transform: scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-count-up {
          animation: count-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
