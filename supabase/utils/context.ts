import { createClient } from "jsr:@supabase/supabase-js@2";
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import type { Option, Env, User } from "@types";

  // Create a Supabase client
export function createSupabaseClient(ctx:Env=Deno.env):SupabaseClient{
    const supabaseUrl: string = ctx.get('SUPABASE_URL') as string;
    const supabaseAnonKey: string = ctx.get('SUPABASE_ANON_KEY') as string;
    const supabaseClient: ReturnType<typeof createClient> = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseClient
  }
  
  //Create the user if needed
  export function createUser(ctx: Env = Deno.env): Option<User> {
      try {
        const email = ctx.get('TEST_EMAIL');
        const pwd = ctx.get('TEST_PWD');
        const user = {
          email: email
        };
        return user;
      } catch (error) {
        console.error('Error generating user:', error);
        return null
      }
    }