// Test local with Netlify Dev or Modify BASE_URL to hosted netlify function page
// JEST - local debug only

import 'dotenv/config';

import { generatePayload, postToHandler } from './netlify/selftest.js';

describe("Bot Commands", () => {
    test("/bot help", async () => {
        const payload = generatePayload("bot", "help");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.content?.toLowerCase()).toContain("vnhoes bot help");
    });

    test("/bot equip zakum", async () => {
        const payload = generatePayload("bot", "equip", [
            { name: "query", value: "zakum", type: 3 }
        ]);
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.title.toLowerCase()).toBe("zakum helmet");
    });

    test("/bot item snail shell", async () => {
        const payload = generatePayload("bot", "item", [
            { name: "query", value: "snail shell", type: 3 }
        ]);
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.title.toLowerCase()).toBe("snail shell");
    });

    test("/bot monster furious targa", async () => {
        const payload = generatePayload("bot", "monster", [
            { name: "query", value: "furious targa", type: 3 }
        ]);
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.title.toLowerCase()).toBe("furious targa");
    });

    test("/bot skill genesis", async () => {
        const payload = generatePayload("bot", "skill", [
            { name: "query", value: "genesis", type: 3 }
        ]);
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.title.toLowerCase()).toBe("genesis");
    });

    test("/bot music amoria", async () => {
        const payload = generatePayload("bot", "music", [
            { name: "query", value: "amoria", type: 3 }
        ]);
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.title.toLowerCase()).toBe("amoria");
    });

    test("/bot servertime", async () => {
        const payload = generatePayload("bot", "servertime");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.content?.toLowerCase()).toContain("mapleroyals servertime");
    });

    test("/bot roll -5 5", async () => {
        const payload = generatePayload("bot", "roll", [
            { name: "min", value: -5, type: 4 },
            { name: "max", value: 5, type: 4 }
        ]);
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.content?.toLowerCase()).toContain("you rolled a");
    });

    test("/bot flipcoin", async () => {
        const payload = generatePayload("bot", "flipcoin");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.content?.toLowerCase()).toContain("you flipped a");
    });

    test("/bot guildhq", async () => {
        const payload = generatePayload("bot", "guildhq");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("guild");
    });

    test("/bot author", async () => {
        const payload = generatePayload("bot", "author");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("scotty5c");
    });

});

describe("Drop Commands", () => {
    test("/drop equip zakum", async () => {
        const payload = generatePayload("drop", "equip", [
            { name: "query", value: "zakum", type: 3 }
        ]);
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.title.toLowerCase()).toBe("zakum helmet");
        expect(json.data?.embeds?.[0]?.fields?.[0]?.value.toLowerCase()).toContain("zakum3");
    });

    test("/drop item snail shell", async () => {
        const payload = generatePayload("drop", "item", [
            { name: "query", value: "snail shell", type: 3 }
        ]);
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.title.toLowerCase()).toBe("snail shell");
        expect(json.data?.embeds?.[0]?.fields?.[0]?.value.toLowerCase()).toContain("snail");
    });

    test("/drop mob snail", async () => {
        const payload = generatePayload("drop", "mob", [
            { name: "query", value: "snail", type: 3 }
        ]);
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.title.toLowerCase()).toBe("snail");
        expect(json.data?.embeds?.[0]?.fields?.[0]?.value.toLowerCase()).toContain("green headband");
    });

});

describe("Guide Commands", () => {

    test("/guide apq", async () => {
        const payload = generatePayload("guide", "apq");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("apq guide");
    });

    test("/guide apqbon", async () => {
        const payload = generatePayload("guide", "apqbon");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("apq bonus map");
    });

    test("/guide cwk", async () => {
        const payload = generatePayload("guide", "cwk");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("cwkpq guide");
    });

    test("/guide cwkbon", async () => {
        const payload = generatePayload("guide", "cwkbon");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("cwkpq bonus map");
    });

    test("/guide gpq", async () => {
        const payload = generatePayload("guide", "gpq");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("gpq guide");
    });

    test("/guide gpqbon", async () => {
        const payload = generatePayload("guide", "gpqbon");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("gpq bonus map");
    });

    test("/guide opq", async () => {
        const payload = generatePayload("guide", "opq");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("opq guide");
    });

    test("/guide lpq", async () => {
        const payload = generatePayload("guide", "lpq");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("lpq guide");
    });

    test("/guide mage1hit", async () => {
        const payload = generatePayload("guide", "mage1hit");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("mage 1 hit");
    });

    test("/guide reuel", async () => {
        const payload = generatePayload("guide", "reuel");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("reuel");
    });

    test("/guide leech", async () => {
        const payload = generatePayload("guide", "leech");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("leech");
    });

    test("/guide price", async () => {
        const payload = generatePayload("guide", "price");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("price");
    });

    test("/guide jobadvance", async () => {
        const payload = generatePayload("guide", "jobadvance");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("job advancement");
    });

    test("/guide hpwashinfo", async () => {
        const payload = generatePayload("guide", "hpwashinfo");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.embeds?.[0]?.description.toLowerCase()).toContain("hp wash info");
    });

});

describe("Troll Commands", () => {

    test("/troll owe", async () => {
        const payload = generatePayload("troll", "owe", [
            { name: "target", value: "123456789", type: 3 }
        ]);
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.content?.toLowerCase()).toContain("owes you");
    });

    test("/troll oweall", async () => {
        const payload = generatePayload("troll", "oweall", [
            { name: "target", value: "123456789", type: 3 }
        ]);
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.content?.toLowerCase()).toContain("owes everyone");
    });

    test("/troll feels", async () => {
        const payload = generatePayload("troll", "feels", [
            { name: "target", value: "123456789", type: 3 }
        ]);
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.content?.toLowerCase()).toContain("feels");
    });

    test("/troll sack", async () => {
        const payload = generatePayload("troll", "sack", [
            { name: "target", value: "123456789", type: 6 }
        ]);
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.content?.toLowerCase()).toContain("spawned a");
    });

    test("/troll pat", async () => {
        const payload = generatePayload("troll", "pat", [
            { name: "target", value: "474557435219279873", type: 6 }
        ]);
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
    });

    test("/troll slap", async () => {
        const payload = generatePayload("troll", "slap", [
            { name: "target", value: "474557435219279873", type: 6 }
        ]);
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
    });

});