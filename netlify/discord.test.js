// Test local with Netlify Dev
import 'dotenv/config';
const BASE_URL = `${process.env.DOMAIN_URL}/.netlify/functions/discord`;

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

export async function runSelfTests() {
    const botCommandTests = [
        {
            name: "/bot help",
            payload: generatePayload("bot", "help"),
            validate: json => json.data?.content?.toLowerCase().includes("vnhoes bot help")
        },
        {
            name: "/bot equip zakum",
            payload: generatePayload("bot", "equip", [
                { name: "query", value: "zakum", type: 3 }
            ]),
            validate: json => json.data?.embeds?.[0]?.title?.toLowerCase()?.includes("zakum helmet")
        },
        {
            name: "/bot item snail shell",
            payload: generatePayload("bot", "item", [
                { name: "query", value: "snail shell", type: 3 }
            ]),
            validate: json => json.data?.embeds?.[0]?.title?.toLowerCase()?.includes("snail shell")
        },
        {
            name: "/bot monster furious targa",
            payload: generatePayload("bot", "monster", [
                { name: "query", value: "furious targa", type: 3 }
            ]),
            validate: json => json.data?.embeds?.[0]?.title?.toLowerCase()?.includes("furious targa")
        },
        {
            name: "/bot skill genesis",
            payload: generatePayload("bot", "skill", [
                { name: "query", value: "genesis", type: 3 }
            ]),
            validate: json => json.data?.embeds?.[0]?.title?.toLowerCase()?.includes("genesis")
        },
        {
            name: "/bot music amoria",
            payload: generatePayload("bot", "music", [
                { name: "query", value: "amoria", type: 3 }
            ]),
            validate: json => json.data?.embeds?.[0]?.title?.toLowerCase()?.includes("amoria")
        },
        {
            name: "/bot servertime",
            payload: generatePayload("bot", "servertime"),
            validate: json => json.data?.content?.toLowerCase()?.includes("mapleroyals servertime")
        },
        {
            name: "/bot roll -5 5",
            payload: generatePayload("bot", "roll", [
                { name: "min", value: -5, type: 4 },
                { name: "max", value: 5, type: 4 }
            ]),
            validate: json => json.data?.content?.toLowerCase()?.includes("you rolled a")
        },
        {
            name: "/bot flipcoin",
            payload: generatePayload("bot", "flipcoin"),
            validate: json => json.data?.content?.toLowerCase()?.includes("you flipped a")
        },
        {
            name: "/bot author",
            payload: generatePayload("bot", "author"),
            validate: json => json.data?.embeds?.[0]?.description?.toLowerCase()?.includes("scotty5c")
        },
    ]

    const dropCommandTests = [
        {
            name: "/drop equip zakum",
            payload: generatePayload("drop", "equip", [
                { name: "query", value: "zakum", type: 3 }
            ]),
            validate: json =>
                json.data?.embeds?.[0]?.title?.toLowerCase()?.includes("zakum helmet") &&
                json.data?.embeds?.[0]?.fields?.[0]?.value?.toLowerCase()?.includes("zakum3")
        },
        {
            name: "/drop item snail shell",
            payload: generatePayload("drop", "item", [
                { name: "query", value: "snail shell", type: 3 }
            ]),
            validate: json =>
                json.data?.embeds?.[0]?.title?.toLowerCase()?.includes("snail shell") &&
                json.data?.embeds?.[0]?.fields?.[0]?.value?.toLowerCase()?.includes("snail")
        },
        {
            name: "/drop mob snail",
            payload: generatePayload("drop", "mob", [
                { name: "query", value: "snail", type: 3 }
            ]),
            validate: json =>
                json.data?.embeds?.[0]?.title?.toLowerCase()?.includes("snail") &&
                json.data?.embeds?.[0]?.fields?.[0]?.value?.toLowerCase()?.includes("green headband")
        }
    ]

    const guideCommandTests = [
        {
            name: "/guide apq",
            payload: generatePayload("guide", "apq"),
            validate: json => json.data?.embeds?.[0]?.description?.toLowerCase()?.includes("apq guide")
        },
        {
            name: "/guide apqbon",
            payload: generatePayload("guide", "apqbon"),
            validate: json => json.data?.embeds?.[0]?.description?.toLowerCase()?.includes("apq bonus map")
        },
        {
            name: "/guide cwk",
            payload: generatePayload("guide", "cwk"),
            validate: json => json.data?.embeds?.[0]?.description?.toLowerCase()?.includes("cwkpq guide")
        },
        {
            name: "/guide cwkbon",
            payload: generatePayload("guide", "cwkbon"),
            validate: json => json.data?.embeds?.[0]?.description?.toLowerCase()?.includes("cwkpq bonus map")
        },
        {
            name: "/guide gpq",
            payload: generatePayload("guide", "gpq"),
            validate: json => json.data?.embeds?.[0]?.description?.toLowerCase()?.includes("gpq guide")
        },
        {
            name: "/guide gpqbon",
            payload: generatePayload("guide", "gpqbon"),
            validate: json => json.data?.embeds?.[0]?.description?.toLowerCase()?.includes("gpq bonus map")
        },
        {
            name: "/guide opq",
            payload: generatePayload("guide", "opq"),
            validate: json => json.data?.embeds?.[0]?.description?.toLowerCase()?.includes("opq guide")
        },
        {
            name: "/guide lpq",
            payload: generatePayload("guide", "lpq"),
            validate: json => json.data?.embeds?.[0]?.description?.toLowerCase()?.includes("lpq guide")
        },
        {
            name: "/guide mage1hit",
            payload: generatePayload("guide", "mage1hit"),
            validate: json => json.data?.embeds?.[0]?.description?.toLowerCase()?.includes("mage 1 hit")
        },
        {
            name: "/guide reuel",
            payload: generatePayload("guide", "reuel"),
            validate: json => json.data?.embeds?.[0]?.description?.toLowerCase()?.includes("reuel")
        },
        {
            name: "/guide leech",
            payload: generatePayload("guide", "leech"),
            validate: json => json.data?.embeds?.[0]?.description?.toLowerCase()?.includes("leech")
        },
        {
            name: "/guide price",
            payload: generatePayload("guide", "price"),
            validate: json => json.data?.embeds?.[0]?.description?.toLowerCase()?.includes("price")
        },
        {
            name: "/guide jobadvance",
            payload: generatePayload("guide", "jobadvance"),
            validate: json => json.data?.embeds?.[0]?.description?.toLowerCase()?.includes("job advancement")
        },
        {
            name: "/guide hpwashinfo",
            payload: generatePayload("guide", "hpwashinfo"),
            validate: json => json.data?.embeds?.[0]?.description?.toLowerCase()?.includes("hp wash info")
        }

    ]

    const trollCommandTests = [
        {
            name: "/troll pavoweme",
            payload: generatePayload("troll", "pavoweme"),
            validate: json => json.data?.content?.toLowerCase()?.includes("pav owes you")
        },
        {
            name: "/troll pavoweeveryone",
            payload: generatePayload("troll", "pavoweeveryone"),
            validate: json => json.data?.content?.toLowerCase()?.includes("pav owes everyone")
        },
        {
            name: "/troll pavfeels",
            payload: generatePayload("troll", "pavfeels"),
            validate: json => json.data?.content?.toLowerCase()?.includes("pav feels")
        },
        {
            name: "/troll sackpav",
            payload: generatePayload("troll", "sackpav"),
            validate: json => json.data?.content?.toLowerCase()?.includes("you spawned a")
        }
    ]

    const allTests = [...botCommandTests, ...dropCommandTests, ...guideCommandTests, ...trollCommandTests]
    // const allTests = [botCommandTests[0]]

    console.log(`Running ${allTests.length} Discord command self-tests...\n`);

    let pass = 0;
    let results = allTests.map(async ({ name, payload, validate }) => {
        let res = null
        try {
            const { status, json } = await postToHandler(payload);
            if (status !== 200) {
                res = (`❌ ${name} → HTTP ${status}`);
            } else if (!validate(json)) {
                res = (`❌ ${name} → Validation failed`);
            } else {
                res = (`✅ ${name}`);
                pass++;
            }
        } catch (err) {
            res = (`❌ ${name} → ${err.message}`);
        }
        // console.log(res)
        return res
    })

    results = await Promise.all(results)

    console.log(results)
    console.log(`\n✅ Passed ${pass}/${allTests.length} tests`);

    return results
}