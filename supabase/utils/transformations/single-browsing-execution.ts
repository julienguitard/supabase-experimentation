import type { Browser } from "https://deno.land/x/puppeteer@16.2.0/src/deno/Puppeteer.ts";
import type { SingleBrowsingResponseDTO } from "@types";

export async function executeSingleBrowsing(browser:Browser,url:string):Promise<SingleBrowsingResponseDTO>{
    try {
        const page = await browser.newPage();
        await page.goto(url);
        const content = await page.content();
        const status = page.status();
        return {content, status, error:null};
    }
    catch (error) {
        return {content:null, status:500, error:error};
    }
}
