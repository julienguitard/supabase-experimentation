import { createAuthenticatedSupabaseClient } from "./context.ts";
import { createResponse, createResponseDTOFromAuthenticationError } from "./pipeline-elements.ts";
import { createClientsContext, getPipelineGenerator } from "./pipelines.ts";


export function createPipeline(name:string){
    return getPipelineGenerator(name);
}

export async function handlePipeline(ctx:ClientsContext, pipeline:Pipeline, req:Request) {
    try {
        const supabaseClient = createAuthenticatedSupabaseClient(Deno.env, req);
        const {data: {user}} = await supabaseClient.auth.getUser();
        console.log(`[${Date.now()}] user`, user);

        let steps:ReturnType<typeof pipeline>;
        if (ctx.browserlessClient) {
            console.log(`[${Date.now()}] Using browserless pipeline`);
            steps = pipeline(supabaseClient, ctx.browserlessClient, ctx.hexCoder);
        } else if (ctx.tokenizer) {
            console.log(`[${Date.now()}] Using tokenizer pipeline`);
            steps = pipeline(supabaseClient, ctx.hexCoder, ctx.tokenizer);
        } else if (ctx.aiClient) {
            console.log(`[${Date.now()}] Using AI client pipeline`);
            steps = pipeline(supabaseClient, ctx.hexCoder, ctx.aiClient);
        } else {
            console.log(`[${Date.now()}] Using basic pipeline`);
            steps = pipeline(supabaseClient);
        }
         
        // Detailed steps validation
        console.log(`[${Date.now()}] Pipeline created. Validating steps...`);
        console.log(`[${Date.now()}] Steps array:`, steps);
        console.log(`[${Date.now()}] Steps length:`, steps?.length);
        console.log(`[${Date.now()}] Steps type:`, typeof steps);
        console.log(`[${Date.now()}] Is steps array?:`, Array.isArray(steps));
        

        let arg:any = req;
        for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
            const step = steps[stepIndex];
            console.log(`[${Date.now()}] Step ${stepIndex}:`);
            arg = await step(arg);
            console.log(`[${Date.now()}] Step ${stepIndex} complete:`, arg);
        }
        return arg;
    } catch (error) {
        console.error(`[${Date.now()}] Error:`, error);
        return createResponseDTOFromAuthenticationError(error);
    }
}

export function handleDenoFunction(name: string) {
   const denoHandler = async (req:Request)=>{
        const ctx = createClientsContext(name);
        const pipeline = createPipeline(name);
        const response = await handlePipeline(ctx, pipeline, req);
        return createResponse(response);
    };
    
    return denoHandler;
}