import { handleDenoFunction } from "../../shared/pipeline-handler.ts";

const edgeFunction: string = 'update-links';

Deno.serve((req:Request)=>{
  return handleDenoFunction(edgeFunction)(req);
});
