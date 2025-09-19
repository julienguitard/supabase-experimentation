import { SingleAIClient } from "../../../packages/types/index.ts";


export function distributeResourceDataSlice<T>(resources:R[], dataSlice:T[]):[R,T[]][]{
    const resourceLength = resources.length;
    const dataSliceLength = dataSlice.length;
    const dataSliceLengthPerResource = Math.floor(dataSliceLength / resourceLength) + 1;
    const resourceDataSlice:[R,T[]][] = [];
    for (let i = 0; i < resourceLength; i++) {
        resourceDataSlice.push([resources[i], dataSlice.slice(i * dataSliceLengthPerResource, (i + 1) * dataSliceLengthPerResource)]);
    }
    return resourceDataSlice;
}


