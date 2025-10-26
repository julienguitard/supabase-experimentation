;
import { handleDenoFunction } from "../../shared/pipeline-handler.ts";

const edgeFunction: string = 'summarize-links';

Deno.serve((req:Request)=>{
  return handleDenoFunction(edgeFunction)(req);
});
