import puppeteer from 'puppeteer';
import randomUseragent from 'random-useragent';
import fs from 'fs';

const loginCookies = async () => {
    const header = randomUseragent.getRandom((ua) => {
        return ua.browserName === 'Chrome' && ua.osName === 'Windows';
    });

    const browser = await puppeteer.launch({ 
        headless: false,
        ignoreHTTPSErrors: true, //evita los errores de las paginas https
    });

    const page = await browser.newPage();
    await page.setUserAgent(header);
    await page.setViewport({ width: 1366, height: 768 });

    //leyendo las cookies
    const readCookies = fs.readFileSync('cookies.txt', 'utf-8');

    //parseando las cookies de string a json
    const cookies = JSON.parse(readCookies);

    await page.setCookie(...cookies);

    await page.goto('https://www.prismamoda.com/account#/profile');

    //cerrando el navegador
}

loginCookies();