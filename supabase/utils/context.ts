import { createClient } from "jsr:@supabase/supabase-js@2";
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import Anthropic from 'npm:@anthropic-ai/sdk';
import OpenAI from 'npm:openai';
import type { Option, Env, BrowserlessClient, User } from "@types";
// Deno does not natively support npm packages like "browserless" or Node.js modules like "puppeteer-core".
// You would need to use Deno-compatible libraries or APIs, or run these in a Node.js environment.
// The following imports will not work in Deno without compatibility layers or shims.

 import {Browserless} from "npm:browserless";
 import { PuppeteerDeno } from "https://deno.land/x/puppeteer@16.2.0/src/deno/Puppeteer.ts";
 import type { Browser } from "https://deno.land/x/puppeteer@16.2.0/src/deno/Puppeteer.ts";

// import puppeteer from 'https://esm.sh/puppeteer-core@21.6.0';
// import type { Browser } from 'https://esm.sh/puppeteer-core@21.6.0';

// If you need browser automation in Deno, consider using a REST API (e.g., Browserless cloud API) directly via fetch,
// or use Deno's native fetch and DOM APIs for simpler tasks.
  // Create a Supabase client
export function createSupabaseClient(ctx:Env=Deno.env):SupabaseClient{
    const supabaseUrl: string = ctx.get('SUPABASE_URL') as string;
    const supabaseAnonKey: string = ctx.get('SUPABASE_ANON_KEY') as string;
    const supabaseClient: ReturnType<typeof createClient> = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseClient
  }
  

export function createBrowserlessClient(ctx:Env=Deno.env):BrowserlessClient{
    const TOKEN: string = ctx.get('BROWSERLESS_API_KEY') as string;
    const url = `https://production-sfo.browserless.io/scrape?token=${TOKEN}`;
    const headers = {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json"};
    const browserlessClient: BrowserlessClient = {
        url: url,
        headers: headers,
        completeURL: (fetchableUrl:string)=>{
            return url + '?url=' + fetchableUrl;
        }
    }
    return browserlessClient;
}

export async function createBrowser(ctx:Env=Deno.env):Promise<Browser>{
// supabase/functions/lib/browser.ts
  try {
    const browser = await ctx.PuppeteerDeno.connect({
    browserWSEndpoint: ctx.browserlessClient.url,
  })
  return browser;
  }
  catch (error) {
    throw new Error('Error creating browser:',error.message);
  }
}



export function createTextEncoder():TextEncoder{
    const textEncoder: TextEncoder = new TextEncoder();
    return textEncoder;
}


export function createAnthropicClient(ctx:Env=Deno.env):Anthropic{
    const anthropicApiKey: string = ctx.get('ANTHROPIC_API_KEY') as string;
    const anthropicClient: Anthropic = new Anthropic({
        apiKey: anthropicApiKey,
    });
    return anthropicClient;
}

export function createOpenAIClient(ctx:Env=Deno.env):OpenAI{
    const openaiApiKey: string = ctx.get('OPENAI_API_KEY') as string;
    const openaiClient: OpenAI = new OpenAI({
        apiKey: openaiApiKey,
    });
    return openaiClient;
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