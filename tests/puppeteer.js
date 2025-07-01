const puppeteer = require("puppeteer");
require("../app");
const { seed_db, testUserPassword } = require("../util/seed_db");
const Job = require("../models/Job");

let testUser = null;

let page = null;
let browser = null;
// Launch the browser and open a new blank page
describe("jobs-ejs puppeteer test", function () {
  before(async function () {
    this.timeout(10000);
    //await sleeper(5000)
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
  });
  after(async function () {
    this.timeout(5000);
    await browser.close();
  });
  describe("got to site", function () {
    it("should have completed a connection", async function () {});
  });
  describe("index page test", function () {
    this.timeout(10000);
    it("finds the index page logon link", async () => {
      this.logonLink = await page.waitForSelector(
        "a ::-p-text(Click this link to logon)"
      );
    });
    it("gets to the logon page", async () => {
      await this.logonLink.click();
      await page.waitForNavigation();
      const email = await page.waitForSelector('input[name="email"]');
    });
  });
  describe("logon page test", function () {
    this.timeout(20000);
    it("resolves all the fields", async () => {
      this.email = await page.waitForSelector('input[name="email"]');
      this.password = await page.waitForSelector('input[name="password"]');
      this.submit = await page.waitForSelector("button ::-p-text(Logon)");
    });
    it("sends the logon", async () => {
      testUser = await seed_db();
      await this.email.type(testUser.email);
      await this.password.type(testUserPassword);
      await this.submit.click();
      await page.waitForNavigation();
      await page.waitForSelector(`p ::-p-text(${testUser.name} is logged on.)`);
      await page.waitForSelector("a ::-p-text(change the secret)");
      await page.waitForSelector('a[href="/secretWord"]');
      const copyr = await page.waitForSelector("p ::-p-text(copyright)");
      const copyrText = await copyr.evaluate((el) => el.textContent);
      console.log("copyright text: ", copyrText);
    });
  });
  describe("puppeteer job operations", function () {
    this.timeout(30000); // set a higher timeout due to DB and UI delays

    let jobData = {
      company: "Acme Corp",
      position: "Junior Developer",
    };

    it("navigates to the job list and sees 20 entries", async function () {
      const { expect } = await import("chai");

      const jobsLink = await page.waitForSelector('a[href="/job"]');
      await jobsLink.click();
      await page.waitForNavigation();

      // Get full page HTML
      const content = await page.content();
      const rowCount = content.split("<tr>").length;
      expect(rowCount).to.equal(21); // 1 header + 20 jobs
    });

    it("clicks 'Add A Job' and sees the job form", async function () {
      const { expect } = await import("chai");

      const addButton = await page.waitForSelector('a[href="/job/create"]');
      await addButton.click();
      await page.waitForNavigation();

      const companyField = await page.waitForSelector('input[name="company"]');
      const positionField = await page.waitForSelector(
        'input[name="position"]'
      );
      const formButton = await page.waitForSelector('button[type="submit"]');

      expect(companyField).to.not.be.null;
      expect(positionField).to.not.be.null;
      expect(formButton).to.not.be.null;

      // Store references for next test
      this.companyField = companyField;
      this.positionField = positionField;
      this.submitButton = formButton;
    });

    it("adds a job and verifies it shows up in DB and UI", async function () {
      const { expect } = await import("chai");

      // Enter form data
      await this.companyField.type(jobData.company);
      await this.positionField.type(jobData.position);
      await this.submitButton.click();

      await page.waitForNavigation();

      // Wait for confirmation message
      await page.waitForSelector("p ::-p-text(Job entry created)");

      // Checks that the job was added in DB
      const jobs = await Job.find({ createdBy: testUser._id })
        .sort({ createdAt: -1 })
        .limit(1);
      const latestJob = jobs[0];

      expect(latestJob).to.not.be.undefined;
      expect(latestJob.company).to.equal(jobData.company);
      expect(latestJob.position).to.equal(jobData.position);
    });
  });
});
