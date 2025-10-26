;
import { handleDenoFunction } from "../../shared/pipeline-handler.ts";

const edgeFunction: string = 'delete-links';

Deno.serve((req:Request)=>{
  return handleDenoFunction(edgeFunction)(req);
});
