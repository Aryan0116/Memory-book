
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SlamBook, Question } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

// Create a type for question creation that doesn't include database-generated fields
type QuestionCreate = {
  type: string;
  question: string;
  required: boolean;
  options?: string[];
  position: number;
};

export const useSlamBooks = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createSlamBook = async (data: {
    title: string;
    description?: string;
    theme: string;
    questions: QuestionCreate[];
  }) => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      // Generate slug
      const { data: slugData, error: slugError } = await supabase
        .rpc('generate_unique_slug', { title: data.title });
      
      if (slugError) throw slugError;

      // Create slam book
      const { data: slamBook, error: slamBookError } = await supabase
        .from('slam_books')
        .insert({
          title: data.title,
          description: data.description,
          theme: data.theme,
          slug: slugData,
          user_id: user.id,
          is_public: true,
        })
        .select()
        .single();

      if (slamBookError) throw slamBookError;

      // Create questions
      const questionsToInsert = data.questions.map((q, index) => ({
        slam_book_id: slamBook.id,
        type: q.type,
        question: q.question,
        required: q.required,
        options: q.options,
        position: index,
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      toast({
        title: "Success",
        description: "Slam book created successfully!",
      });

      return slamBook;
    } catch (error) {
      console.error('Error creating slam book:', error);
      toast({
        title: "Error",
        description: "Failed to create slam book. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSlamBookBySlug = async (slug: string) => {
    try {
      const { data: slamBook, error: slamBookError } = await supabase
        .from('slam_books')
        .select('*')
        .eq('slug', slug)
        .single();

      if (slamBookError) throw slamBookError;

      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('slam_book_id', slamBook.id)
        .order('position');

      if (questionsError) throw questionsError;

      // Increment view count
      await supabase
        .from('slam_books')
        .update({ view_count: slamBook.view_count + 1 })
        .eq('id', slamBook.id);

      return { slamBook, questions };
    } catch (error) {
      console.error('Error fetching slam book:', error);
      throw error;
    }
  };

  const getUserSlamBooks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get slam books with response counts
      const { data, error } = await supabase
        .from('slam_books')
        .select(`
          *,
          responses(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to include response count
      const transformedData = data?.map(book => ({
        ...book,
        response_count: book.responses?.[0]?.count || 0
      }));

      return transformedData;
    } catch (error) {
      console.error('Error fetching user slam books:', error);
      throw error;
    }
  };

  const deleteSlamBook = async (id: string) => {
    try {
      setLoading(true);
      
      // Delete in order: answers -> responses -> questions -> slam_book
      // Get all responses for this slam book
      const { data: responses, error: responsesError } = await supabase
        .from('responses')
        .select('id')
        .eq('slam_book_id', id);

      if (responsesError) throw responsesError;

      // Delete all answers for these responses
      if (responses && responses.length > 0) {
        const responseIds = responses.map(r => r.id);
        const { error: answersError } = await supabase
          .from('answers')
          .delete()
          .in('response_id', responseIds);

        if (answersError) throw answersError;

        // Delete all responses
        const { error: deleteResponsesError } = await supabase
          .from('responses')
          .delete()
          .eq('slam_book_id', id);

        if (deleteResponsesError) throw deleteResponsesError;
      }

      // Delete all questions
      const { error: questionsError } = await supabase
        .from('questions')
        .delete()
        .eq('slam_book_id', id);

      if (questionsError) throw questionsError;

      // Finally, delete the slam book
      const { error: slamBookError } = await supabase
        .from('slam_books')
        .delete()
        .eq('id', id);

      if (slamBookError) throw slamBookError;

      toast({
        title: "Success",
        description: "Slam book deleted successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error deleting slam book:', error);
      toast({
        title: "Error",
        description: "Failed to delete slam book. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createSlamBook,
    getSlamBookBySlug,
    getUserSlamBooks,
    deleteSlamBook,
  };
};
