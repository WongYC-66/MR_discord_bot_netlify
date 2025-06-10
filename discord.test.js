// Test local with Netlify Dev
const BASE_URL = "http://localhost:8888/.netlify/functions/discord";

function generatePayload(command, subcommand, options = []) {
    return {
        type: 2,
        data: {
            name: command,
            options: [
                {
                    name: subcommand,
                    type: 1,
                    ...(options.length ? { options } : {})
                }
            ]
        },
        id: "111111111111111111",
        token: "testtoken",
        application_id: "123456789012345678",
        guild_id: "987654321098765432",
        channel_id: "876543210987654321",
        member: {
            user: {
                id: "222222222222222222",
                username: "TestUser",
                discriminator: "0001"
            },
            roles: [],
            permissions: "2147483647"
        },
        version: 1
    };
}

async function postToHandler(payload) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const json = await res.json();
    return { status: res.status, json };
}

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

    test("/troll pavoweme", async () => {
        const payload = generatePayload("troll", "pavoweme");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.content?.toLowerCase()).toContain("pav owes you");
    });

    test("/troll pavoweeveryone", async () => {
        const payload = generatePayload("troll", "pavoweeveryone");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.content?.toLowerCase()).toContain("pav owes everyone");
    });

    test("/troll pavfeels", async () => {
        const payload = generatePayload("troll", "pavfeels");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.content?.toLowerCase()).toContain("pav feels");
    });

    test("/troll sackpav", async () => {
        const payload = generatePayload("troll", "sackpav");
        const { status, json } = await postToHandler(payload);
        expect(status).toBe(200);
        expect(json.data?.content?.toLowerCase()).toContain("you spawned a");
    });

});