import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { handleDenoFunction } from "../../shared/pipeline-handler.ts";

const edgeFunction: string = 'select-table';

Deno.serve((req:Request)=>{
  return handleDenoFunction(edgeFunction)(req);
});
