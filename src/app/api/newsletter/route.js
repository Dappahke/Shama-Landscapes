// src/app/api/newsletter/route.js
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
    }

    // Path to a local JSON file for testing
    const filePath = path.join(process.cwd(), "emails.json");

    // Read existing emails or create new array
    let emails = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      emails = JSON.parse(fileData);
    }

    // Avoid duplicates
    if (!emails.includes(email)) emails.push(email);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(emails, null, 2));

    return new Response(JSON.stringify({ message: "Email saved successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
