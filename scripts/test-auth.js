require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));
(async () => {
  try {
    // register a fresh user so we know the password
    const reg = await fetch("http://localhost:3003/auth/register/client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "ScriptUser",
        email: "script@example.com",
        password: "secret",
        phone: "123",
        address: "addr",
      }),
    });
    console.log("register status", reg.status);
    if (reg.status === 409) {
      console.log("user already existed");
    }

    const login = await fetch("http://localhost:3003/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "script@example.com", password: "secret" }),
    });
    const data = await login.json();
    console.log("login status", login.status, data);
    const token = data.accessToken || data.access_token;
    if (token) {
      const job = await fetch("http://localhost:3003/jobs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "x",
          category: "Other",
          description: "desc",
        }),
      });
      console.log("post job", job.status, await job.text());
    }
  } catch (e) {
    console.error(e);
  }
})();
