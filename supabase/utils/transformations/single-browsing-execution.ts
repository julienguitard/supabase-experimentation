import type { SingleBrowsingResponseDTO, SingleCrawlableDTO, SingleCrawledDTO } from "@types";
import type { Browser } from "npm:puppeteer-core"

export async function executeSingleBrowsing(browser:Browser,singleCrawlableDTO:SingleCrawlableDTO):Promise<SingleCrawledDTO>{
    try {
        const page = await browser.newPage();
        console.log(`[${Date.now()}] page:`, page);
        await page.goto(singleCrawlableDTO.url);
        console.log(`[${Date.now()}] page.goto:`, page.goto(singleCrawlableDTO.url));
        const content = await page.content();
        console.log(`[${Date.now()}] content:`, content);
        const status = content.includes('404') ? 404 : 200;
        console.log(`[${Date.now()}] status:`, status);
        return {linkId:singleCrawlableDTO.linkId, content, status, error:null};
    }
    catch (error) {
        return {linkId:singleCrawlableDTO.linkId, content:null, status:500, error:error};
    }
}
