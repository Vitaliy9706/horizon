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

app.get("/high-yield-stocks/:email/:password", async (req, res) => {
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
    const email = req.params.email || "defaultEmail";
    const password = req.params.password || "defaultPassword";

    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    await page.goto("https://2.simplysafedividends.com/sign_in");
    await page.waitForSelector("#email");

    await page.type("#email", email);
    await page.type("#password", password);
    await page.click('input[type="submit"][value="Login"]');

    await page.waitForNavigation();

    await page.goto(
      "https://2.simplysafedividends.com/idea_lists/high-yield-stocks"
    );
    await page.waitForSelector("table.table.companies");

    const tableData = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("table.table.companies tbody tr")
      );
      return rows.map((row) => {
        const columns = row.querySelectorAll("td");
        const symbolAndName = columns[0]?.innerText.trim().split("\n");
        const symbol = symbolAndName[0].split(" • ")[0].trim(); // Extract symbol (WHR)
        const name = symbolAndName[1]?.trim(); // Extract name (Whirlpool)

        // Clean and format the rest of the data
        const cleanText = (text) =>
          text.replace(/\n/g, "").replace(/\s+/g, " ").trim(); // Removes \n and extra spaces
        return {
          symbol: symbol,
          name_clean: name,
          name: columns[0]?.innerText.trim(),
          sector: columns[1]?.innerText.trim(),
          market_cap: columns[2]?.getAttribute("data-value"),
          beta: columns[3]?.getAttribute("data-value"),
          timelines: columns[4]?.innerText.trim(),
          dividend_yield: columns[5]?.getAttribute("data-value"),
          pe_ratio: columns[6]?.getAttribute("data-value"),
          dividend_safety: columns[7]?.getAttribute("data-value"),
          dividend_growth: columns[8]?.getAttribute("data-value"),
          five_year_dividend_growth: columns[9]?.getAttribute("data-value"),
          twenty_year_dividend_growth: columns[10]?.getAttribute("data-value"),
          dividend_growth_streak: columns[11]?.getAttribute("data-value"),
          uninterrupted_dividend_streak:
            columns[12]?.getAttribute("data-value"),
          dividend_taxation: columns[13]?.getAttribute("data-value"),
          ex_dividend_date: columns[14]?.getAttribute("data-value"),
          payment_frequency: columns[15]?.getAttribute("data-value"),
          payment_schedule: columns[16]?.getAttribute("data-value"),
          payout_ratio: columns[17]?.getAttribute("data-value"),
          net_debt_to_capital: columns[18]?.getAttribute("data-value"),
          net_debt_to_ebitda: columns[19]?.getAttribute("data-value"),
          free_cash_flow: columns[20]?.getAttribute("data-value"),
          recession_dividend: columns[21]?.getAttribute("data-value"),
          recession_return: columns[22]?.getAttribute("data-value"),
        };
      });
    });

    await browser.close();

    const apiResponse = await axios.post(
      "https://api.vitaliy.digital/stockscout/create-high_yield_stocks.php",
      tableData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Send the data as JSON response
    res.json(apiResponse.data);

    // Check the API response and handle it accordingly
    console.log("API Response:", apiResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
//high growth stocks
app.get("/high-growth-stocks/:email/:password", async (req, res) => {
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
    const email = req.params.email || "defaultEmail";
    const password = req.params.password || "defaultPassword";

    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    await page.goto("https://2.simplysafedividends.com/sign_in");
    await page.waitForSelector("#email");

    await page.type("#email", email);
    await page.type("#password", password);
    await page.click('input[type="submit"][value="Login"]');

    await page.waitForNavigation();

    await page.goto(
      "https://2.simplysafedividends.com/idea_lists/high-growth-stocks"
    );
    await page.waitForSelector("table.table.companies");

    const tableData = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("table.table.companies tbody tr")
      );
      return rows.map((row) => {
        const columns = row.querySelectorAll("td");
        const symbolAndName = columns[0]?.innerText.trim().split("\n");
        const symbol = symbolAndName[0].split(" • ")[0].trim(); // Extract symbol (WHR)
        const name = symbolAndName[1]?.trim(); // Extract name (Whirlpool)

        // Clean and format the rest of the data
        const cleanText = (text) =>
          text.replace(/\n/g, "").replace(/\s+/g, " ").trim(); // Removes \n and extra spaces
        return {
          symbol: symbol,
          name_clean: name,
          name: columns[0]?.innerText.trim(),
          sector: columns[1]?.innerText.trim(),
          market_cap: columns[2]?.getAttribute("data-value"),
          beta: columns[3]?.getAttribute("data-value"),
          timelines: columns[4]?.innerText.trim(),
          dividend_yield: columns[5]?.getAttribute("data-value"),
          pe_ratio: columns[6]?.getAttribute("data-value"),
          dividend_safety: columns[7]?.getAttribute("data-value"),
          dividend_growth: columns[8]?.getAttribute("data-value"),
          five_year_dividend_growth: columns[9]?.getAttribute("data-value"),
          twenty_year_dividend_growth: columns[10]?.getAttribute("data-value"),
          dividend_growth_streak: columns[11]?.getAttribute("data-value"),
          uninterrupted_dividend_streak:
            columns[12]?.getAttribute("data-value"),
          dividend_taxation: columns[13]?.getAttribute("data-value"),
          ex_dividend_date: columns[14]?.getAttribute("data-value"),
          payment_frequency: columns[15]?.getAttribute("data-value"),
          payment_schedule: columns[16]?.getAttribute("data-value"),
          payout_ratio: columns[17]?.getAttribute("data-value"),
          net_debt_to_capital: columns[18]?.getAttribute("data-value"),
          net_debt_to_ebitda: columns[19]?.getAttribute("data-value"),
          free_cash_flow: columns[20]?.getAttribute("data-value"),
          recession_dividend: columns[21]?.getAttribute("data-value"),
          recession_return: columns[22]?.getAttribute("data-value"),
        };
      });
    });

    await browser.close();

    const apiResponse = await axios.post(
      "https://api.vitaliy.digital/stockscout/create-high_growth_stocks.php",
      tableData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Send the data as JSON response
    res.json(apiResponse.data);

    // Check the API response and handle it accordingly
    console.log("API Response:", apiResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
//aristocrats
app.get("/aristocrats/:email/:password", async (req, res) => {
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
    const email = req.params.email || "defaultEmail";
    const password = req.params.password || "defaultPassword";

    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    await page.goto("https://2.simplysafedividends.com/sign_in");
    await page.waitForSelector("#email");

    await page.type("#email", email);
    await page.type("#password", password);
    await page.click('input[type="submit"][value="Login"]');

    await page.waitForNavigation();

    await page.goto("https://2.simplysafedividends.com/idea_lists/aristocrats");
    await page.waitForSelector("table.table.companies");

    const tableData = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("table.table.companies tbody tr")
      );
      return rows.map((row) => {
        const columns = row.querySelectorAll("td");
        const symbolAndName = columns[0]?.innerText.trim().split("\n");
        const symbol = symbolAndName[0].split(" • ")[0].trim(); // Extract symbol (WHR)
        const name = symbolAndName[1]?.trim(); // Extract name (Whirlpool)

        // Clean and format the rest of the data
        const cleanText = (text) =>
          text.replace(/\n/g, "").replace(/\s+/g, " ").trim(); // Removes \n and extra spaces
        return {
          symbol: symbol,
          name_clean: name,
          name: columns[0]?.innerText.trim(),
          sector: columns[1]?.innerText.trim(),
          market_cap: columns[2]?.getAttribute("data-value"),
          beta: columns[3]?.getAttribute("data-value"),
          timelines: columns[4]?.innerText.trim(),
          dividend_yield: columns[5]?.getAttribute("data-value"),
          pe_ratio: columns[6]?.getAttribute("data-value"),
          dividend_safety: columns[7]?.getAttribute("data-value"),
          dividend_growth: columns[8]?.getAttribute("data-value"),
          five_year_dividend_growth: columns[9]?.getAttribute("data-value"),
          twenty_year_dividend_growth: columns[10]?.getAttribute("data-value"),
          dividend_growth_streak: columns[11]?.getAttribute("data-value"),
          uninterrupted_dividend_streak:
            columns[12]?.getAttribute("data-value"),
          dividend_taxation: columns[13]?.getAttribute("data-value"),
          ex_dividend_date: columns[14]?.getAttribute("data-value"),
          payment_frequency: columns[15]?.getAttribute("data-value"),
          payment_schedule: columns[16]?.getAttribute("data-value"),
          payout_ratio: columns[17]?.getAttribute("data-value"),
          net_debt_to_capital: columns[18]?.getAttribute("data-value"),
          net_debt_to_ebitda: columns[19]?.getAttribute("data-value"),
          free_cash_flow: columns[20]?.getAttribute("data-value"),
          recession_dividend: columns[21]?.getAttribute("data-value"),
          recession_return: columns[22]?.getAttribute("data-value"),
        };
      });
    });

    await browser.close();

    const apiResponse = await axios.post(
      "https://api.vitaliy.digital/stockscout/create-aristocrats.php",
      tableData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Send the data as JSON response
    res.json(apiResponse.data);

    // Check the API response and handle it accordingly
    console.log("API Response:", apiResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
//kings
app.get("/kings/:email/:password", async (req, res) => {
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
    const email = req.params.email || "defaultEmail";
    const password = req.params.password || "defaultPassword";

    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    await page.goto("https://2.simplysafedividends.com/sign_in");
    await page.waitForSelector("#email");

    await page.type("#email", email);
    await page.type("#password", password);
    await page.click('input[type="submit"][value="Login"]');

    await page.waitForNavigation();

    await page.goto("https://2.simplysafedividends.com/idea_lists/kings");
    await page.waitForSelector("table.table.companies");

    const tableData = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("table.table.companies tbody tr")
      );
      return rows.map((row) => {
        const columns = row.querySelectorAll("td");
        const symbolAndName = columns[0]?.innerText.trim().split("\n");
        const symbol = symbolAndName[0].split(" • ")[0].trim(); // Extract symbol (WHR)
        const name = symbolAndName[1]?.trim(); // Extract name (Whirlpool)

        // Clean and format the rest of the data
        const cleanText = (text) =>
          text.replace(/\n/g, "").replace(/\s+/g, " ").trim(); // Removes \n and extra spaces
        return {
          symbol: symbol,
          name_clean: name,
          name: columns[0]?.innerText.trim(),
          sector: columns[1]?.innerText.trim(),
          market_cap: columns[2]?.getAttribute("data-value"),
          beta: columns[3]?.getAttribute("data-value"),
          timelines: columns[4]?.innerText.trim(),
          dividend_yield: columns[5]?.getAttribute("data-value"),
          pe_ratio: columns[6]?.getAttribute("data-value"),
          dividend_safety: columns[7]?.getAttribute("data-value"),
          dividend_growth: columns[8]?.getAttribute("data-value"),
          five_year_dividend_growth: columns[9]?.getAttribute("data-value"),
          twenty_year_dividend_growth: columns[10]?.getAttribute("data-value"),
          dividend_growth_streak: columns[11]?.getAttribute("data-value"),
          uninterrupted_dividend_streak:
            columns[12]?.getAttribute("data-value"),
          dividend_taxation: columns[13]?.getAttribute("data-value"),
          ex_dividend_date: columns[14]?.getAttribute("data-value"),
          payment_frequency: columns[15]?.getAttribute("data-value"),
          payment_schedule: columns[16]?.getAttribute("data-value"),
          payout_ratio: columns[17]?.getAttribute("data-value"),
          net_debt_to_capital: columns[18]?.getAttribute("data-value"),
          net_debt_to_ebitda: columns[19]?.getAttribute("data-value"),
          free_cash_flow: columns[20]?.getAttribute("data-value"),
          recession_dividend: columns[21]?.getAttribute("data-value"),
          recession_return: columns[22]?.getAttribute("data-value"),
        };
      });
    });

    await browser.close();

    const apiResponse = await axios.post(
      "https://api.vitaliy.digital/stockscout/create-kings.php",
      tableData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Send the data as JSON response
    res.json(apiResponse.data);

    // Check the API response and handle it accordingly
    console.log("API Response:", apiResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
//achievers
app.get("/achivers/:email/:password", async (req, res) => {
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
    const email = req.params.email || "defaultEmail";
    const password = req.params.password || "defaultPassword";

    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    await page.goto("https://2.simplysafedividends.com/sign_in");
    await page.waitForSelector("#email");

    await page.type("#email", email);
    await page.type("#password", password);
    await page.click('input[type="submit"][value="Login"]');

    await page.waitForNavigation();

    await page.goto("https://2.simplysafedividends.com/idea_lists/achievers");
    await page.waitForSelector("table.table.companies");

    const tableData = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("table.table.companies tbody tr")
      );
      return rows.map((row) => {
        const columns = row.querySelectorAll("td");
        const symbolAndName = columns[0]?.innerText.trim().split("\n");
        const symbol = symbolAndName[0].split(" • ")[0].trim(); // Extract symbol (WHR)
        const name = symbolAndName[1]?.trim(); // Extract name (Whirlpool)

        // Clean and format the rest of the data
        const cleanText = (text) =>
          text.replace(/\n/g, "").replace(/\s+/g, " ").trim(); // Removes \n and extra spaces
        return {
          symbol: symbol,
          name_clean: name,
          name: columns[0]?.innerText.trim(),
          sector: columns[1]?.innerText.trim(),
          market_cap: columns[2]?.getAttribute("data-value"),
          beta: columns[3]?.getAttribute("data-value"),
          timelines: columns[4]?.innerText.trim(),
          dividend_yield: columns[5]?.getAttribute("data-value"),
          pe_ratio: columns[6]?.getAttribute("data-value"),
          dividend_safety: columns[7]?.getAttribute("data-value"),
          dividend_growth: columns[8]?.getAttribute("data-value"),
          five_year_dividend_growth: columns[9]?.getAttribute("data-value"),
          twenty_year_dividend_growth: columns[10]?.getAttribute("data-value"),
          dividend_growth_streak: columns[11]?.getAttribute("data-value"),
          uninterrupted_dividend_streak:
            columns[12]?.getAttribute("data-value"),
          dividend_taxation: columns[13]?.getAttribute("data-value"),
          ex_dividend_date: columns[14]?.getAttribute("data-value"),
          payment_frequency: columns[15]?.getAttribute("data-value"),
          payment_schedule: columns[16]?.getAttribute("data-value"),
          payout_ratio: columns[17]?.getAttribute("data-value"),
          net_debt_to_capital: columns[18]?.getAttribute("data-value"),
          net_debt_to_ebitda: columns[19]?.getAttribute("data-value"),
          free_cash_flow: columns[20]?.getAttribute("data-value"),
          recession_dividend: columns[21]?.getAttribute("data-value"),
          recession_return: columns[22]?.getAttribute("data-value"),
        };
      });
    });

    await browser.close();

    const apiResponse = await axios.post(
      "https://api.vitaliy.digital/stockscout/create-achivers.php",
      tableData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Send the data as JSON response
    res.json(apiResponse.data);

    // Check the API response and handle it accordingly
    console.log("API Response:", apiResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
//buffetts
app.get("/buffetts/:email/:password", async (req, res) => {
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
    const email = req.params.email || "defaultEmail";
    const password = req.params.password || "defaultPassword";

    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    await page.goto("https://2.simplysafedividends.com/sign_in");
    await page.waitForSelector("#email");

    await page.type("#email", email);
    await page.type("#password", password);
    await page.click('input[type="submit"][value="Login"]');

    await page.waitForNavigation();

    await page.goto(
      "https://2.simplysafedividends.com/idea_lists/buffetts-picks"
    );
    await page.waitForSelector("table.table.companies");

    const tableData = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("table.table.companies tbody tr")
      );
      return rows.map((row) => {
        const columns = row.querySelectorAll("td");
        const symbolAndName = columns[0]?.innerText.trim().split("\n");
        const symbol = symbolAndName[0].split(" • ")[0].trim(); // Extract symbol (WHR)
        const name = symbolAndName[1]?.trim(); // Extract name (Whirlpool)

        // Clean and format the rest of the data
        const cleanText = (text) =>
          text.replace(/\n/g, "").replace(/\s+/g, " ").trim(); // Removes \n and extra spaces
        return {
          symbol: symbol,
          name_clean: name,
          name: columns[0]?.innerText.trim(),
          sector: columns[1]?.innerText.trim(),
          market_cap: columns[2]?.getAttribute("data-value"),
          beta: columns[3]?.getAttribute("data-value"),
          timelines: columns[4]?.innerText.trim(),
          dividend_yield: columns[5]?.getAttribute("data-value"),
          pe_ratio: columns[6]?.getAttribute("data-value"),
          dividend_safety: columns[7]?.getAttribute("data-value"),
          dividend_growth: columns[8]?.getAttribute("data-value"),
          five_year_dividend_growth: columns[9]?.getAttribute("data-value"),
          twenty_year_dividend_growth: columns[10]?.getAttribute("data-value"),
          dividend_growth_streak: columns[11]?.getAttribute("data-value"),
          uninterrupted_dividend_streak:
            columns[12]?.getAttribute("data-value"),
          dividend_taxation: columns[13]?.getAttribute("data-value"),
          ex_dividend_date: columns[14]?.getAttribute("data-value"),
          payment_frequency: columns[15]?.getAttribute("data-value"),
          payment_schedule: columns[16]?.getAttribute("data-value"),
          payout_ratio: columns[17]?.getAttribute("data-value"),
          net_debt_to_capital: columns[18]?.getAttribute("data-value"),
          net_debt_to_ebitda: columns[19]?.getAttribute("data-value"),
          free_cash_flow: columns[20]?.getAttribute("data-value"),
          recession_dividend: columns[21]?.getAttribute("data-value"),
          recession_return: columns[22]?.getAttribute("data-value"),
        };
      });
    });

    await browser.close();

    const apiResponse = await axios.post(
      "https://api.vitaliy.digital/stockscout/create-buffetts.php",
      tableData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Send the data as JSON response
    res.json(apiResponse.data);

    // Check the API response and handle it accordingly
    console.log("API Response:", apiResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
//monthly-payers
app.get("/monthly-payers/:email/:password", async (req, res) => {
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
    const email = req.params.email || "defaultEmail";
    const password = req.params.password || "defaultPassword";

    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    await page.goto("https://2.simplysafedividends.com/sign_in");
    await page.waitForSelector("#email");

    await page.type("#email", email);
    await page.type("#password", password);
    await page.click('input[type="submit"][value="Login"]');

    await page.waitForNavigation();

    await page.goto(
      "https://2.simplysafedividends.com/idea_lists/safe-monthly-payers"
    );
    await page.waitForSelector("table.table.companies");

    const tableData = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("table.table.companies tbody tr")
      );
      return rows.map((row) => {
        const columns = row.querySelectorAll("td");
        const symbolAndName = columns[0]?.innerText.trim().split("\n");
        const symbol = symbolAndName[0].split(" • ")[0].trim(); // Extract symbol (WHR)
        const name = symbolAndName[1]?.trim(); // Extract name (Whirlpool)

        // Clean and format the rest of the data
        const cleanText = (text) =>
          text.replace(/\n/g, "").replace(/\s+/g, " ").trim(); // Removes \n and extra spaces
        return {
          symbol: symbol,
          name_clean: name,
          name: columns[0]?.innerText.trim(),
          sector: columns[1]?.innerText.trim(),
          market_cap: columns[2]?.getAttribute("data-value"),
          beta: columns[3]?.getAttribute("data-value"),
          timelines: columns[4]?.innerText.trim(),
          dividend_yield: columns[5]?.getAttribute("data-value"),
          pe_ratio: columns[6]?.getAttribute("data-value"),
          dividend_safety: columns[7]?.getAttribute("data-value"),
          dividend_growth: columns[8]?.getAttribute("data-value"),
          five_year_dividend_growth: columns[9]?.getAttribute("data-value"),
          twenty_year_dividend_growth: columns[10]?.getAttribute("data-value"),
          dividend_growth_streak: columns[11]?.getAttribute("data-value"),
          uninterrupted_dividend_streak:
            columns[12]?.getAttribute("data-value"),
          dividend_taxation: columns[13]?.getAttribute("data-value"),
          ex_dividend_date: columns[14]?.getAttribute("data-value"),
          payment_frequency: columns[15]?.getAttribute("data-value"),
          payment_schedule: columns[16]?.getAttribute("data-value"),
          payout_ratio: columns[17]?.getAttribute("data-value"),
          net_debt_to_capital: columns[18]?.getAttribute("data-value"),
          net_debt_to_ebitda: columns[19]?.getAttribute("data-value"),
          free_cash_flow: columns[20]?.getAttribute("data-value"),
          recession_dividend: columns[21]?.getAttribute("data-value"),
          recession_return: columns[22]?.getAttribute("data-value"),
        };
      });
    });

    await browser.close();

    const apiResponse = await axios.post(
      "https://api.vitaliy.digital/stockscout/create-monthly_payers.php",
      tableData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Send the data as JSON response
    res.json(apiResponse.data);

    // Check the API response and handle it accordingly
    console.log("API Response:", apiResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

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
