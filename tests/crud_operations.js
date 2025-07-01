const { app } = require("../app");
const { factory, seed_db, testUserPassword } = require("../util/seed_db");
const get_chai = require("../util/get_chai");
const Job = require("../models/Job");

describe("Job CRUD Operations", function () {
  before(async function () {
    const { expect, request } = await get_chai();
    this.expect = expect;
    this.request = request;

    // 1. Seed the DB with test user and jobs
    this.test_user = await seed_db();

    // 2. Get CSRF token and CSRF cookie from logon form
    let res = await request.execute(app).get("/session/logon").send();
    const textNoLineEnd = res.text.replaceAll("\n", "");
    this.csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd)[1];

    let cookies = res.headers["set-cookie"];
    this.csrfCookie = cookies.find((c) => c.startsWith("csrfToken"));

    // 3. Log the user in
    const loginData = {
      email: this.test_user.email,
      password: testUserPassword,
      _csrf: this.csrfToken,
    };

    res = await request
      .execute(app)
      .post("/session/logon")
      .set("Cookie", this.csrfCookie)
      .set("content-type", "application/x-www-form-urlencoded")
      .redirects(0)
      .send(loginData);

    cookies = res.headers["set-cookie"];
    this.sessionCookie = cookies.find((c) => c.startsWith("connect.sid"));

    // Confirm cookies and CSRF
    expect(this.csrfToken).to.not.be.undefined;
    expect(this.csrfCookie).to.not.be.undefined;
    expect(this.sessionCookie).to.not.be.undefined;
  });

  it("should list 20 seeded jobs", async function () {
    const res = await this.request
      .execute(app)
      .get("/job")
      .set("Cookie", [this.csrfCookie, this.sessionCookie])
      .send();

    this.expect(res.status).to.equal(200);

    // Count <tr> to determine number of jobs (1 header row + 20 entries = 21 total)
    const pageParts = res.text.split("<tr>");
    this.expect(pageParts.length).to.equal(21);
  });

  it("should create a new job and increase total to 21", async function () {
    // Build new job using factory
    const newJob = await factory.build("job");

    // Re-fetch CSRF token for the job creation form
    let res = await this.request
      .execute(app)
      .get("/job/create")
      .set("Cookie", [this.csrfCookie, this.sessionCookie])
      .send();

    const textNoLineEnd = res.text.replaceAll("\n", "");
    const newCsrf = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd)[1];

    const jobData = {
      title: newJob.title,
      description: newJob.description,
      company: newJob.company,
      location: newJob.location,
      _csrf: newCsrf,
    };

    // Post new job
    await this.request
      .execute(app)
      .post("/job/create")
      .set("Cookie", [this.csrfCookie, this.sessionCookie])
      .set("content-type", "application/x-www-form-urlencoded")
      .send(jobData);

    // Check total job count in database
    const jobs = await Job.find({ createdBy: this.test_user._id });
    this.expect(jobs.length).to.equal(21);
  });
});
