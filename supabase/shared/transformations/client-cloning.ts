import { AIClient } from "../../../packages/types/index.ts";


export function cloneClient(client:AIClient,n:number):AIClient[]{
    const clients:AIClient[] = [];
    for (let i = 0; i < n; i++) {
        clients.push(client.clone());
    }
    return clients;
}