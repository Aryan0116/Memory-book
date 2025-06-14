
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Response, Answer } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { CryptoUtil } from '@/utils/crypto';

export const useResponses = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitResponse = async (data: {
    slamBookId: string;
    respondentName?: string;
    answers: { questionId: string; answer: any; type: string }[];
  }) => {
    try {
      setLoading(true);

      // Encrypt respondent name if provided
      const encryptedName = data.respondentName 
        ? await CryptoUtil.encrypt(data.respondentName)
        : null;

      // Create response
      const { data: response, error: responseError } = await supabase
        .from('responses')
        .insert({
          slam_book_id: data.slamBookId,
          respondent_name: encryptedName,
        })
        .select()
        .single();

      if (responseError) throw responseError;

      // Create answers with encryption
      const answersToInsert = await Promise.all(
        data.answers.map(async (answer) => {
          let encryptedText = null;
          let answerNumber = null;
          let fileUrl = null;

          if (answer.type === 'rating') {
            answerNumber = Number(answer.answer);
          } else if (answer.type === 'file' || answer.type === 'image') {
            fileUrl = answer.answer;
          } else {
            // Encrypt text answers
            encryptedText = await CryptoUtil.encrypt(String(answer.answer));
          }

          return {
            response_id: response.id,
            question_id: answer.questionId,
            answer_text: encryptedText,
            answer_number: answerNumber,
            file_url: fileUrl,
          };
        })
      );

      const { error: answersError } = await supabase
        .from('answers')
        .insert(answersToInsert);

      if (answersError) throw answersError;

      toast({
        title: "Success",
        description: "Response submitted successfully!",
      });

      return response;
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        title: "Error",
        description: "Failed to submit response. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getResponses = async (slamBookId: string) => {
    try {
      const { data: responses, error: responsesError } = await supabase
        .from('responses')
        .select(`
          *,
          answers (
            *,
            questions (*)
          )
        `)
        .eq('slam_book_id', slamBookId)
        .order('created_at', { ascending: false });

      if (responsesError) throw responsesError;

      // Decrypt the responses
      const decryptedResponses = await Promise.all(
        responses.map(async (response) => {
          const decryptedName = response.respondent_name
            ? await CryptoUtil.decrypt(response.respondent_name)
            : null;

          const decryptedAnswers = await Promise.all(
            response.answers.map(async (answer: any) => ({
              ...answer,
              answer_text: answer.answer_text
                ? await CryptoUtil.decrypt(answer.answer_text)
                : answer.answer_text,
            }))
          );

          return {
            ...response,
            respondent_name: decryptedName,
            answers: decryptedAnswers,
          };
        })
      );

      return decryptedResponses;
    } catch (error) {
      console.error('Error fetching responses:', error);
      throw error;
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('slam-book-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('slam-book-files')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  return {
    loading,
    submitResponse,
    getResponses,
    uploadFile,
  };
};
