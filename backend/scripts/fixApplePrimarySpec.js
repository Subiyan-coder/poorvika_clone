/**
 * fixApplePrimarySpec.js
 *
 * For ProductVariant documents where primarySpecification.name is "RAM"
 * but the value is a placeholder ("-", "N/A", blank, etc.) — because the
 * phone doesn't publicly disclose RAM (e.g. iPhones) — this SWAPS the
 * specs instead of inventing a fake RAM number:
 *
 *   Before: primarySpecification   = { name: "RAM",     value: "-" }
 *           secondarySpecification = { name: "Storage", value: "256GB" }
 *
 *   After:  primarySpecification   = { name: "Storage", value: "256GB" }
 *           secondarySpecification = undefined
 *
 * Only touches variants where the secondary spec actually holds a real
 * value to promote — if secondary is also empty, the variant is skipped
 * and logged so you can look at it manually.
 *
 * ------------------------------------------------------------------
 * Run with: node seed-data/fixApplePrimarySpec.js
 * Add --dry-run to only report what WOULD change, without writing:
 *   node seed-data/fixApplePrimarySpec.js --dry-run
 * ------------------------------------------------------------------
 */

const mongoose = require("mongoose");
require("dotenv").config({
    path: require("path").join(__dirname, "../.env")
});

// ---- FIX THESE PATHS TO MATCH YOUR PROJECT ----
const Product = require("../models/product");
const ProductVariant = require("../models/productVariant");
// ------------------------------------------------

// Set to a category _id (string) to scope this to one category's
// products only. Leave as null to scan every ProductVariant.
const CATEGORY_ID = null; // e.g. "6aabb4b91ff4257d8818b2a6"

const DRY_RUN = process.argv.includes("--dry-run");

const PLACEHOLDER_PATTERN = /^\s*$|^[-–—]+$|^n\/?a$/i;

async function run() {

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not set in your environment");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const query = {
        "primarySpecification.name": { $regex: /^ram$/i },
        $or: [
            { "primarySpecification.value": { $exists: false } },
            { "primarySpecification.value": null },
            { "primarySpecification.value": { $regex: PLACEHOLDER_PATTERN } }
        ]
    };

    if (CATEGORY_ID) {
        const products = await Product.find({ categoryId: CATEGORY_ID }).select("_id");
        const productIds = products.map((p) => p._id);
        query.productId = { $in: productIds };
        console.log(`Scoped to category ${CATEGORY_ID}: ${productIds.length} products`);
    }

    const affectedVariants = await ProductVariant.find(query);

    console.log(`Found ${affectedVariants.length} variant(s) with a placeholder RAM value`);

    if (affectedVariants.length === 0) {
        await mongoose.disconnect();
        return;
    }

    let toFix = 0;
    let skipped = 0;
    const bulkOps = [];

    for (const variant of affectedVariants) {

        const secondaryName = variant.secondarySpecification?.name;
        const secondaryValue = variant.secondarySpecification?.value;

        const secondaryIsUsable =
            secondaryName &&
            secondaryValue &&
            !PLACEHOLDER_PATTERN.test(secondaryValue);

        if (!secondaryIsUsable) {
            skipped++;
            console.warn(
                `  Skipping ${variant._id} (sku: ${variant.sku}) — no usable secondary spec to promote`
            );
            continue;
        }

        toFix++;

        if (DRY_RUN) {
            console.log(
                `[DRY RUN] ${variant._id} (sku: ${variant.sku}): primary -> { ${secondaryName}: ${secondaryValue} }, secondary -> cleared`
            );
            continue;
        }

        bulkOps.push({
            updateOne: {
                filter: { _id: variant._id },
                update: {
                    $set: {
                        primarySpecification: {
                            name: secondaryName,
                            value: secondaryValue
                        }
                    },
                    $unset: {
                        secondarySpecification: ""
                    }
                }
            }
        });
    }

    console.log(`\n${toFix} variant(s) to fix, ${skipped} skipped (no usable secondary spec)`);

    if (DRY_RUN) {
        console.log(`[DRY RUN] No changes written. Re-run without --dry-run to apply.`);
        await mongoose.disconnect();
        return;
    }

    if (bulkOps.length > 0) {
        const result = await ProductVariant.bulkWrite(bulkOps);
        console.log(`Updated ${result.modifiedCount} variant(s)`);
    }

    await mongoose.disconnect();
}

run().catch((error) => {
    console.error("Fix-up failed:", error);
    process.exit(1);
});
