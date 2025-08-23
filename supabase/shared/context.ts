import type { Option, Env, BrowserlessClient, User, TextCoder, Browser, BrowserFactory, HexCoder, Tokenizer } from "@types";
import { createClient } from "jsr:@supabase/supabase-js@2";
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import tiktoken from 'npm:tiktoken';
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

  export function createAuthenticatedSupabaseClient(ctx:Env=Deno.env, req:Request):Promise<SupabaseClient>{
    const supabaseUrl: string = ctx.get('SUPABASE_URL') as string;
    const supabaseAnonKey: string = ctx.get('SUPABASE_ANON_KEY') as string;
    const supabaseClient: ReturnType<typeof createClient> = createClient(
      supabaseUrl, 
      supabaseAnonKey,
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
  );
  return supabaseClient
  }
  

export function createBrowserlessClient(ctx:Env=Deno.env):BrowserlessClient{
    const TOKEN: string = ctx.get('BROWSERLESS_API_KEY') as string;
    //const url = `https://production-sfo.browserless.io/scrape?token=${TOKEN}`;
    const url = 'https://production-ams.browserless.io/scrape?token=' + TOKEN;
    const headers = {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json"};
    const browserlessClient: BrowserlessClient = {
        url: url,
        headers: headers,
        completeBody: (fetchableUrl:string)=>{
            return {
              url: fetchableUrl,
              elements: [
                  {
                      selector:'p'
                  }
              ]
          }
        }
    }
    return browserlessClient;
}

export function createBrowserFactory(ctx:Env=Deno.env):BrowserFactory{
// supabase/functions/lib/browser.ts
  async function browser():Promise<Browser>{
    try {
      const browserlessClient = createBrowserlessClient(ctx);
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
  //return { browser:()=>setTimeout(browser, 1000) };
  return {browser};
}


export function createTextCoder():TextCoder{
    const textEncoder: TextEncoder = new TextEncoder();
    const textDecoder: TextDecoder = new TextDecoder();
    return {textEncoder, textDecoder};
}

export function createHexCoder(textCoder:TextCoder):HexCoder{
    const hexCoder: HexCoder = {
        encode: (input: string) => {
            return Array.from(textCoder.textEncoder.encode(input)).map(b => b.toString(16).padStart(2, '0')).join('');
        },
        decode: (hexString: string) => {
            // Convert hex string back to bytes
            const bytes = new Uint8Array(hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
            // Convert bytes back to string
            return new TextDecoder().decode(bytes);
        }
    }
    return hexCoder;
}

export function createTokenEncoder(model:string):ReturnType<typeof tiktoken.encoding_for_model>{
    return tiktoken.encoding_for_model(model);
}

export function createTokenizer(tokenEncoder:ReturnType<typeof tiktoken.encoding_for_model>,textCoder:TextCoder, hexCoder:HexCoder):Tokenizer{
    
    const encode: (input: string) => number[] = (input: string) => {
      return tokenEncoder.encode(input);
    };
    const decode: (tokens: number[]) => string = (tokens: number[]) => {
      return textCoder.textDecoder.decode(tokenEncoder.decode(tokens));
    };
    const listSlice:(input:number[])=>{start:number,end:number}[] = (input:number[])=>{
      const length:number = input.length;
      const slicesLength:number = Math.ceil(length/200);
      const slicesList:{start:number,end:number}[] = [];
      for(let i:number = 0; i < slicesLength; i++){
        slicesList.push({start:i*200,end:i*200+200})
      }
      return slicesList;
    }
    const applyListSlice:(input:number[],slicesList:{start:number,end:number}[])=>{chunk_:number[],start_:number,end_:number}[] = (input:T[],slicesList:{start:number,end:number}[])=>{
      return slicesList.map(slice=>{return {chunk_:input.slice(slice.start,slice.end),start_:slice.start,end_:slice.end}});
    }
    const chunkContent: (input:string)=>{chunk:string,start_:number,end_:number}[] = (input:string)=>{
      const tokens = tokenEncoder.encode(input);
      const slicesList = listSlice(tokens);
      const sliced = applyListSlice(tokens,slicesList);
      return sliced.map(s=>{return {chunk:textCoder.textDecoder.decode(tokenEncoder.decode(s.chunk_)),start_:s.start_,end_:s.end_}});
    }

    const chunkHexContent: (input:string,x?:Record<string,any>)=>Record<string,any>&{chunk:string,start_:number,end_:number}[] = (input:string,x?:Record<string,any>)=>{
      return chunkContent(hexCoder.decode(input)).map(c=>{return {...x,hex_chunk:hexCoder.encode(c.chunk),start_:c.start_,end_:c.end_}});
    }

    return {encode,decode,listSlice,applyListSlice,chunkContent,chunkHexContent};
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

export function createMarkdownReader(): (filePath: string) => Promise<string> {
  return async (filePath: string): Promise<string> => {
    try {
      const content = await Deno.readTextFile(filePath);
      return content;
    } catch (error) {
      throw new Error(`Failed to read markdown file at ${filePath}: ${error.message}`);
    }
  };
}


