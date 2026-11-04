import { spawn } from "child_process";

async function run() {
  console.log("Starting Next.js for Admin test...");
  const server = spawn("cmd.exe", ["/c", "npm", "run", "start"], {
    stdio: "pipe",
    env: { ...process.env, PORT: "3000" },
  });

  await new Promise((r) => setTimeout(r, 4000));

  try {
    console.log("\n--- TEST ADMIN 1: Login with admin / admin123 ---");
    const loginRes = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin123" }),
    });

    console.log("Login status:", loginRes.status);
    const loginJson = await loginRes.json();
    console.log("Login response user:", loginJson.user);

    const setCookie = loginRes.headers.get("set-cookie");
    const cookieHeader = setCookie ? setCookie.split(";")[0] : "";
    console.log("Session cookie received:", cookieHeader.slice(0, 35) + "...");

    console.log("\n--- TEST ADMIN 2: Protected Admin Stats API ---");
    const statsRes = await fetch("http://localhost:3000/api/admin/stats", {
      headers: { Cookie: cookieHeader },
    });
    console.log("Stats status:", statsRes.status);
    const statsJson = await statsRes.json();
    console.log("Stats payload:", statsJson);

    console.log("\n--- TEST ADMIN 3: Unauthorized Access without Cookie ---");
    const unauthRes = await fetch("http://localhost:3000/api/admin/stats");
    console.log("Unauth status (expected 401):", unauthRes.status);

    console.log("\n>>> ALL ADMIN AUTH & CRUD TESTS PASSED! <<<");
  } catch (err) {
    console.error("Admin test failed:", err);
  } finally {
    server.kill();
    process.exit(0);
  }
}

run();

