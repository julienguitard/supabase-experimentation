;
import { handleDenoFunction } from "../../shared/pipeline-handler.ts";

const edgeFunction: string = 'vectorize-chunks';

Deno.serve((req:Request)=>{
  return handleDenoFunction(edgeFunction)(req);
});
