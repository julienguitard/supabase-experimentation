import type { Option, Env, BrowserlessClient, User } from "@types";
import { createClient } from "jsr:@supabase/supabase-js@2";
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import Anthropic from 'npm:@anthropic-ai/sdk';
import OpenAI from 'npm:openai';
import {Browserless} from "npm:browserless";
import puppeteer from "npm:puppeteer-core";


// Create a Supabase client
export function createSupabaseClient(ctx:Env=Deno.env):SupabaseClient{
    const supabaseUrl: string = ctx.get('SUPABASE_URL') as string;
    const supabaseAnonKey: string = ctx.get('SUPABASE_ANON_KEY') as string;
    const supabaseClient: ReturnType<typeof createClient> = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseClient
  }
  

export function createBrowserlessClient(ctx:Env=Deno.env):BrowserlessClient{
    const TOKEN: string = ctx.get('BROWSERLESS_API_KEY') as string;
    //const url = `https://production-sfo.browserless.io/scrape?token=${TOKEN}`;
    const url = 'wss:///production-sfo.browserless.io?token=' + TOKEN;
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
    const browserlessClient = createBrowserlessClient(ctx);
    //const puppeteer = new PuppeteerDeno({
    //  productName: "chrome",
    //});
    console.log(`[${Date.now()}] browserlessClient:`, browserlessClient);
    const browser = await puppeteer.connect({
    browserWSEndpoint: browserlessClient.url,
  })
  console.log(`[${Date.now()}] browser:`, browser);
  return browser;
  }
  catch (error) {
    throw new Error(`[${Date.now()}] Error creating browser! ${error.message}`);
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