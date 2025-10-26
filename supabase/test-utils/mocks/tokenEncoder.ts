import { createTokenEncoder } from "../../shared/context-elements";

export function makeMockTokenEncoder(): ReturnType<typeof createTokenEncoder> {
    return {
        encode: (input: string) => {
            return input.split('').map(char => char.charCodeAt(0));
        },
        decode: (tokens: number[]) => {
            return tokens.map(token => String.fromCharCode(token)).join('');
        }
    }
}