import { AIClient } from "../../../packages/types/index.ts";


export function distributeClientDataSlice<T>(clients:AIClient[], dataSlice:T[]):[AIClient,T[]][]{
    const clientLength = clients.length;
    const dataSliceLength = dataSlice.length;
    const dataSliceLengthPerClient = dataSliceLength / clientLength;
    const clientDataSlice:[AIClient,T[]][] = [];
    for (let i = 0; i < clientLength; i++) {
        clientDataSlice.push([clients[i], dataSlice.slice(i * dataSliceLengthPerClient, (i + 1) * dataSliceLengthPerClient)]);
    }
    return clientDataSlice;
}


