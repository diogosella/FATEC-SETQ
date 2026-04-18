import { supabase } from "../supabase.ts";

export async function signUp(email: string, password: string, name: string) {

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error('Erro ao criar usuário');

  const { error: dbError } = await supabase
    .from('users')
    .insert([{
      name,
      email,
      auth_id: user.id
    }]);

  if (dbError) throw dbError;

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}