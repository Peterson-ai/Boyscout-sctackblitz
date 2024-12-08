import { supabase } from "@/lib/supabase";
import { makeUserAdmin } from "@/lib/admin";

export async function createAdminUser(email: string, password: string) {
  try {
    // First create the user
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin'
        }
      }
    });

    if (signUpError) throw signUpError;
    if (!user) throw new Error('Failed to create user');

    // Make the user an admin
    await makeUserAdmin(user.id);

    return { success: true, user };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, error };
  }
}

export async function checkAdminExists() {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('count')
      .single();

    if (error) throw error;
    return data?.count > 0;
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return false;
  }
}