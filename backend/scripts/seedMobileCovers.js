/**
 * seedMobileCovers.js
 *
 * Seeds 50 mobile cover products (with variants) into the DB by calling
 * the ACTUAL createProduct / addProductImages / createProductVariant
 * functions from your codebase — not direct Model.create() calls.
 *
 * Each product is a specific cover design for a specific phone model.
 * Variants are color options of the same design (material/case type stay
 * fixed per product; color always differs between the two variants, which
 * is enough to keep SKUs unique).
 *
 * Product images: 3 per product. Variant images: 2 per variant.
 *
 * ------------------------------------------------------------------
 * BEFORE RUNNING:
 * 1. Make sure backend/seed-data/mobilecover/image1.jpg ... image30.jpg exist.
 * 2. Make sure MONGO_URI and Cloudinary env vars are loaded via ../.env.
 * Run with: node seed-data/seedMobileCovers.js
 * ------------------------------------------------------------------
 */

const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config({
    path: require("path").join(__dirname, "../.env")
});

// ---- FIX THESE PATHS TO MATCH YOUR PROJECT ----
const Product = require("../models/product");
const ProductVariant = require("../models/productVariant");
const Category = require("../models/category"); // used only to sanity-check CATEGORY_ID

const { createProduct, addProductImages } = require("../services/productService"); // adjust path
const { createProductVariant } = require("../services/productVariantService"); // adjust path
// ------------------------------------------------

const CATEGORY_ID = "6aabb6251ff4257d8818b2b2"; // Mobile Cover
const IMAGE_DIR = path.join(
    __dirname,
    "..",
    "seed-data",
    "mobilecover"
); // backend/seed-data/mobilecover
const TOTAL_IMAGES = 30;

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

let imageCursor = 0;

function getNextImageFile() {
    const index = (imageCursor % TOTAL_IMAGES) + 1;
    imageCursor++;
    const filePath = path.join(IMAGE_DIR, `image${index}.jpg`);
    return {
        buffer: fs.readFileSync(filePath),
        originalname: `image${index}.jpg`,
        mimetype: "image/jpeg"
    };
}

function pickImages(count = 1) {
    return Array.from({ length: count }, () => getNextImageFile());
}

// ---------------------------------------------------------------
// 50 mobile cover definitions
// Each has 2 variant configs: [material, caseType, color, price, discount]
// Color always differs between the two variants of a product.
// ---------------------------------------------------------------

const mobileCovers = [
    { brand: "Spigen", model: "Ultra Hybrid Case for iPhone 15 Pro Max", desc: "Slim transparent case with reinforced corners for drop protection.", specs: { compatibleWith: "iPhone 15 Pro Max", caseType: "Back Cover", features: "Shock absorption, wireless charging compatible" }, variants: [["Polycarbonate + TPU","Back Cover","Crystal Clear",1499,10],["Polycarbonate + TPU","Back Cover","Matte Black",1499,10]] },
    { brand: "Spigen", model: "Rugged Armor Case for Samsung Galaxy S24 Ultra", desc: "Flexible TPU case with a carbon fiber textured finish.", specs: { compatibleWith: "Samsung Galaxy S24 Ultra", caseType: "Back Cover", features: "Air cushion corners, anti-slip grip" }, variants: [["TPU","Back Cover","Matte Black",1299,10],["TPU","Back Cover","Gunmetal",1299,10]] },
    { brand: "Spigen", model: "Liquid Air Case for iPhone 14", desc: "Lightweight flexible case with a soft-touch finish.", specs: { compatibleWith: "iPhone 14", caseType: "Back Cover", features: "Shock absorption, raised bezels" }, variants: [["TPU","Back Cover","Black",999,12],["TPU","Back Cover","Abyss Blue",999,12]] },
    { brand: "Spigen", model: "Tough Armor Case for OnePlus 12", desc: "Dual-layer military-grade protective case with kickstand.", specs: { compatibleWith: "OnePlus 12", caseType: "Back Cover with Kickstand", features: "Air cushion tech, built-in kickstand" }, variants: [["Polycarbonate + TPU","Back Cover","Black",1699,8],["Polycarbonate + TPU","Back Cover","Gray",1699,8]] },
    { brand: "Ringke", model: "Fusion Case for iPhone 15", desc: "Clear hybrid case combining a hard back with flexible bumpers.", specs: { compatibleWith: "iPhone 15", caseType: "Back Cover", features: "Anti-yellowing, shock-absorbing corners" }, variants: [["Polycarbonate + TPU","Back Cover","Clear",1199,10],["Polycarbonate + TPU","Back Cover","Smoke Black",1199,10]] },
    { brand: "Ringke", model: "Onyx Case for Samsung Galaxy S23", desc: "Textured matte case designed for grip and durability.", specs: { compatibleWith: "Samsung Galaxy S23", caseType: "Back Cover", features: "Anti-slip texture, reinforced corners" }, variants: [["TPU","Back Cover","Black",1099,9],["TPU","Back Cover","Navy",1099,9]] },
    { brand: "Ringke", model: "Air S Case for Google Pixel 8", desc: "Ultra-slim flexible case that preserves the phone's original feel.", specs: { compatibleWith: "Google Pixel 8", caseType: "Back Cover", features: "Slim profile, raised lip for screen protection" }, variants: [["TPU","Back Cover","Clear",899,10],["TPU","Back Cover","Black",899,10]] },
    { brand: "Nillkin", model: "CamShield Case for iPhone 13", desc: "Case with a sliding cover to protect the camera lens.", specs: { compatibleWith: "iPhone 13", caseType: "Back Cover", features: "Sliding camera cover, matte finish" }, variants: [["Polycarbonate","Back Cover","Black",899,11],["Polycarbonate","Back Cover","Blue",899,11]] },
    { brand: "Nillkin", model: "Super Frosted Shield for Samsung Galaxy A54", desc: "Frosted hard-shell case with a built-in kickstand.", specs: { compatibleWith: "Samsung Galaxy A54", caseType: "Back Cover with Kickstand", features: "Matte frosted texture, built-in stand" }, variants: [["Polycarbonate","Back Cover","Black",799,12],["Polycarbonate","Back Cover","Red",799,12]] },
    { brand: "Nillkin", model: "Textured Case for Redmi Note 13 Pro", desc: "Leather-textured back cover with a soft-grip feel.", specs: { compatibleWith: "Redmi Note 13 Pro", caseType: "Back Cover", features: "PU leather texture, camera bump protection" }, variants: [["PU Leather + TPU","Back Cover","Brown",699,12],["PU Leather + TPU","Back Cover","Black",699,12]] },
    { brand: "Case-Mate", model: "Tough Case for iPhone 15 Pro", desc: "Sleek protective case with a metallic button accent.", specs: { compatibleWith: "iPhone 15 Pro", caseType: "Back Cover", features: "10ft drop protection, antimicrobial coating" }, variants: [["Polycarbonate + TPU","Back Cover","Clear",1799,7],["Polycarbonate + TPU","Back Cover","Black",1799,7]] },
    { brand: "Case-Mate", model: "Wallet Case for Samsung Galaxy S24", desc: "Folio-style case with card slots and a magnetic closure.", specs: { compatibleWith: "Samsung Galaxy S24", caseType: "Flip Cover", features: "Card slots, magnetic closure, kickstand" }, variants: [["PU Leather","Flip Cover","Black",1999,8],["PU Leather","Flip Cover","Brown",1999,8]] },
    { brand: "OtterBox", model: "Defender Series for iPhone 14 Pro", desc: "Heavy-duty rugged case with a built-in belt-clip holster.", specs: { compatibleWith: "iPhone 14 Pro", caseType: "Rugged Cover", features: "Multi-layer protection, holster included" }, variants: [["Polycarbonate + Silicone","Rugged Cover","Black",2999,6],["Polycarbonate + Silicone","Rugged Cover","Dark Green",2999,6]] },
    { brand: "OtterBox", model: "Commuter Series for Samsung Galaxy S23 Ultra", desc: "Slim two-layer case built for everyday drop protection.", specs: { compatibleWith: "Samsung Galaxy S23 Ultra", caseType: "Back Cover", features: "Port covers, dual-layer protection" }, variants: [["Polycarbonate + Silicone","Back Cover","Black",2199,7],["Polycarbonate + Silicone","Back Cover","Gray",2199,7]] },
    { brand: "ESR", model: "Classic Hybrid Case for iPhone 15", desc: "Crystal-clear case with reinforced air-cushion corners.", specs: { compatibleWith: "iPhone 15", caseType: "Back Cover", features: "Anti-yellowing coating, shock-absorbing corners" }, variants: [["Polycarbonate + TPU","Back Cover","Clear",999,10],["Polycarbonate + TPU","Back Cover","Black",999,10]] },
    { brand: "ESR", model: "HaloLock MagSafe Case for iPhone 15", desc: "MagSafe-compatible case with a strong built-in magnet ring.", specs: { compatibleWith: "iPhone 15", caseType: "Back Cover", features: "MagSafe compatible, magnetic snap" }, variants: [["Polycarbonate + TPU","Back Cover","Clear",1399,9],["Polycarbonate + TPU","Back Cover","Navy",1399,9]] },
    { brand: "Dbrand", model: "Grip Case for iPhone 15 Pro", desc: "Textured grip case designed to pair with Dbrand skins.", specs: { compatibleWith: "iPhone 15 Pro", caseType: "Back Cover", features: "Textured grip, raised camera bezel" }, variants: [["Polycarbonate","Back Cover","Black",1599,8],["Polycarbonate","Back Cover","Teal",1599,8]] },
    { brand: "Dbrand", model: "Skin + Case Bundle for Samsung Galaxy S24", desc: "Case bundled with a matching vinyl skin wrap.", specs: { compatibleWith: "Samsung Galaxy S24", caseType: "Back Cover", features: "Includes vinyl skin, textured grip" }, variants: [["Polycarbonate","Back Cover","Black",1899,7],["Polycarbonate","Back Cover","Concrete Gray",1899,7]] },
    { brand: "Ghostek", model: "Covert Case for iPhone 14", desc: "Slim clear case with reinforced bumper edges.", specs: { compatibleWith: "iPhone 14", caseType: "Back Cover", features: "Clear finish, reinforced bumper" }, variants: [["TPU","Back Cover","Clear",899,11],["TPU","Back Cover","Smoke",899,11]] },
    { brand: "Ghostek", model: "Exec Wallet Case for Google Pixel 7", desc: "Premium leather wallet case with RFID-blocking card slots.", specs: { compatibleWith: "Google Pixel 7", caseType: "Flip Cover", features: "RFID blocking, 3 card slots" }, variants: [["Genuine Leather","Flip Cover","Brown",2499,6],["Genuine Leather","Flip Cover","Black",2499,6]] },
    { brand: "Caseology", model: "Parallax Case for Samsung Galaxy S23", desc: "Dual-layer case with a geometric textured design.", specs: { compatibleWith: "Samsung Galaxy S23", caseType: "Back Cover", features: "Dual-layer build, geometric texture" }, variants: [["Polycarbonate + TPU","Back Cover","Black",1099,9],["Polycarbonate + TPU","Back Cover","Burgundy",1099,9]] },
    { brand: "Caseology", model: "Nano Pop Case for iPhone 13", desc: "Two-tone case with soft-touch matte finish.", specs: { compatibleWith: "iPhone 13", caseType: "Back Cover", features: "Two-tone design, matte finish" }, variants: [["TPU","Back Cover","Mint Green",799,11],["TPU","Back Cover","Sand Beige",799,11]] },
    { brand: "UAG", model: "Monarch Case for iPhone 15 Pro Max", desc: "Premium rugged case with a multi-layer, hand-crafted design.", specs: { compatibleWith: "iPhone 15 Pro Max", caseType: "Rugged Cover", features: "5-layer protection, leather + metal accents" }, variants: [["Leather + TPU + Polycarbonate","Rugged Cover","Black",3499,5],["Leather + TPU + Polycarbonate","Rugged Cover","Kevlar Black",3499,5]] },
    { brand: "UAG", model: "Plasma Case for Samsung Galaxy S24 Ultra", desc: "Translucent rugged case combining style with drop protection.", specs: { compatibleWith: "Samsung Galaxy S24 Ultra", caseType: "Back Cover", features: "Military-grade drop protection, honeycomb pattern" }, variants: [["Polycarbonate + TPU","Back Cover","Ice",2499,7],["Polycarbonate + TPU","Back Cover","Ash",2499,7]] },
    { brand: "Speck", model: "Presidio2 Case for iPhone 14", desc: "Antimicrobial protective case with raised edges.", specs: { compatibleWith: "iPhone 14", caseType: "Back Cover", features: "Antimicrobial coating, raised screen edges" }, variants: [["Polycarbonate + Silicone","Back Cover","Black",1899,8],["Polycarbonate + Silicone","Back Cover","Coastal Blue",1899,8]] },
    { brand: "Speck", model: "CandyShell Case for Samsung Galaxy S22", desc: "Slim two-tone case with soft-touch grip.", specs: { compatibleWith: "Samsung Galaxy S22", caseType: "Back Cover", features: "Two-tone build, soft-touch coating" }, variants: [["Polycarbonate + TPU","Back Cover","Black",1499,9],["Polycarbonate + TPU","Back Cover","Purple",1499,9]] },
    { brand: "Pela", model: "Compostable Case for iPhone 15", desc: "Eco-friendly biodegradable case made from plant-based materials.", specs: { compatibleWith: "iPhone 15", caseType: "Back Cover", features: "Compostable material, plastic-free packaging" }, variants: [["Flaxstic Bio-Material","Back Cover","Black",1699,6],["Flaxstic Bio-Material","Back Cover","Ocean Blue",1699,6]] },
    { brand: "Mous", model: "Limitless Case for iPhone 14 Pro", desc: "Premium case with AiroShock impact protection technology.", specs: { compatibleWith: "iPhone 14 Pro", caseType: "Back Cover", features: "AiroShock technology, real material back panels" }, variants: [["Polycarbonate + AiroShock","Back Cover","Walnut Wood",2999,5],["Polycarbonate + AiroShock","Back Cover","Black Leather",3299,5]] },
    { brand: "Nomad", model: "Rugged Case for iPhone 15", desc: "Horween leather-backed rugged case that ages with use.", specs: { compatibleWith: "iPhone 15", caseType: "Back Cover", features: "Horween leather back, MagSafe compatible" }, variants: [["Leather + Polycarbonate","Back Cover","Brown",3199,6],["Leather + Polycarbonate","Back Cover","Black",3199,6]] },
    { brand: "Torras", model: "UPro Case for iPhone 13", desc: "Minimalist case with a smooth matte finish.", specs: { compatibleWith: "iPhone 13", caseType: "Back Cover", features: "Matte finish, anti-fingerprint coating" }, variants: [["Polycarbonate","Back Cover","Sierra Blue",849,10],["Polycarbonate","Back Cover","Graphite",849,10]] },
    { brand: "WildFlower", model: "Clear Case for iPhone 14", desc: "Decorative clear case with a pressed-flower design.", specs: { compatibleWith: "iPhone 14", caseType: "Back Cover", features: "Decorative print, shatterproof build" }, variants: [["TPU","Back Cover","Clear Floral",1299,7],["TPU","Back Cover","Clear Gold Flecks",1299,7]] },
    { brand: "Casetify", model: "Impact Case for iPhone 15", desc: "Customizable impact-resistant case with rounded edges.", specs: { compatibleWith: "iPhone 15", caseType: "Back Cover", features: "6.6ft drop protection, antimicrobial lining" }, variants: [["Polycarbonate + TPU","Back Cover","Clear",1599,8],["Polycarbonate + TPU","Back Cover","Frost Blue",1599,8]] },
    { brand: "Rhinoshield", model: "SolidSuit Case for Samsung Galaxy S23", desc: "Slim shock-absorbent case with a solid matte back.", specs: { compatibleWith: "Samsung Galaxy S23", caseType: "Back Cover", features: "11ft drop protection, non-yellowing material" }, variants: [["Polycarbonate + TPU","Back Cover","Classic Black",1499,9],["Polycarbonate + TPU","Back Cover","Royal Blue",1499,9]] },
    { brand: "Smartish", model: "Gripmunk Case for iPhone 13", desc: "Textured grip case with a wallet slot on the back.", specs: { compatibleWith: "iPhone 13", caseType: "Back Cover", features: "Textured grip, built-in card slot" }, variants: [["Polycarbonate + TPU","Back Cover","Black Tie Affair",999,10],["Polycarbonate + TPU","Back Cover","Pool Party",999,10]] },
    { brand: "Spigen", model: "Neo Hybrid Case for OnePlus Nord CE3", desc: "Dual-layer case with a metallic bumper accent.", specs: { compatibleWith: "OnePlus Nord CE3", caseType: "Back Cover", features: "Dual-layer protection, metallic bumper" }, variants: [["Polycarbonate + TPU","Back Cover","Gunmetal",999,10],["Polycarbonate + TPU","Back Cover","Silver",999,10]] },
    { brand: "Ringke", model: "Fusion X Case for Xiaomi 13", desc: "Rugged clear case with reinforced corner air pockets.", specs: { compatibleWith: "Xiaomi 13", caseType: "Back Cover", features: "Air cushion corners, matte bumper" }, variants: [["Polycarbonate + TPU","Back Cover","Clear",1099,9],["Polycarbonate + TPU","Back Cover","Camo Black",1099,9]] },
    { brand: "Nillkin", model: "Frosted Shield Pro for iPhone 15 Pro", desc: "Rigid frosted case with a metallic frame accent.", specs: { compatibleWith: "iPhone 15 Pro", caseType: "Back Cover", features: "Frosted matte back, metallic side frame" }, variants: [["Polycarbonate","Back Cover","Black",1299,9],["Polycarbonate","Back Cover","Blue",1299,9]] },
    { brand: "Case-Mate", model: "Twinkle Case for iPhone 14", desc: "Sparkle-effect case with a soft protective bumper.", specs: { compatibleWith: "iPhone 14", caseType: "Back Cover", features: "Glitter effect, cushioned bumper" }, variants: [["Polycarbonate + TPU","Back Cover","Rose Gold Glitter",1399,8],["Polycarbonate + TPU","Back Cover","Silver Glitter",1399,8]] },
    { brand: "OtterBox", model: "Symmetry Series for iPhone 15", desc: "Slim one-piece case with a sleek design and drop protection.", specs: { compatibleWith: "iPhone 15", caseType: "Back Cover", features: "One-piece design, raised bezels" }, variants: [["Polycarbonate + Synthetic Rubber","Back Cover","Black",1999,8],["Polycarbonate + Synthetic Rubber","Back Cover","Stardust",1999,8]] },
    { brand: "ESR", model: "Air Armor Case for Samsung Galaxy S23 FE", desc: "Shockproof case with visible air-cushion technology.", specs: { compatibleWith: "Samsung Galaxy S23 FE", caseType: "Back Cover", features: "Air cushion tech, anti-yellowing" }, variants: [["TPU","Back Cover","Clear",899,11],["TPU","Back Cover","Black",899,11]] },
    { brand: "Ghostek", model: "Nautical Waterproof Case for iPhone 14", desc: "Fully sealed waterproof and dustproof protective case.", specs: { compatibleWith: "iPhone 14", caseType: "Rugged Cover", features: "IP68 waterproof, dustproof seal" }, variants: [["Polycarbonate + Silicone","Rugged Cover","Black",2799,6],["Polycarbonate + Silicone","Rugged Cover","Clear",2799,6]] },
    { brand: "Caseology", model: "Legion Case for Samsung Galaxy S24", desc: "Military-grade rugged case with a kickstand.", specs: { compatibleWith: "Samsung Galaxy S24", caseType: "Rugged Cover with Kickstand", features: "Military-grade protection, built-in kickstand" }, variants: [["Polycarbonate + TPU","Rugged Cover","Black",1799,8],["Polycarbonate + TPU","Rugged Cover","Gray",1799,8]] },
    { brand: "UAG", model: "Pathfinder Case for Google Pixel 8 Pro", desc: "Rugged outdoor-styled case with textured grip pattern.", specs: { compatibleWith: "Google Pixel 8 Pro", caseType: "Back Cover", features: "Textured grip, armor shell design" }, variants: [["Polycarbonate + TPU","Back Cover","Olive",1999,7],["Polycarbonate + TPU","Back Cover","Black",1999,7]] },
    { brand: "Speck", model: "Presidio2 Grip for Samsung Galaxy S23", desc: "Case with raised ridges for a secure one-handed grip.", specs: { compatibleWith: "Samsung Galaxy S23", caseType: "Back Cover", features: "Grip ridges, raised screen edges" }, variants: [["Polycarbonate + Silicone","Back Cover","Black",1699,9],["Polycarbonate + Silicone","Back Cover","Cloudy Gray",1699,9]] },
    { brand: "Torras", model: "Guardian Case for iPhone 15 Pro", desc: "Slim aramid fiber case built for durability and grip.", specs: { compatibleWith: "iPhone 15 Pro", caseType: "Back Cover", features: "Aramid fiber back, anti-scratch coating" }, variants: [["Aramid Fiber","Back Cover","Black",1899,7],["Aramid Fiber","Back Cover","Gray",1899,7]] },
    { brand: "Nomad", model: "Modern Leather Case for iPhone 14", desc: "Minimalist leather case that develops a natural patina.", specs: { compatibleWith: "iPhone 14", caseType: "Back Cover", features: "Genuine leather, MagSafe compatible" }, variants: [["Genuine Leather","Back Cover","Brown",2999,6],["Genuine Leather","Back Cover","Black",2999,6]] },
    { brand: "Casetify", model: "Bounce Case for Samsung Galaxy S24", desc: "Bold color-blocked case with reinforced bumper edges.", specs: { compatibleWith: "Samsung Galaxy S24", caseType: "Back Cover", features: "Reinforced bumper, bold color-block design" }, variants: [["Polycarbonate + TPU","Back Cover","Neon Yellow",1599,8],["Polycarbonate + TPU","Back Cover","Electric Blue",1599,8]] },
    { brand: "Rhinoshield", model: "CrashGuard for iPhone 13", desc: "Modular bumper case designed for maximum shock absorption.", specs: { compatibleWith: "iPhone 13", caseType: "Bumper", features: "Modular design, shock-dispersing corners" }, variants: [["TPU","Bumper","Black",1299,9],["TPU","Bumper","Coral Peach",1299,9]] },
    { brand: "Spigen", model: "Slim Armor Case for Google Pixel 7a", desc: "Dual-layer case with a card-holding kickstand.", specs: { compatibleWith: "Google Pixel 7a", caseType: "Back Cover with Kickstand", features: "Dual-layer build, card slot kickstand" }, variants: [["Polycarbonate + TPU","Back Cover","Black",1199,9],["Polycarbonate + TPU","Back Cover","Gunmetal",1199,9]] },
    { brand: "Ringke", model: "Wallet Case for iPhone 15 Plus", desc: "Detachable wallet case with magnetic card holder.", specs: { compatibleWith: "iPhone 15 Plus", caseType: "Flip Cover", features: "Detachable card holder, magnetic closure" }, variants: [["PU Leather + TPU","Flip Cover","Black",1799,8],["PU Leather + TPU","Flip Cover","Brown",1799,8]] }
];

// ---------------------------------------------------------------
// Main seeding logic
// ---------------------------------------------------------------

async function seed() {

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not set in your environment");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const category = await Category.findById(CATEGORY_ID);

    if (!category) {
        throw new Error(
            `Category ${CATEGORY_ID} not found. Make sure it exists and is active.`
        );
    }

    let productCount = 0;
    let variantCount = 0;

    for (const cover of mobileCovers) {

        const name = `${cover.brand} ${cover.model}`;

        try {

            // 1. Create the product via the real service
            const product = await createProduct({
                categoryId: CATEGORY_ID,
                name,
                description: cover.desc,
                brand: cover.brand,
                specification: cover.specs
            });

            productCount++;

            // 2. Upload 3 product-level images via the real cloudinary path
            await addProductImages(product._id, pickImages(3));

            // 3. Create each variant (2 images per variant)
            const seenVariantKeys = new Set();

            for (const [material, caseType, color, price, discountPercentage] of cover.variants) {

                const variantKey = `${color}|${material}|${caseType}`.toUpperCase();

                if (seenVariantKeys.has(variantKey)) {
                    console.warn(`  Skipping duplicate variant for ${name}: ${variantKey}`);
                    continue;
                }
                seenVariantKeys.add(variantKey);

                const primarySpecification = { name: "Material", value: material };
                const secondarySpecification = { name: "Case Type", value: caseType };

                const images = pickImages(2);

                const { uploadImage } = require("../services/cloudinaryService");
                const uploadedVariantImages = [];
                for (const file of images) {
                    uploadedVariantImages.push(
                        await uploadImage(file.buffer, "poorvika/products")
                    );
                }

                await createProductVariant({
                    productId: product._id,
                    price,
                    discountPercentage,
                    color,
                    primarySpecification,
                    secondarySpecification,
                    attributes: { compatibleWith: cover.specs.compatibleWith },
                    images: uploadedVariantImages
                });

                variantCount++;
            }

            console.log(`Seeded: ${name} (${cover.variants.length} variants)`);

        } catch (error) {
            console.error(`Failed to seed ${name}:`, error.message);
        }
    }

    console.log(`\nDone. Products created: ${productCount}, Variants created: ${variantCount}`);

    await mongoose.disconnect();
}

seed().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
});
