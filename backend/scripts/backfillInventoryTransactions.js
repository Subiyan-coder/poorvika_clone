/**
 * backfillInventoryTransactions.js
 *
 * One-off backfill: for every variant in variantIds, run an ADD through
 * adjustInventory() first (so stock is never touched at 0), then randomly
 * follow up with a REMOVE or DAMAGE on a subset of variants.
 *
 * Usage:
 *   node backfillInventoryTransactions.js
 *
 * Adjust MONGO_URI and the require paths below to match your project.
 */

require("dotenv").config({
    path: require("path").join(__dirname, "../.env")
});

const mongoose = require("mongoose");

// ---- adjust these to your project's actual paths ----
const {connectDB} = require("../config/db");
const { adjustInventory } = require("../services/inventoryService");
// -------------------------------------------------------

const userIds = [
    "6aaacf9c44a8fd647ddaf900",
    "6aaad508c96b0f3deeac05ec",
    "6aad02ad52bf908f5fd70fc0",
    "6aad030c6fa97b8934d85134",
    "6aad03375fe2864ca7e3f648",
    "6aad041a70483c11815d9e75"
];

const variantIds = [
    "6aaccade28f6842642653455",
    "6aaccadf28f684264265345c",
    "6aaccae728f6842642653466",
    "6aaccae928f684264265346d",
    "6aaccaef28f6842642653477",
    "6aaccaf128f684264265347e",
    "6aaccaf928f6842642653488",
    "6aaccafc28f684264265348f",
    "6aaccb0228f6842642653499",
    "6aaccb0328f68426426534a0",
    "6aaccb0a28f68426426534aa",
    "6aaccb0c28f68426426534b1",
    "6aaccb1428f68426426534bb",
    "6aaccb1628f68426426534c2",
    "6aaccb1d28f68426426534cc",
    "6aaccb2028f68426426534d3",
    "6aaccb2528f68426426534dd",
    "6aaccb2a28f68426426534e4",
    "6aaccb3028f68426426534ee",
    "6aaccb3228f68426426534f5",
    "6aaccb3928f68426426534ff",
    "6aaccb3c28f6842642653506",
    "6aaccb4628f6842642653510",
    "6aaccb4728f6842642653517",
    "6aaccb4c28f6842642653521",
    "6aaccb4f28f6842642653528",
    "6aaccb5628f6842642653532",
    "6aaccb5928f6842642653539",
    "6aaccb6028f6842642653543",
    "6aaccb6228f684264265354a",
    "6aaccb6828f6842642653554",
    "6aaccb6a28f684264265355b",
    "6aaccb7028f6842642653565",
    "6aaccb7228f684264265356c",
    "6aaccb7728f6842642653576",
    "6aaccb7a28f684264265357d",
    "6aaccb7f28f6842642653587",
    "6aaccb8228f684264265358e",
    "6aaccb8828f6842642653598",
    "6aaccb8a28f684264265359f",
    "6aaccb8f28f68426426535a9",
    "6aaccb9128f68426426535b0",
    "6aaccb9828f68426426535ba",
    "6aaccb9a28f68426426535c1",
    "6aaccba028f68426426535cb",
    "6aaccba228f68426426535d2",
    "6aaccba828f68426426535dc",
    "6aaccbae28f68426426535e3",
    "6aaccbb528f68426426535ed",
    "6aaccbb728f68426426535f4",
    "6aaccbbf28f68426426535fe",
    "6aaccbc328f6842642653605",
    "6aaccbd028f684264265360f",
    "6aaccbd228f6842642653616",
    "6aaccbd828f6842642653620",
    "6aaccbde28f6842642653627",
    "6aaccbe828f6842642653631",
    "6aaccbec28f6842642653638",
    "6aaccbf328f6842642653642",
    "6aaccbf528f6842642653649",
    "6aaccbfb28f6842642653653",
    "6aaccbfc28f684264265365a",
    "6aaccc0628f6842642653664",
    "6aaccc0828f684264265366b",
    "6aaccc0e28f6842642653675",
    "6aaccc1128f684264265367c",
    "6aaccc1b28f6842642653686",
    "6aaccc2028f684264265368d",
    "6aaccc2528f6842642653697",
    "6aaccc2628f684264265369e",
    "6aaccc2e28f68426426536a8",
    "6aaccc3128f68426426536af",
    "6aaccc3c28f68426426536b9",
    "6aaccc3d28f68426426536c0",
    "6aaccc4428f68426426536ca",
    "6aaccc4628f68426426536d1",
    "6aaccc4a28f68426426536db",
    "6aaccc4d28f68426426536e2",
    "6aaccc5128f68426426536ec",
    "6aaccc5328f68426426536f3",
    "6aaccc5828f68426426536fd",
    "6aaccc5a28f6842642653704",
    "6aaccc6028f684264265370e",
    "6aaccc6228f6842642653715",
    "6aaccc6628f684264265371f",
    "6aaccc6928f6842642653726",
    "6aaccc6e28f6842642653730",
    "6aaccc7128f6842642653737",
    "6aaccc7628f6842642653741",
    "6aaccc7828f6842642653748",
    "6aaccc8028f6842642653752",
    "6aaccc8228f6842642653759",
    "6aaccc8e28f6842642653763",
    "6aaccc9128f684264265376a",
    "6aaccc9c28f6842642653774",
    "6aaccca028f684264265377b",
    "6aacccaf28f6842642653785",
    "6aacccc028f684264265378c",
    "6aaccccc28f6842642653796",
    "6aaccccf28f684264265379d",
    "6aacd63fd64d8637457bdacb",
    "6aacd642d64d8637457bdad2",
    "6aacd64bd64d8637457bdadc",
    "6aacd64dd64d8637457bdae3",
    "6aacd654d64d8637457bdaed",
    "6aacd658d64d8637457bdaf4",
    "6aacd662d64d8637457bdafe",
    "6aacd665d64d8637457bdb05",
    "6aacd66dd64d8637457bdb0f",
    "6aacd66fd64d8637457bdb16",
    "6aacd676d64d8637457bdb20",
    "6aacd678d64d8637457bdb27",
    "6aacd67fd64d8637457bdb31",
    "6aacd684d64d8637457bdb38",
    "6aacd68bd64d8637457bdb42",
    "6aacd695d64d8637457bdb4f",
    "6aacd698d64d8637457bdb56",
    "6aacd6a1d64d8637457bdb60",
    "6aacd6a3d64d8637457bdb67",
    "6aacd6acd64d8637457bdb71",
    "6aacd6b8d64d8637457bdb7e",
    "6aacd6b9d64d8637457bdb85",
    "6aacd6bed64d8637457bdb8f",
    "6aacd6c0d64d8637457bdb96",
    "6aacd6c5d64d8637457bdba0",
    "6aacd6c7d64d8637457bdba7",
    "6aacd6dcd64d8637457bdbb1",
    "6aacd6dfd64d8637457bdbb8",
    "6aacd6e6d64d8637457bdbc2",
    "6aacd6f0d64d8637457bdbcf",
    "6aacd6f2d64d8637457bdbd6",
    "6aacd6f8d64d8637457bdbe0",
    "6aacd6fcd64d8637457bdbe7",
    "6aacd704d64d8637457bdbf1",
    "6aacd707d64d8637457bdbf8",
    "6aacd70ed64d8637457bdc02",
    "6aacd710d64d8637457bdc09",
    "6aacd716d64d8637457bdc13",
    "6aacd719d64d8637457bdc1a",
    "6aacd71fd64d8637457bdc24",
    "6aacd723d64d8637457bdc2b",
    "6aacd72ad64d8637457bdc35",
    "6aacd72dd64d8637457bdc3c",
    "6aacd734d64d8637457bdc46",
    "6aacd736d64d8637457bdc4d",
    "6aacd73fd64d8637457bdc57",
    "6aacd749d64d8637457bdc64",
    "6aacd755d64d8637457bdc71",
    "6aacd757d64d8637457bdc78",
    "6aacd75cd64d8637457bdc82",
    "6aacd75ed64d8637457bdc89",
    "6aacd764d64d8637457bdc93",
    "6aacd766d64d8637457bdc9a",
    "6aacd76fd64d8637457bdca4",
    "6aacd778d64d8637457bdcb1",
    "6aacd77ad64d8637457bdcb8",
    "6aacd782d64d8637457bdcc2",
    "6aacd784d64d8637457bdcc9",
    "6aacd78ad64d8637457bdcd3",
    "6aacd78ed64d8637457bdcda",
    "6aacd796d64d8637457bdce4",
    "6aacd799d64d8637457bdceb",
    "6aacd7a0d64d8637457bdcf5",
    "6aacd7a8d64d8637457bdd02",
    "6aacd7abd64d8637457bdd09",
    "6aacd7b1d64d8637457bdd13",
    "6aacd7b5d64d8637457bdd1a",
    "6aacd7bcd64d8637457bdd24",
    "6aacd7bed64d8637457bdd2b",
    "6aacd7c5d64d8637457bdd35",
    "6aacd7c7d64d8637457bdd3c",
    "6aacd7cfd64d8637457bdd46",
    "6aacd7d8d64d8637457bdd53",
    "6aacd7dbd64d8637457bdd5a",
    "6aacd7e3d64d8637457bdd64",
    "6aacd7e5d64d8637457bdd6b",
    "6aacd7ead64d8637457bdd75",
    "6aacd7edd64d8637457bdd7c",
    "6aacd7f2d64d8637457bdd86",
    "6aacd7ffd64d8637457bdd93",
    "6aacd802d64d8637457bdd9a",
    "6aacd809d64d8637457bdda4",
    "6aacd812d64d8637457bddb1",
    "6aacd819d64d8637457bddbe",
    "6aacda08ea97739748bf0bc9",
    "6aacda59517fd8306329e1b4",
    "6aacdd9135f4cafaffa39ef9",
    "6aacdd9935f4cafaffa39f03",
    "6aacdda235f4cafaffa39f11",
    "6aacdda635f4cafaffa39f1b",
    "6aacddb135f4cafaffa39f29",
    "6aacddc835f4cafaffa39f33",
    "6aacddf135f4cafaffa39f41",
    "6aacde0135f4cafaffa39f4b",
    "6aacde7435f4cafaffa39f59",
    "6aacde8235f4cafaffa39f63",
    "6aacdeb435f4cafaffa39f71",
    "6aacdebd35f4cafaffa39f7b",
    "6aacdeed35f4cafaffa39f89",
    "6aacdef735f4cafaffa39f93",
    "6aacdf0535f4cafaffa39fa1",
    "6aacdf1135f4cafaffa39fab",
    "6aacdf1d35f4cafaffa39fb9",
    "6aacdf2135f4cafaffa39fc3",
    "6aacdf2d35f4cafaffa39fd1",
    "6aacdf3235f4cafaffa39fdb",
    "6aacdf4235f4cafaffa39fe9",
    "6aacdf4635f4cafaffa39ff3",
    "6aacdf5535f4cafaffa3a001",
    "6aacdf5a35f4cafaffa3a00b",
    "6aacdf6f35f4cafaffa3a019",
    "6aacdf7535f4cafaffa3a023",
    "6aacdf8535f4cafaffa3a031",
    "6aacdf8d35f4cafaffa3a03b",
    "6aacdf9935f4cafaffa3a049",
    "6aacdfa135f4cafaffa3a053",
    "6aacdfae35f4cafaffa3a061",
    "6aacdfb335f4cafaffa3a06b",
    "6aacdfc135f4cafaffa3a079",
    "6aacdfce35f4cafaffa3a083",
    "6aacdfdf35f4cafaffa3a091",
    "6aacdfe335f4cafaffa3a09b",
    "6aacdff135f4cafaffa3a0a9",
    "6aacdff635f4cafaffa3a0b3",
    "6aace00535f4cafaffa3a0c1",
    "6aace00c35f4cafaffa3a0cb",
    "6aace02135f4cafaffa3a0d9",
    "6aace02435f4cafaffa3a0e3",
    "6aace03835f4cafaffa3a0f1",
    "6aace03c35f4cafaffa3a0fb",
    "6aace04c35f4cafaffa3a109",
    "6aace05135f4cafaffa3a113",
    "6aace06135f4cafaffa3a121",
    "6aace06535f4cafaffa3a12b",
    "6aace07335f4cafaffa3a139",
    "6aace07935f4cafaffa3a143",
    "6aace08835f4cafaffa3a151",
    "6aace09335f4cafaffa3a15b",
    "6aace0a135f4cafaffa3a169",
    "6aace0a435f4cafaffa3a173",
    "6aace0b035f4cafaffa3a181",
    "6aace0b735f4cafaffa3a18b",
    "6aace0c635f4cafaffa3a199",
    "6aace0c935f4cafaffa3a1a3",
    "6aace0dc35f4cafaffa3a1b1",
    "6aace0e335f4cafaffa3a1bb",
    "6aace0f335f4cafaffa3a1c9",
    "6aace0fc35f4cafaffa3a1d3",
    "6aace10735f4cafaffa3a1e1",
    "6aace10c35f4cafaffa3a1eb",
    "6aace11935f4cafaffa3a1f9",
    "6aace12135f4cafaffa3a203",
    "6aace12c35f4cafaffa3a211",
    "6aace13335f4cafaffa3a21b",
    "6aace14435f4cafaffa3a229",
    "6aace14835f4cafaffa3a233",
    "6aace15635f4cafaffa3a241",
    "6aace15a35f4cafaffa3a24b",
    "6aace16835f4cafaffa3a259",
    "6aace16d35f4cafaffa3a263",
    "6aace17e35f4cafaffa3a271",
    "6aace18435f4cafaffa3a27b",
    "6aace19735f4cafaffa3a289",
    "6aace1a035f4cafaffa3a293",
    "6aace1b035f4cafaffa3a2a1",
    "6aace1b635f4cafaffa3a2ab",
    "6aace1c635f4cafaffa3a2b9",
    "6aace1c935f4cafaffa3a2c3",
    "6aace1d835f4cafaffa3a2d1",
    "6aace1dd35f4cafaffa3a2db",
    "6aace1f435f4cafaffa3a2e9",
    "6aace1f935f4cafaffa3a2f3",
    "6aace20d35f4cafaffa3a301",
    "6aace21535f4cafaffa3a30b",
    "6aace22235f4cafaffa3a319",
    "6aace22b35f4cafaffa3a323",
    "6aace23a35f4cafaffa3a331",
    "6aace23f35f4cafaffa3a33b",
    "6aace24b35f4cafaffa3a349",
    "6aace25335f4cafaffa3a353",
    "6aace26335f4cafaffa3a361",
    "6aace26735f4cafaffa3a36b",
    "6aace27735f4cafaffa3a379",
    "6aace27d35f4cafaffa3a383",
    "6aace28c35f4cafaffa3a391",
    "6aace29335f4cafaffa3a39b",
    "6aace6acb9365ae221ef43af",
    "6aace6b3b9365ae221ef43b9",
    "6aace6c3b9365ae221ef43c7",
    "6aace6c6b9365ae221ef43d1",
    "6aace6d0b9365ae221ef43df",
    "6aace6d5b9365ae221ef43e9",
    "6aace6e0b9365ae221ef43f7",
    "6aace6e4b9365ae221ef4401",
    "6aace6f0b9365ae221ef440f",
    "6aace6f7b9365ae221ef4419",
    "6aace706b9365ae221ef4427",
    "6aace70cb9365ae221ef4431",
    "6aace716b9365ae221ef443f",
    "6aace71ab9365ae221ef4449",
    "6aace728b9365ae221ef4457",
    "6aace72bb9365ae221ef4461",
    "6aace735b9365ae221ef446f",
    "6aace73bb9365ae221ef4479",
    "6aace748b9365ae221ef4487",
    "6aace74eb9365ae221ef4491",
    "6aace759b9365ae221ef449f",
    "6aace75db9365ae221ef44a9",
    "6aace76ab9365ae221ef44b7",
    "6aace76eb9365ae221ef44c1",
    "6aace778b9365ae221ef44cf",
    "6aace77cb9365ae221ef44d9",
    "6aace78bb9365ae221ef44e7",
    "6aace790b9365ae221ef44f1",
    "6aace79eb9365ae221ef44ff",
    "6aace7a2b9365ae221ef4509",
    "6aace7b0b9365ae221ef4517",
    "6aace7b7b9365ae221ef4521",
    "6aace7c2b9365ae221ef452f",
    "6aace7c8b9365ae221ef4539",
    "6aace7dab9365ae221ef4547",
    "6aace7e4b9365ae221ef4551",
    "6aace7fcb9365ae221ef455f",
    "6aace801b9365ae221ef4569",
    "6aace80fb9365ae221ef4577",
    "6aace814b9365ae221ef4581",
    "6aace825b9365ae221ef458f",
    "6aace82ab9365ae221ef4599",
    "6aace83bb9365ae221ef45a7",
    "6aace841b9365ae221ef45b1",
    "6aace856b9365ae221ef45bf",
    "6aace860b9365ae221ef45c9",
    "6aace86db9365ae221ef45d7",
    "6aace874b9365ae221ef45e1",
    "6aace882b9365ae221ef45ef",
    "6aace887b9365ae221ef45f9",
    "6aace895b9365ae221ef4607",
    "6aace89db9365ae221ef4611",
    "6aace8b0b9365ae221ef461f",
    "6aace8b7b9365ae221ef4629",
    "6aace8c8b9365ae221ef4637",
    "6aace8ceb9365ae221ef4641",
    "6aace8dcb9365ae221ef464f",
    "6aace8e3b9365ae221ef4659",
    "6aace8f1b9365ae221ef4667",
    "6aace8f6b9365ae221ef4671",
    "6aace908b9365ae221ef467f",
    "6aace912b9365ae221ef4689",
    "6aace928b9365ae221ef4697",
    "6aace92cb9365ae221ef46a1",
    "6aace93ab9365ae221ef46af",
    "6aace941b9365ae221ef46b9",
    "6aace950b9365ae221ef46c7",
    "6aace956b9365ae221ef46d1",
    "6aace966b9365ae221ef46df",
    "6aace96fb9365ae221ef46e9",
    "6aace985b9365ae221ef46f7",
    "6aace98db9365ae221ef4701",
    "6aace998b9365ae221ef470f",
    "6aace99eb9365ae221ef4719",
    "6aace9b0b9365ae221ef4727",
    "6aace9b4b9365ae221ef4731",
    "6aace9c0b9365ae221ef473f",
    "6aace9c7b9365ae221ef4749",
    "6aace9dbb9365ae221ef4757",
    "6aace9e5b9365ae221ef4761",
    "6aace9f7b9365ae221ef476f",
    "6aace9fcb9365ae221ef4779",
    "6aacea0cb9365ae221ef4787",
    "6aacea12b9365ae221ef4791",
    "6aacea1eb9365ae221ef479f",
    "6aacea22b9365ae221ef47a9",
    "6aacea38b9365ae221ef47b7",
    "6aacea3eb9365ae221ef47c1",
    "6aacea50b9365ae221ef47cf",
    "6aacea54b9365ae221ef47d9",
    "6aacea60b9365ae221ef47e7",
    "6aacea67b9365ae221ef47f1",
    "6aacea72b9365ae221ef47ff",
    "6aacea77b9365ae221ef4809",
    "6aacea87b9365ae221ef4817",
    "6aacea91b9365ae221ef4821",
    "6aaceaa3b9365ae221ef482f",
    "6aaceaa7b9365ae221ef4839",
    "6aaceab3b9365ae221ef4847",
    "6aaceab8b9365ae221ef4851"
];

// ---------- helpers ----------

function randInt(min, max) {
    // inclusive on both ends
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomUserId() {
    return userIds[randInt(0, userIds.length - 1)];
}

const NOTES = {
    ADD: "Backfill stock addition",
    REMOVE: "Backfill stock removal",
    DAMAGE: "Backfill damage adjustment"
};

// ---------- main ----------

async function run() {
    await connectDB();
    console.log("Connected to MongoDB");

    const results = {
        total: variantIds.length,
        adds: 0,
        removes: 0,
        damages: 0,
        failed: []
    };

    for (const productVariantId of variantIds) {
        try {
            // 1. Always ADD first, comfortably above 100 so a later
            //    REMOVE/DAMAGE of up to 100 never fails availableQuantity.
            const addQty = randInt(150, 400);

            await adjustInventory({
                productVariantId,
                quantity: addQty,
                type: "ADD",
                note: NOTES.ADD,
                performedBy: randomUserId()
            });

            results.adds += 1;

            // 2. Randomly decide whether this variant also gets a
            //    follow-up REMOVE, a DAMAGE, or nothing else.
            //    Roughly: 40% REMOVE, 30% DAMAGE, 30% ADD-only.
            const roll = Math.random();

            if (roll < 0.4) {
                const removeQty = randInt(10, 100);
                await adjustInventory({
                    productVariantId,
                    quantity: removeQty,
                    type: "REMOVE",
                    note: NOTES.REMOVE,
                    performedBy: randomUserId()
                });
                results.removes += 1;
            } else if (roll < 0.7) {
                const damageQty = randInt(5, 100);
                await adjustInventory({
                    productVariantId,
                    quantity: damageQty,
                    type: "DAMAGE",
                    note: NOTES.DAMAGE,
                    performedBy: randomUserId()
                });
                results.damages += 1;
            }
            // else: ADD-only, no follow-up

            console.log(`OK  ${productVariantId}`);
        } catch (err) {
            console.error(`FAIL ${productVariantId}: ${err.message}`);
            results.failed.push({
                productVariantId,
                error: err.message
            });
        }
    }

    console.log("\n----- Backfill summary -----");
    console.log(`Total variants processed : ${results.total}`);
    console.log(`ADD only / total ADDs    : ${results.adds}`);
    console.log(`REMOVE follow-ups        : ${results.removes}`);
    console.log(`DAMAGE follow-ups        : ${results.damages}`);
    console.log(`Failed                   : ${results.failed.length}`);

    if (results.failed.length) {
        console.log("\nFailed variant IDs:");
        results.failed.forEach(f =>
            console.log(`  ${f.productVariantId} -> ${f.error}`)
        );
    }

    await mongoose.disconnect();
    console.log("\nDisconnected. Done.");
}

run().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});
