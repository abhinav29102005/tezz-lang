require('dotenv').config();
const createClient = require('tezz-database').default;

async function seed() {
  const db = createClient({
    url: process.env.TURSO_URL,
    token: process.env.TURSO_TOKEN
  });

  const dummyData = [
    { name: "Abhinav", email: "abhinav@example.com", message: "Tezz is blazing fast!" },
    { name: "Batman", email: "batman@wayne.com", message: "We should use Tezz!" },
    { name: "Pikachu", email: "pika@chu.com", message: "Zero-overhead JS without node_modules" }
  ];

  for (const entry of dummyData) {
    try {
      const result = await db.execute("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)", [entry.name, entry.email, entry.message]);
      console.log(`Inserted: ${entry.name} - Success: ${result.ok}`);
    } catch (e) {
      console.error(`Failed to insert ${entry.name}:`, e.message);
    }
  }
}

seed();
