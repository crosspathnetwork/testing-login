// import puppeteer from "puppeteer";
import csv from "csv-parser";
import fs from "fs";
import path from "path";

import readcsv from "./readcsv.js";
import puppeteer from "puppeteer";
import random from "random-name";
import generator from "generate-password";
import { Agent } from "http";

async function main() {
  

  

  const runThis = async () => {
    await page.goto("https://becrosspath.com/");
     page.waitForNavigation();
    page.setDefaultTimeout(10000)
    console.log("starting");
    //finished setting up

    //getting random signups and putting them in array
    console.log("About to click on signup");
    await page.click("button.btn.pill.s.bg.primary");
    console.log("Clicked on signup");
    // await page.waitForSelector("li > a.btn.default");
    await page.waitForTimeout(500);
    console.log("waiting for signup");
    await page.click("li > a.btn.default");
    console.log("hurar");
    console.log("signup page");

    // Goes to the recruiter section
    await page.waitForNavigation();
    await page.click("xpath//html/body/div/div/header/a");
    const data = await page.waitForXPath("/html/body/div/div/main");
    //Typing all the values
    //First name
    await page.reload();
    await page.waitForTimeout(1000)
    const firstName = random.first();
    const middleName = random.middle();
    await page.click("xpath//html/body/div/div/main/div[1]");
    
    await page.type(
      "xpath//html/body/div/div/main/div[1]/div/input",
      firstName
    );
    //Second name
    await page.click("xpath//html/body/div/div/main/div[2]");
   
    await page.type(
      "xpath//html/body/div/div/main/div[2]/div/input",
      middleName
    );
    //Email
    await page.click("xpath//html/body/div/div/main/div[3]");
    
    await page.type(
      "xpath//html/body/div/div/main/div[3]/div/input",
      `${firstName}@test.crosspath.com`
    );
    //Phone number
    let number = "+44";
    for (let i = 0; i < 11; i++) {
      const randoNo = Math.floor(Math.random() * 9);
      number += randoNo;
    }
    await page.click("xpath//html/body/div/div/main/div[5]");
    
    await page.type("xpath//html/body/div/div/main/div[5]/div/input", number);
    //password
    const password = generator.generate({
      length: 10,
      numbers: true,
    });
    console.log(password);
    await page.click("xpath//html/body/div/div/main/div[6]");
    
    await page.type("xpath//html/body/div/div/main/div[6]/div/input", password);
    //clicking on submit
    await page.waitForTimeout(1000)
    await page.click("xpath//html/body/div/div/main/button");
    console.log("First passed");

    //the one welcome button right after signup
    await page.waitForNavigation();
    await page.waitForSelector("#layout > div > main > button");
    await page.click("#layout > div > main > button");
    console.log("Second passed");

    //First round of question, which country do you live
    await page.waitForSelector(".contValue > input");
    //await page.waitForNetworkIdle()
    let languagesFilePath = path.join(process.cwd(), "data", "Geolocation.csv");
    let languages = await readcsv(languagesFilePath);
    let randoNo = Math.floor(Math.random() * languages.length - 1);
    let country = languages[randoNo].parent.split("/")[1].replaceAll("-", " ");
    await page.type(
      ".contValue > input",

      country
    );
    await page.waitForTimeout(1000);
    await page.click("button.btn.s");
    await page.click("button.btn.bg.primary");
    console.log("languange passed ");

    async function chooseTest(responseURL, dataFrom, amount) {
      //await page.waitForTimeout(3000);

      await page.waitForResponse(
        (response) =>
          //console.log(response.url())
          response.url() === responseURL && response.status() === 200
      );
      const pathing = path.join(process.cwd(), "data", dataFrom);
      const values = await readcsv(pathing);
      let randoAmount = Math.floor(Math.random() * amount);
      if (amount == 1) {
        randoAmount = amount;
      }

      //gets elementHandle, and first types it
      const input = await page.$(".contValue > input");
      for (let x = 0; x < randoAmount; x++) {
        const random = Math.floor(Math.random() * (values.length - 1));
        await input.type(values[random].label);
        await page.waitForTimeout(1000);
        await page.waitForSelector(".col.menu > li > .btn.s");
        await page.click(".col.menu > li > .btn.s");
        await input.click({ clickCount: 3 });
      }
      const errorOrNot = false;
      try {
        page.$(".card.row.bg.dark.glass");
        
      } catch (err) {
        errorOrNot = true;
      }
      if (errorOrNot) {
        await page.waitForTimeout(1000);
        await page.click(".svg-times-circle");
        await page.click(".col.menu > li > .btn.s");
      } else {
        await page.waitForTimeout(1000);
        await page.click("button.btn.bg.primary");
      }
    }

    await chooseTest("https://becrosspath.com/hub/sectors", "Sector.csv", 5);
    console.log("sector passed ");

    //tehre is a problem here, sometimes
    await chooseTest(
      "https://becrosspath.com/hub/positions",
      "Position.csv",
      5
    );
    console.log("position passed ");

    //Selecting only first one for amount of companies to specialise in.
    await page.waitForTimeout(1000);
    await page.click(".col.menu > li > .btn.s");
    await page.waitForTimeout(500);
    await page.click("button.btn.bg.primary");
/// THIS IS TO SUPPOSE TO BE HARD 
    await chooseTest(
      "https://becrosspath.com/hub/skills/hard",
      "HardSkill.csv",
      10
    );
    console.log("HardSkill passed ");

    //await page.waitForTimeout(2000);
    await page.waitForResponse(
      (response) =>
        //console.log(response.url())
        response.url() === "https://becrosspath.com/hub/locations" &&
        response.status() === 200
    );
    languagesFilePath = path.join(process.cwd(), "data", "Geolocation.csv");
    languages = await readcsv(languagesFilePath);
    randoNo = Math.floor(Math.random() * languages.length - 1);
    let area = languages[randoNo].parent.split("/")[0].replaceAll("-", " ");
    await page.type(".contValue > input", area);
    await page.waitForTimeout(2000);
    await page.click("button.btn.s");
    await page.click("button.btn.bg.primary");

    await chooseTest(
      "https://becrosspath.com/hub/languages",
      "Language.csv",
      5
    );
    console.log("Languange passed");

    async function typingSignUp(type) {
      await page.waitForTimeout(1000);
      const randomName = random.last();
      await page.type(".contValue > input", `${randomName} ${type}`);
      await page.click("button.btn.bg.primary");
    }
    await typingSignUp("University");
    await typingSignUp("Agency");
    await typingSignUp("Limited");
    console.log("type passed");

    await chooseTest(
      "https://becrosspath.com/hub/seniorities",
      "Seniority.csv",
      1
    );
    console.log("Seniority passed");

    await page.waitForTimeout(1500);
    await page.click(".col.menu > li > .btn.s");
    await page.click("button.btn.bg.primary");
    console.log("Freelancer passed");
    await page.waitForTimeout(1000);
    await page.click("button.btn.bg.primary");
    console.log("All passed ");

    await page.waitForNavigation();
    await page.click(" .contPopover > .profile.row");
    await page.waitForTimeout(1000);
    await page.click("#page > header > div > ul > li > button:nth-child(2)");
  };
  let browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  let page = await browser.newPage();

  const runLoop = async (amount) => {
    
    let x = 0;
    while (x < amount) {
      try {
        await runThis();
        x++;
        console.log(x)
      } catch (err) {
        console.log(err);
        await browser.close();
        const newBrowser = await puppeteer.launch({
          headless: false,
          defaultViewport: null,
        });
        page = await newBrowser.newPage();
        continue;
      }
    }
  };
  
  await runLoop(10)
}
main();
//https://becrosspath.com/hub/seniorities<div class="card row bg dark glass">…</div>flex<i class="svg-times-circle">
