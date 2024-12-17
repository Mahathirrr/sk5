import { supabase } from '@/lib/supabase/client';
import { nanoid } from 'nanoid';
import { AccessToken, CreateAccessTokenData, UseAccessTokenData } from './types';

export async function generateAccessToken(data: CreateAccessTokenData): Promise<AccessToken> {
  const token = nanoid(16);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // Token expires in 30 days

  const { data: accessToken, error } = await supabase
    .from('access_tokens')
    .insert({
      token,
      course_id: data.courseId,
      created_by: data.createdBy,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return accessToken;
}

export async function validateAccessToken(token: string): Promise<AccessToken | null> {
  const { data, error } = await supabase
    .from('access_tokens')
    .select()
    .eq('token', token)
    .is('used_by', null)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error) return null;
  return data;
}

export async function useAccessToken(data: UseAccessTokenData): Promise<void> {
  const { error: updateError } = await supabase
    .from('access_tokens')
    .update({
      used_by: data.userId,
      used_at: new Date().toISOString(),
    })
    .eq('token', data.token);

  if (updateError) throw updateError;

  // Create enrollment
  const { error: enrollmentError } = await supabase
    .from('enrollments')
    .insert({
      user_id: data.userId,
      course_id: data.courseId,
      status: 'active',
      progress: 0,
    });

  if (enrollmentError) throw enrollmentError;
}