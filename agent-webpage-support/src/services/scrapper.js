import axios from "axios";
import "dotenv/config";
import * as cheerio from "cheerio";
import OpenAI from "openai";
import { ChromaClient } from "chromadb";
import puppeteer from "puppeteer";

async function scrapeBodyContent(url) {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  const content = await page.evaluate(() => {
    return document.body.innerText.replace(/\s+/g, " ").trim();
  });

  // console.log(content);

  await browser.close();

  return content;
}

// scrapeBodyContent("https://lokeshwardewangan.in");


export async function scrapWebpage(url = "") {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const bodyContent = await scrapeBodyContent(url);

  const internalLinks = new Set();
  const externalLinks = new Set();

  $("a").each((_, el) => {
    const link = $(el).attr("href");
    if (link === "/") return;
    if (link.startsWith("http") || link.startsWith("https")) {
      externalLinks.add(link);
    } else if (link.startsWith("/") && !link.includes("#")) {
      internalLinks.add(link);
    }
  });

  return {
    body: bodyContent,
    internalLinks: [...internalLinks],
    externalLinks: [...externalLinks],
  };
}


// async function main(){
//   const { body, externalLinks, internalLinks } = await scrapWebpage("https://lokeshwardewangan.in");
//   console.log("body", body.slice(0, 100));
//   console.log(externalLinks)
//   console.log(internalLinks);
// }
// main();