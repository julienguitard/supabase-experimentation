;
import { handleDenoFunction } from "../../shared/pipeline-handler.ts";

const edgeFunction: string = 'select-row';

Deno.serve((req:Request)=>{
  return handleDenoFunction(edgeFunction)(req);
});
