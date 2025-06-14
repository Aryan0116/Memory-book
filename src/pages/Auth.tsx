import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        navigate('/dashboard');
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        navigate('/dashboard');
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Check your email for verification link",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Signed in successfully!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <Card className={`w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transform transition-all duration-1000 ${mounted ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'}`}>
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className={`text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent transform transition-all duration-500 ${isSignUp ? 'scale-105' : 'scale-100'}`}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <p className="text-white/60 mt-2 transition-opacity duration-300">
            {isSignUp ? 'Join us and start your journey' : 'Sign in to continue your journey'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleAuth} className="space-y-5">
            {/* Email Field */}
            <div className="group">
              <Label htmlFor="email" className="text-white/80 text-sm font-medium">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors duration-200" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-11 bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-200 hover:bg-white/10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <Label htmlFor="password" className="text-white/80 text-sm font-medium">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors duration-200" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-11 pr-11 bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-200 hover:bg-white/10"
                  placeholder="Enter your password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-purple-400 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            <div className={`group transition-all duration-500 overflow-hidden ${isSignUp ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
              {isSignUp && (
                <>
                  <Label htmlFor="confirmPassword" className="text-white/80 text-sm font-medium">Confirm Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors duration-200" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={isSignUp}
                      className="pl-11 pr-11 bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-200 hover:bg-white/10"
                      placeholder="Confirm your password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-purple-400 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Loading...
                </div>
              ) : (
                <div className="flex items-center justify-center group-hover:space-x-2 transition-all duration-200">
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              )}
            </Button>
          </form>
          
          {/* Mode Toggle */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setConfirmPassword('');
              }}
              className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm group"
            >
              <span className="group-hover:scale-105 transition-transform duration-200">
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </span>
            </Button>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="text-black/70 border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40 transition-all duration-200 text-sm"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Auth;
