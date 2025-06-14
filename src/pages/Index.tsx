import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, Users, Share, Camera, Heart, Zap, Globe, Menu, X, QrCode, Download, MessageCircle, Shield, Lock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className={`px-4 sm:px-6 py-4 bg-white/90 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'shadow-lg shadow-purple-100/50' : ''}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
            MemoryBook
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="hover:bg-purple-50 hover:text-purple-700 transition-all duration-300"
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="hover:bg-red-50 hover:text-red-700 transition-all duration-300"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="hover:bg-purple-50 hover:text-purple-700 transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/auth')} 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden hover:bg-purple-50 transition-all duration-300"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="mt-4 pb-4 border-t bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="flex flex-col gap-2 pt-4">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }} 
                    className="justify-start hover:bg-purple-50 transition-all duration-300"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} 
                    className="justify-start hover:bg-red-50 transition-all duration-300"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }} 
                    className="justify-start hover:bg-purple-50 transition-all duration-300"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }} 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 justify-start transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 text-center relative">
        <div className="max-w-5xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent leading-tight animate-gradient bg-300% bg-clip-text">
              Create Magical
              <br />
              <span className="relative">
                Digital Memories
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
              </span>
            </h1>
          </div>
          
          <div className="animate-fade-in-up delay-300">
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto px-4 leading-relaxed">
              Transform traditional Memory books into beautiful digital experiences. Collect heartfelt messages, photos, and memories from friends with our secure, encrypted platform.
            </p>
          </div>

          <div className="animate-fade-in-up delay-500">
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 mb-8">
              <Button 
                size="lg" 
                onClick={() => user ? navigate('/create') : navigate('/auth')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6 w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
              >
                <span className="group-hover:scale-110 transition-transform duration-300">
                  Create Your MemoryBook ✨
                </span>
              </Button>
            </div>

            {/* Security Badge */}
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200 animate-bounce-soft">
              <Shield className="h-4 w-4" />
              <span>100% Secure & Encrypted</span>
              <Lock className="h-4 w-4" />
            </div>
          </div>
        </div>
        
        {/* Animated Scroll indicator */}
        <div className="mt-16 sm:mt-20 animate-bounce">
          <div className="mx-auto w-6 h-10 border-2 border-purple-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-purple-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800 animate-fade-in-up">
              Perfect for Every
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Memory Collection</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
            <Card className="group bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-up">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Heart className="h-8 w-8 text-white animate-pulse" />
                </div>
                <CardTitle className="text-xl font-bold">Farewell Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Preserve heartfelt goodbye messages from colleagues, classmates, and friends in beautiful digital formats that last forever.
                </p>
              </CardContent>
            </Card>

            <Card className="group bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-up delay-200">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Camera className="h-8 w-8 text-white animate-pulse" />
                </div>
                <CardTitle className="text-xl font-bold">Memory Keepsakes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Create stunning digital memory books with photos, videos, and personal messages that capture life's precious moments.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Key Features */}
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 animate-fade-in-up">
              Powerful Features for Modern
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Memory Sharing</span>
            </h3>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-up">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Share className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Instant Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Share your Memory book instantly with QR codes or simple links. Works seamlessly on any device without downloads.
                </p>
                <div className="flex gap-3 justify-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <QrCode className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-pink-600" />
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-up delay-200">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Rich Media Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Collect diverse content including text, photos, ratings, and multimedia for truly engaging memory collections.
                </p>
                <div className="flex gap-3 justify-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Camera className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-up delay-400">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Download className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Beautiful Exports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Export responses as stunning PDFs or create shareable digital collections to preserve memories forever.
                </p>
                <div className="flex gap-3 justify-center">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Download className="h-4 w-4 text-pink-600" />
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Share className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="px-4 sm:px-6 py-20 sm:py-28 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              Start Creating Beautiful
              <br />
              <span className="relative">
                Digital Memories Today
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 rounded-full animate-pulse"></div>
              </span>
            </h2>
          </div>
          
          <div className="animate-fade-in-up delay-300">
            <p className="text-xl sm:text-2xl text-purple-100 mb-8 sm:mb-10 px-4 leading-relaxed">
              Join our community in preserving precious memories
            </p>
          </div>

          <div className="animate-fade-in-up delay-500">
            <Button 
              size="lg" 
              onClick={() => user ? navigate('/create') : navigate('/auth')}
              className="bg-white text-purple-600 hover:bg-gray-50 text-xl px-10 py-6 w-full sm:w-auto shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group font-semibold"
            >
              <span className="group-hover:scale-110 transition-transform duration-300">
                Create Your First MemoryBook
              </span>
            </Button>
          </div>

          <div className="mt-8 animate-fade-in-up delay-700">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-lg font-medium border border-white/20">
              <Shield className="h-5 w-5 text-green-300" />
              <span>Your data is safe with end-to-end encryption</span>
              <Lock className="h-5 w-5 text-green-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="px-4 sm:px-6 py-12 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="animate-fade-in-up">
            <div className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              MemoryBook
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
              Creating beautiful digital memories, one Memory book at a time. 
              <br />
              <span className="text-purple-300">Secure • Beautiful • Memorable</span>
            </p>
          </div>
        </div>
      </footer>

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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes bounce-soft {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-bounce-soft {
          animation: bounce-soft 2s ease-in-out infinite;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-700 {
          animation-delay: 0.7s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }

        .bg-300% {
          background-size: 300% 300%;
        }
      `}</style>
    </div>
  );
};

export default Index;
