import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export async function isAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;

  try {
    const { data, error } = await supabase
      .rpc('is_admin', { user_id: user.id });

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function makeUserAdmin(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .rpc('make_user_admin', { user_id: userId });

    if (error) throw error;
  } catch (error) {
    console.error('Error making user admin:', error);
    throw error;
  }
}