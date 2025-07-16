import type { Browser } from "https://deno.land/x/puppeteer@16.2.0/src/deno/Puppeteer.ts";
import type { DBResponseDTO } from "@types";

export async function executeSingeBrowsing(browser:Browser,url:string):Promise<DBResponseDTO<string>>{
    try {
        const page = await browser.newPage();
        await page.goto(url);
        const content = await page.content();
        return {content, error:null};
    }
    catch (error) {
        return {content:null, error:error};
    }
}
