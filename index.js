const app = require("express")();
const axios = require("axios");

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

app.get("/abudhabi/:username/:password", async (req, res) => {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    const username = req.params.username || "defaultUsername";
    const password = req.params.password || "defaultPassword";
    
    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    await page.goto("https://hub.tissl.com/login?returnUrl=%2Fhome");
    await page.waitForSelector('input[formcontrolname="username"]');

    await page.type('input[formcontrolname="username"]', username);
    await page.type('input[formcontrolname="password"]', password);
    await page.click("button.btn.btn-primary");

    await page.waitForNavigation();

    await page.goto(
      "https://hub.tissl.com/report-centre/sales-percentage-vs-total"
    );
    const token = await page.evaluate(() => {
      return localStorage.getItem("token");
    });
    // Send the token to the external API
    const apiEndpoint = "https://api.vitaliy.digital/new-token.php";
    const apiResponse = await axios.post(apiEndpoint, { token });

    // Check the API response and handle it accordingly
    console.log("API Response:", apiResponse.data);

    // Send a response to the client
    res.send(apiResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//Dubai endpoint
app.get("/dubai/:username/:password", async (req, res) => {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    const username = req.params.username || "defaultUsername";
    const password = req.params.password || "defaultPassword";
    
    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    await page.goto("https://hub.tissl.com/login?returnUrl=%2Fhome");
    await page.waitForSelector('input[formcontrolname="username"]');

    await page.type('input[formcontrolname="username"]', username);
    await page.type('input[formcontrolname="password"]', password);
    await page.click("button.btn.btn-primary");

    await page.waitForNavigation();

    await page.goto(
      "https://hub.tissl.com/report-centre/sales-percentage-vs-total"
    );
    const token = await page.evaluate(() => {
      return localStorage.getItem("token");
    });
    // Send the token to the external API
    const apiEndpoint = "https://api.vitaliy.digital/dubai/new-token.php";
    const apiResponse = await axios.post(apiEndpoint, { token });

    // Check the API response and handle it accordingly
    console.log("API Response:", apiResponse.data);

    // Send a response to the client
    res.send(apiResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;
