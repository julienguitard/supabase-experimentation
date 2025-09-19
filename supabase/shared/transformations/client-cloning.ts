import { SingleAIClient } from "../../../packages/types/index.ts";


export function cloneClient(client:SingleAIClient,n:number):SingleAIClient[]{
    console.log(`[${Date.now()}] Cloning client`,n, ' times');//TODO: remove
    const clients:SingleAIClient[] = [];
    for (let i = 0; i < n; i++) {
        clients.push({...client});
    }
    return clients;
}