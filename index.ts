import { Game } from "@gathertown/gather-game-client";
import { env } from "process";
import * as dotenv from "dotenv";
import * as https from "https";

const server = https.createServer((_, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

server.listen(Number(process.env.PORT) || 8000, "0.0.0.0");

const PLAYERS: { [key: string]: string } = {
  "31kaSpzjWzWhCqRrdrsVvvlszQe2": "Yuito",
  eqj2zn9e1iOujN43WIlQZyJRKV03: "kura",
  "6gs8oHd1sja8LyJo90HpYNZeHGr1": "吉野史也",
};

// 止まるの防止
setInterval(() => {
  https.get("https://gather-attendance.herokuapp.com/");
}, 15 * 60 * 1000);

function post(hooks_url: URL, message: string) {
  const content = JSON.stringify({ text: message });
  const options = {
    hostname: hooks_url.hostname,
    path: hooks_url.pathname,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const req = https.request(options, (res) => {
    if (res.statusCode != 200) {
      console.error("error: unable to post to ", hooks_url, res);
    }
  });
  req.write(content);
  req.end();
}

function sleep(ms: number): Promise<null> {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(null);
    }, ms);
  });
}

(async () => {
  dotenv.config();
  const SPACE_ID = env.SPACE_ID;
  const API_KEY = env.API_KEY;
  if (!SPACE_ID || !API_KEY) {
    console.error("error: please set SPACE_ID and API_KEY");
    return;
  }

  if (!env.HOOKS_URL) {
    console.error("error: please set HOOKS_URL");
    return;
  }
  const urls = env.HOOKS_URL.split(",").map((url) => new URL(url));

  const gclient = new Game(SPACE_ID, () =>
    Promise.resolve({ apiKey: API_KEY })
  );
  await gclient.connect();

  gclient.subscribeToEvent("playerJoins", async (_, context) => {
    console.log(context.playerId);
    if (!context.playerId) return;
    await sleep(3000); // wait to update player info
    const player = gclient.getPlayer(context.playerId);
    if (!player) return;
    const name = PLAYERS[context.playerId] ?? player.name;
    console.log("参加:", name);
    const message = `${name}が参加しました.`;
    for (let url of urls) {
      post(url, message);
    }
  });

  gclient.subscribeToEvent("playerExits", async (_, context) => {
    if (!context.playerId) return;
    const name = PLAYERS[context.playerId];
    console.log(`退出: ${name}`);
    const message = `${name}が退出しました.`;
    for (let url of urls) {
      post(url, message);
    }
  });
})();
