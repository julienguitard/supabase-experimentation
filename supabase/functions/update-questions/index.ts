;
import { handleDenoFunction } from "../../shared/pipeline-handler.ts";

const edgeFunction: string = 'update-questions';

Deno.serve((req:Request)=>{
  return handleDenoFunction(edgeFunction)(req);
});
