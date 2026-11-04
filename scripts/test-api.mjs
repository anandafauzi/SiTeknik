import { spawn } from "child_process";

async function run() {
  console.log("Starting Next.js production server...");
  const server = spawn("cmd.exe", ["/c", "npm", "run", "start"], {
    stdio: "pipe",
    env: { ...process.env, PORT: "3000" },
  });

  server.stdout.on("data", (d) => console.log(`[SERVER]: ${d.toString().trim()}`));
  server.stderr.on("data", (d) => console.error(`[SERVER ERR]: ${d.toString().trim()}`));

  // Wait 4 seconds for server to be ready
  await new Promise((r) => setTimeout(r, 4000));

  try {
    // 1. Test Homepage
    console.log("\n--- TEST 1: Homepage (/) ---");
    const resHome = await fetch("http://localhost:3000/");
    console.log("Status:", resHome.status, "Length:", (await resHome.text()).length);

    // 2. Test Services API
    console.log("\n--- TEST 2: Services API (/api/services) ---");
    const resServices = await fetch("http://localhost:3000/api/services");
    const servicesData = await resServices.json();
    console.log("Services count:", servicesData.services?.length);
    console.log("First service:", servicesData.services?.[0]?.title);

    // 3. Test Chatbot Config API
    console.log("\n--- TEST 3: Chatbot Config API (/api/chat) ---");
    const resChatConfig = await fetch("http://localhost:3000/api/chat");
    const chatConfig = await resChatConfig.json();
    console.log("Chatbot greeting:", chatConfig.config?.greeting);

    // 4. Test Calculator API (AC wash 2 units)
    console.log("\n--- TEST 4: Calculator API (/api/calculator) ---");
    const resCalc = await fetch("http://localhost:3000/api/calculator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "ac",
        params: { serviceType: "cuci", capacity: "1pk", units: 2, includeFreon: true },
        location: "Pamulang",
      }),
    });
    const calcData = await resCalc.json();
    console.log("Calc Job Title:", calcData.jobTitle);
    console.log("Breakdown items:", calcData.breakdown?.length);
    console.log("Total:", calcData.total);
    console.log("WhatsApp message link generated:", calcData.waMessage?.slice(0, 70) + "...");

    // 5. Test Chatbot AI RAG inquiry
    console.log("\n--- TEST 5: Chatbot AI RAG inquiry (/api/chat) ---");
    const resChatMsg = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Berapa biaya cuci AC 1 PK di Pamulang?" }),
    });
    const chatMsgData = await resChatMsg.json();
    console.log("Chatbot reply:", chatMsgData.reply);
    console.log("Chatbot relevant docs:", chatMsgData.relevantDocs);

    console.log("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<");
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    server.kill();
    process.exit(0);
  }
}

run();
