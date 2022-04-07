import { Client } from "@elastic/elasticsearch";
import "dotenv/config";
import { cloudId, apiKey } from "../config/default";



console.log(cloudId);
console.log(apiKey);


const client = new Client({
  cloud: { id: cloudId },
  auth: { apiKey: apiKey },
});

interface Document {
  character: string;
  quote: string;
}

async function run() {
  // Let's start by indexing some data
  await client.index({
    index: "game-of-thrones",
    document: {
      character: "Ned Stark",
      quote: "Winter is coming.",
    },
  });

  await client.index({
    index: "game-of-thrones",
    document: {
      character: "Daenerys Targaryen",
      quote: "I am the blood of the dragon.",
    },
  });

  await client.index({
    index: "game-of-thrones",
    document: {
      character: "Tyrion Lannister",
      quote: "A mind needs books like a sword needs a whetstone.",
    },
  });

  // here we are forcing an index refresh, otherwise we will not
  // get any result in the consequent search
  await client.indices.refresh({ index: "game-of-thrones" });

  // Let's search!
  const result = await client.search<Document>({
    index: "game-of-thrones",
    query: {
      match: { quote: "winter" },
    },
  });

  console.log(result.hits.hits);
}

run().catch(console.log);
