;
import { handleDenoFunction } from "../../shared/pipeline-handler.ts";

const edgeFunction: string = 'chunk-fragments';

Deno.serve((req:Request)=>{
  return handleDenoFunction(edgeFunction)(req);
});
