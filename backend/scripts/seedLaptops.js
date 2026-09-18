/**
 * seedLaptops.js
 *
 * Seeds 50 laptop products (with variants) into the DB by calling
 * the ACTUAL createProduct / addProductImages / createProductVariant
 * functions from your codebase — not direct Model.create() calls.
 *
 * After each variant is created, its Inventory doc (created by
 * createProductVariant() at quantity 0) is stocked via the real
 * adjustInventory() service, so InventoryTransaction records are
 * generated exactly like they would in normal flow:
 *   - one ADD (150-400) for every variant
 *   - then a random follow-up: ~40% REMOVE, ~30% DAMAGE, ~30% none
 *
 * Product images: 3 per product. Variant images: 2 per variant.
 * Variants differ by RAM/Storage (primary/secondary spec) with color,
 * always distinct enough to avoid duplicate SKUs.
 *
 * ------------------------------------------------------------------
 * BEFORE RUNNING:
 * 1. Make sure backend/seed-data/laptops/image1.jpg ... image30.jpg exist.
 * 2. Make sure MONGO_URI and Cloudinary env vars are loaded via ../.env.
 * Run with: node seed-data/seedLaptops.js
 * ------------------------------------------------------------------
 */

const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config({
    path: require("path").join(__dirname, "../.env")
});

// ---- FIX THESE PATHS TO MATCH YOUR PROJECT ----
const {connectDB} = require("../config/db");
const Product = require("../models/product");
const ProductVariant = require("../models/productVariant");
const Category = require("../models/category"); // used only to sanity-check CATEGORY_ID

const { createProduct, addProductImages } = require("../services/productService"); // adjust path
const { createProductVariant } = require("../services/productVariantService"); // adjust path
const { adjustInventory } = require("../services/inventoryService"); // adjust path
// ------------------------------------------------

const CATEGORY_ID = "6aabb6041ff4257d8818b2b1"; // Laptop
const IMAGE_DIR = path.join(
    __dirname,
    "..",
    "seed-data",
    "laptops"
); // backend/seed-data/laptops
const TOTAL_IMAGES = 30;

// Same 6 user IDs used for the earlier 386-variant inventory backfill.
const userIds = [
    "6aaacf9c44a8fd647ddaf900",
    "6aaad508c96b0f3deeac05ec",
    "6aad02ad52bf908f5fd70fc0",
    "6aad030c6fa97b8934d85134",
    "6aad03375fe2864ca7e3f648",
    "6aad041a70483c11815d9e75"
];

const NOTES = {
    ADD: "Seed stock addition",
    REMOVE: "Seed stock removal",
    DAMAGE: "Seed damage adjustment"
};

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

function randInt(min, max) {
    // inclusive on both ends
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomUserId() {
    return userIds[randInt(0, userIds.length - 1)];
}

// Stocks a freshly created variant's Inventory doc via the real
// adjustInventory() service: one ADD, then a random follow-up.
async function seedInventoryForVariant(productVariantId) {
    const addQty = randInt(150, 400);

    await adjustInventory({
        productVariantId,
        quantity: addQty,
        type: "ADD",
        note: NOTES.ADD,
        performedBy: randomUserId()
    });

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
    } else if (roll < 0.7) {
        const damageQty = randInt(5, 100);
        await adjustInventory({
            productVariantId,
            quantity: damageQty,
            type: "DAMAGE",
            note: NOTES.DAMAGE,
            performedBy: randomUserId()
        });
    }
    // else: ADD-only, no follow-up
}

// ---------------------------------------------------------------
// 50 laptop definitions
// Each has 2 variant configs: [ram, storage, color, price, discount]
// ---------------------------------------------------------------

const laptops = [
    { brand: "Dell", model: "XPS 13", desc: "Premium ultraportable laptop with a compact InfinityEdge display.", specs: { processor: "Intel Core i7-1355U", display: "13.4-inch FHD+", gpu: "Intel Iris Xe", battery: "12hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Platinum Silver",114999,6],["32GB","1TB SSD","Graphite",149999,6]] },
    { brand: "Dell", model: "XPS 15", desc: "Powerful creator laptop with a large edge-to-edge display.", specs: { processor: "Intel Core i7-13700H", display: "15.6-inch OLED", gpu: "NVIDIA RTX 4050", battery: "10hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Platinum Silver",164999,5],["32GB","1TB SSD","Graphite",199999,5]] },
    { brand: "Dell", model: "Inspiron 15", desc: "Everyday laptop balancing performance and affordability.", specs: { processor: "Intel Core i5-1235U", display: "15.6-inch FHD", gpu: "Intel Iris Xe", battery: "8hrs", os: "Windows 11" }, variants: [["8GB","512GB SSD","Carbon Black",54999,10],["16GB","512GB SSD","Platinum Silver",64999,10]] },
    { brand: "Dell", model: "Latitude 5440", desc: "Business laptop built for durability and enterprise management.", specs: { processor: "Intel Core i5-1335U", display: "14-inch FHD", gpu: "Intel Iris Xe", battery: "10hrs", os: "Windows 11 Pro" }, variants: [["8GB","256GB SSD","Titan Gray",69999,8],["16GB","512GB SSD","Titan Gray",84999,8]] },
    { brand: "Dell", model: "Vostro 15", desc: "Budget-friendly business laptop for small teams.", specs: { processor: "Intel Core i3-1215U", display: "15.6-inch FHD", gpu: "Intel UHD Graphics", battery: "8hrs", os: "Windows 11" }, variants: [["8GB","256GB SSD","Black",42999,10],["8GB","512GB SSD","Black",47999,10]] },
    { brand: "Dell", model: "Alienware m16", desc: "High-performance gaming laptop with a sleek design.", specs: { processor: "Intel Core i9-13900HX", display: "16-inch QHD+ 240Hz", gpu: "NVIDIA RTX 4070", battery: "6hrs", os: "Windows 11" }, variants: [["16GB","1TB SSD","Dark Metallic Moon",229999,4],["32GB","2TB SSD","Dark Metallic Moon",289999,4]] },
    { brand: "HP", model: "Pavilion 15", desc: "Stylish all-round laptop for work, study, and streaming.", specs: { processor: "Intel Core i5-1335U", display: "15.6-inch FHD", gpu: "Intel Iris Xe", battery: "9hrs", os: "Windows 11" }, variants: [["8GB","512GB SSD","Natural Silver",57999,9],["16GB","512GB SSD","Natural Silver",67999,9]] },
    { brand: "HP", model: "Envy x360", desc: "Convertible 2-in-1 laptop with a touchscreen and stylus support.", specs: { processor: "AMD Ryzen 7 7730U", display: "15.6-inch FHD Touch", gpu: "AMD Radeon Graphics", battery: "10hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Nightfall Black",84999,7],["16GB","1TB SSD","Nightfall Black",99999,7]] },
    { brand: "HP", model: "Spectre x360", desc: "Premium convertible laptop with a gem-cut design.", specs: { processor: "Intel Core i7-1355U", display: "13.5-inch OLED Touch", gpu: "Intel Iris Xe", battery: "12hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Nightfall Black",139999,6],["32GB","1TB SSD","Nocturne Blue",174999,6]] },
    { brand: "HP", model: "Omen 16", desc: "Gaming laptop with a fast refresh-rate display and RGB keyboard.", specs: { processor: "Intel Core i7-13700HX", display: "16.1-inch QHD 165Hz", gpu: "NVIDIA RTX 4060", battery: "6hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Shadow Black",119999,7],["32GB","1TB SSD","Shadow Black",149999,7]] },
    { brand: "HP", model: "ProBook 450", desc: "Reliable business laptop with enterprise-grade security.", specs: { processor: "Intel Core i5-1335U", display: "15.6-inch FHD", gpu: "Intel Iris Xe", battery: "10hrs", os: "Windows 11 Pro" }, variants: [["8GB","512GB SSD","Silver",64999,8],["16GB","512GB SSD","Silver",74999,8]] },
    { brand: "Lenovo", model: "ThinkPad X1 Carbon", desc: "Ultralight business laptop known for its legendary keyboard.", specs: { processor: "Intel Core i7-1355U", display: "14-inch WUXGA", gpu: "Intel Iris Xe", battery: "12hrs", os: "Windows 11 Pro" }, variants: [["16GB","512GB SSD","Black",139999,6],["32GB","1TB SSD","Black",174999,6]] },
    { brand: "Lenovo", model: "Legion 5", desc: "Gaming laptop with strong thermals and a high refresh display.", specs: { processor: "AMD Ryzen 7 7745HX", display: "15.6-inch QHD 165Hz", gpu: "NVIDIA RTX 4060", battery: "6hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Onyx Grey",104999,7],["32GB","1TB SSD","Onyx Grey",134999,7]] },
    { brand: "Lenovo", model: "IdeaPad Slim 5", desc: "Slim everyday laptop with a comfortable keyboard.", specs: { processor: "AMD Ryzen 5 7530U", display: "15.6-inch FHD", gpu: "AMD Radeon Graphics", battery: "9hrs", os: "Windows 11" }, variants: [["8GB","512GB SSD","Cloud Grey",49999,10],["16GB","512GB SSD","Cloud Grey",59999,10]] },
    { brand: "Lenovo", model: "Yoga 7i", desc: "Convertible 2-in-1 laptop with a premium aluminum build.", specs: { processor: "Intel Core i7-1355U", display: "14.5-inch 2.8K Touch", gpu: "Intel Iris Xe", battery: "10hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Storm Grey",94999,7],["16GB","1TB SSD","Storm Grey",109999,7]] },
    { brand: "Lenovo", model: "ThinkBook 14", desc: "Affordable business laptop for small teams and startups.", specs: { processor: "Intel Core i5-1335U", display: "14-inch FHD", gpu: "Intel Iris Xe", battery: "9hrs", os: "Windows 11" }, variants: [["8GB","512GB SSD","Mineral Grey",54999,9],["16GB","512GB SSD","Mineral Grey",64999,9]] },
    { brand: "Apple", model: "MacBook Air M2", desc: "Thin and light laptop powered by Apple's M2 chip.", specs: { processor: "Apple M2", display: "13.6-inch Liquid Retina", gpu: "8-core GPU", battery: "18hrs", os: "macOS" }, variants: [["8GB","256GB SSD","Midnight",99900,3],["16GB","512GB SSD","Starlight",129900,3]] },
    { brand: "Apple", model: "MacBook Air M3", desc: "Latest thin-and-light MacBook Air with M3 performance.", specs: { processor: "Apple M3", display: "13.6-inch Liquid Retina", gpu: "10-core GPU", battery: "18hrs", os: "macOS" }, variants: [["8GB","256GB SSD","Midnight",114900,2],["16GB","512GB SSD","Space Grey",144900,2]] },
    { brand: "Apple", model: "MacBook Pro 14 M3", desc: "Pro-grade laptop with a Liquid Retina XDR display.", specs: { processor: "Apple M3 Pro", display: "14.2-inch Liquid Retina XDR", gpu: "14-core GPU", battery: "17hrs", os: "macOS" }, variants: [["18GB","512GB SSD","Space Black",199900,2],["36GB","1TB SSD","Silver",259900,2]] },
    { brand: "Apple", model: "MacBook Pro 16 M3 Pro", desc: "Large-screen pro laptop for demanding creative workflows.", specs: { processor: "Apple M3 Pro", display: "16.2-inch Liquid Retina XDR", gpu: "18-core GPU", battery: "22hrs", os: "macOS" }, variants: [["18GB","512GB SSD","Space Black",249900,2],["36GB","1TB SSD","Silver",299900,2]] },
    { brand: "Asus", model: "ROG Zephyrus G14", desc: "Compact gaming laptop with a striking AniMe Matrix lid.", specs: { processor: "AMD Ryzen 9 7940HS", display: "14-inch QHD+ 165Hz", gpu: "NVIDIA RTX 4060", battery: "8hrs", os: "Windows 11" }, variants: [["16GB","1TB SSD","Eclipse Grey",144999,5],["32GB","1TB SSD","Platinum White",169999,5]] },
    { brand: "Asus", model: "Vivobook 15", desc: "Colorful everyday laptop for students and professionals.", specs: { processor: "Intel Core i5-1335U", display: "15.6-inch FHD", gpu: "Intel Iris Xe", battery: "8hrs", os: "Windows 11" }, variants: [["8GB","512GB SSD","Quiet Blue",47999,11],["16GB","512GB SSD","Quiet Blue",57999,11]] },
    { brand: "Asus", model: "ZenBook 14 OLED", desc: "Sleek productivity laptop with a vibrant OLED display.", specs: { processor: "Intel Core i7-1355U", display: "14-inch 2.8K OLED", gpu: "Intel Iris Xe", battery: "10hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Ponder Blue",84999,8],["16GB","1TB SSD","Ponder Blue",99999,8]] },
    { brand: "Asus", model: "TUF Gaming A15", desc: "Durable gaming laptop built to MIL-STD-810H standards.", specs: { processor: "AMD Ryzen 7 7735HS", display: "15.6-inch FHD 144Hz", gpu: "NVIDIA RTX 4050", battery: "7hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Mecha Gray",84999,9],["16GB","1TB SSD","Mecha Gray",99999,9]] },
    { brand: "Asus", model: "ExpertBook B1", desc: "Rugged business laptop with a long battery life.", specs: { processor: "Intel Core i5-1335U", display: "14-inch FHD", gpu: "Intel Iris Xe", battery: "10hrs", os: "Windows 11 Pro" }, variants: [["8GB","256GB SSD","Star Black",52999,9],["16GB","512GB SSD","Star Black",62999,9]] },
    { brand: "Acer", model: "Aspire 5", desc: "Budget-friendly laptop suited for everyday productivity.", specs: { processor: "Intel Core i5-1335U", display: "15.6-inch FHD", gpu: "Intel Iris Xe", battery: "9hrs", os: "Windows 11" }, variants: [["8GB","512GB SSD","Pure Silver",44999,11],["16GB","512GB SSD","Pure Silver",54999,11]] },
    { brand: "Acer", model: "Swift 3", desc: "Thin and light laptop with a full-metal chassis.", specs: { processor: "AMD Ryzen 7 7730U", display: "14-inch FHD", gpu: "AMD Radeon Graphics", battery: "11hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Silver",64999,9],["16GB","1TB SSD","Silver",74999,9]] },
    { brand: "Acer", model: "Predator Helios 16", desc: "High-end gaming laptop with a mini-LED display option.", specs: { processor: "Intel Core i9-13900HX", display: "16-inch QHD+ 240Hz", gpu: "NVIDIA RTX 4070", battery: "6hrs", os: "Windows 11" }, variants: [["16GB","1TB SSD","Abyssal Black",199999,5],["32GB","2TB SSD","Abyssal Black",249999,5]] },
    { brand: "Acer", model: "Nitro 5", desc: "Value-focused gaming laptop with solid thermal performance.", specs: { processor: "Intel Core i5-13420H", display: "15.6-inch FHD 144Hz", gpu: "NVIDIA RTX 4050", battery: "6hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Obsidian Black",79999,10],["16GB","1TB SSD","Obsidian Black",94999,10]] },
    { brand: "Acer", model: "Chromebook Spin 514", desc: "Convertible Chromebook built for lightweight, cloud-based work.", specs: { processor: "AMD Ryzen 3 7320C", display: "14-inch FHD Touch", gpu: "AMD Radeon Graphics", battery: "10hrs", os: "ChromeOS" }, variants: [["8GB","128GB eMMC","Steel Gray",39999,10],["8GB","256GB SSD","Steel Gray",44999,10]] },
    { brand: "MSI", model: "Modern 14", desc: "Slim business laptop with a lightweight aluminum design.", specs: { processor: "Intel Core i5-1335U", display: "14-inch FHD", gpu: "Intel Iris Xe", battery: "9hrs", os: "Windows 11" }, variants: [["8GB","512GB SSD","Urban Silver",54999,10],["16GB","512GB SSD","Urban Silver",64999,10]] },
    { brand: "MSI", model: "Katana 15", desc: "Entry-level gaming laptop with strong price-to-performance.", specs: { processor: "Intel Core i7-13620H", display: "15.6-inch FHD 144Hz", gpu: "NVIDIA RTX 4060", battery: "6hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Black",89999,9],["16GB","1TB SSD","Black",104999,9]] },
    { brand: "MSI", model: "Stealth 16", desc: "Premium slim gaming laptop with a high-res display.", specs: { processor: "Intel Core i9-13900H", display: "16-inch QHD+ 240Hz", gpu: "NVIDIA RTX 4070", battery: "6hrs", os: "Windows 11" }, variants: [["32GB","1TB SSD","Core Black",204999,6],["32GB","2TB SSD","Core Black",239999,6]] },
    { brand: "MSI", model: "Prestige 13", desc: "Compact creator laptop with a color-accurate display.", specs: { processor: "Intel Core i7-1360P", display: "13.3-inch QHD+", gpu: "Intel Iris Xe", battery: "10hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Carbon Gray",99999,7],["32GB","1TB SSD","Carbon Gray",129999,7]] },
    { brand: "Microsoft", model: "Surface Laptop 5", desc: "Minimalist premium laptop with a signature Alcantara option.", specs: { processor: "Intel Core i5-1235U", display: "13.5-inch PixelSense Touch", gpu: "Intel Iris Xe", battery: "18hrs", os: "Windows 11" }, variants: [["8GB","256GB SSD","Platinum",99999,5],["16GB","512GB SSD","Matte Black",134999,5]] },
    { brand: "Microsoft", model: "Surface Laptop Go 3", desc: "Compact and lightweight laptop for everyday tasks.", specs: { processor: "Intel Core i5-1235U", display: "12.4-inch PixelSense Touch", gpu: "Intel Iris Xe", battery: "15hrs", os: "Windows 11" }, variants: [["8GB","256GB SSD","Sandstone",74999,6],["16GB","256GB SSD","Platinum",89999,6]] },
    { brand: "Samsung", model: "Galaxy Book4 Pro", desc: "Premium AMOLED laptop designed for the Galaxy ecosystem.", specs: { processor: "Intel Core Ultra 7", display: "14-inch 3K AMOLED Touch", gpu: "Intel Arc Graphics", battery: "13hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Moonstone Gray",139999,6],["16GB","1TB SSD","Moonstone Gray",164999,6]] },
    { brand: "Samsung", model: "Galaxy Book4", desc: "Everyday laptop with reliable performance and long battery life.", specs: { processor: "Intel Core i5-1335U", display: "15.6-inch FHD", gpu: "Intel Iris Xe", battery: "10hrs", os: "Windows 11" }, variants: [["8GB","512GB SSD","Silver",59999,9],["16GB","512GB SSD","Silver",69999,9]] },
    { brand: "LG", model: "Gram 16", desc: "Ultra-lightweight large-screen laptop under 1.2kg.", specs: { processor: "Intel Core i7-1360P", display: "16-inch WQXGA", gpu: "Intel Iris Xe", battery: "19.5hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Obsidian Black",124999,6],["32GB","1TB SSD","Snow White",154999,6]] },
    { brand: "LG", model: "Gram 14", desc: "Compact featherweight laptop for travel and everyday use.", specs: { processor: "Intel Core i5-1340P", display: "14-inch WUXGA", gpu: "Intel Iris Xe", battery: "21.5hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Obsidian Black",99999,7],["16GB","1TB SSD","Snow White",119999,7]] },
    { brand: "Dell", model: "G15 Gaming", desc: "Mainstream gaming laptop with a bold, angular design.", specs: { processor: "Intel Core i7-13650HX", display: "15.6-inch FHD 165Hz", gpu: "NVIDIA RTX 4050", battery: "6hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Specter Green",89999,8],["16GB","1TB SSD","Specter Green",104999,8]] },
    { brand: "HP", model: "Victus 15", desc: "Affordable gaming laptop with a clean, understated design.", specs: { processor: "AMD Ryzen 5 7535HS", display: "15.6-inch FHD 144Hz", gpu: "NVIDIA RTX 3050", battery: "7hrs", os: "Windows 11" }, variants: [["8GB","512GB SSD","Mica Silver",64999,10],["16GB","512GB SSD","Mica Silver",74999,10]] },
    { brand: "Lenovo", model: "Legion Slim 5", desc: "Slim gaming laptop that balances portability with power.", specs: { processor: "AMD Ryzen 7 7840HS", display: "16-inch WQXGA 165Hz", gpu: "NVIDIA RTX 4060", battery: "7hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Storm Grey",134999,6],["32GB","1TB SSD","Storm Grey",164999,6]] },
    { brand: "Asus", model: "ROG Strix G16", desc: "High-performance gaming laptop with an aggressive design.", specs: { processor: "Intel Core i7-13650HX", display: "16-inch FHD+ 165Hz", gpu: "NVIDIA RTX 4060", battery: "6hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","Eclipse Gray",134999,7],["32GB","1TB SSD","Eclipse Gray",164999,7]] },
    { brand: "Acer", model: "Aspire Vero", desc: "Eco-conscious laptop made with recycled plastics.", specs: { processor: "Intel Core i5-1335U", display: "15.6-inch FHD", gpu: "Intel Iris Xe", battery: "9hrs", os: "Windows 11" }, variants: [["8GB","512GB SSD","Vero White",54999,9],["16GB","512GB SSD","Vero White",64999,9]] },
    { brand: "HP", model: "Chromebook 14", desc: "Simple and affordable Chromebook for browsing and study.", specs: { processor: "Intel Celeron N4500", display: "14-inch FHD", gpu: "Intel UHD Graphics", battery: "12hrs", os: "ChromeOS" }, variants: [["4GB","64GB eMMC","Chalkboard Gray",24999,10],["8GB","128GB eMMC","Chalkboard Gray",29999,10]] },
    { brand: "Lenovo", model: "Flex 5", desc: "Budget-friendly 2-in-1 convertible laptop with a touchscreen.", specs: { processor: "AMD Ryzen 5 7530U", display: "14-inch FHD Touch", gpu: "AMD Radeon Graphics", battery: "9hrs", os: "Windows 11" }, variants: [["8GB","512GB SSD","Storm Grey",54999,10],["16GB","512GB SSD","Storm Grey",64999,10]] },
    { brand: "Dell", model: "Inspiron 14 2-in-1", desc: "Versatile convertible laptop for work and entertainment.", specs: { processor: "Intel Core i5-1335U", display: "14-inch FHD Touch", gpu: "Intel Iris Xe", battery: "9hrs", os: "Windows 11" }, variants: [["8GB","512GB SSD","Platinum Silver",64999,9],["16GB","512GB SSD","Platinum Silver",74999,9]] },
    { brand: "MSI", model: "Cyborg 15", desc: "Entry gaming laptop with a distinctive mecha-inspired design.", specs: { processor: "Intel Core i5-13420H", display: "15.6-inch FHD 144Hz", gpu: "NVIDIA RTX 4050", battery: "6hrs", os: "Windows 11" }, variants: [["16GB","512GB SSD","White Mecha",79999,10],["16GB","1TB SSD","White Mecha",94999,10]] },
    { brand: "Asus", model: "Chromebook Flip", desc: "Lightweight convertible Chromebook with a 360-degree hinge.", specs: { processor: "Intel Core i3-1215U", display: "12.5-inch FHD Touch", gpu: "Intel UHD Graphics", battery: "10hrs", os: "ChromeOS" }, variants: [["8GB","128GB SSD","Silver",39999,9],["8GB","256GB SSD","Silver",44999,9]] }
];

// ---------------------------------------------------------------
// Main seeding logic
// ---------------------------------------------------------------

async function seed() {

    await connectDB();
    console.log("Connected to MongoDB");

    const category = await Category.findById(CATEGORY_ID);

    if (!category) {
        throw new Error(
            `Category ${CATEGORY_ID} not found. Make sure it exists and is active.`
        );
    }

    let productCount = 0;
    let variantCount = 0;
    let inventorySeeded = 0;
    const inventoryFailures = [];

    for (const laptop of laptops) {

        const name = `${laptop.brand} ${laptop.model}`;

        try {

            // 1. Create the product via the real service
            const product = await createProduct({
                categoryId: CATEGORY_ID,
                name,
                description: laptop.desc,
                brand: laptop.brand,
                specification: laptop.specs
            });

            productCount++;

            // 2. Upload 3 product-level images via the real cloudinary path
            await addProductImages(product._id, pickImages(3));

            // 3. Create each variant (2 images per variant)
            const seenVariantKeys = new Set();

            for (const [ram, storage, color, price, discountPercentage] of laptop.variants) {

                const variantKey = `${color}|${ram}|${storage}`.toUpperCase();

                if (seenVariantKeys.has(variantKey)) {
                    console.warn(`  Skipping duplicate variant for ${name}: ${variantKey}`);
                    continue;
                }
                seenVariantKeys.add(variantKey);

                const primarySpecification = { name: "RAM", value: ram };
                const secondarySpecification = { name: "Storage", value: storage };

                const images = pickImages(2);

                const { uploadImage } = require("../services/cloudinaryService");
                const uploadedVariantImages = [];
                for (const file of images) {
                    uploadedVariantImages.push(
                        await uploadImage(file.buffer, "poorvika/products")
                    );
                }

                const variant = await createProductVariant({
                    productId: product._id,
                    price,
                    discountPercentage,
                    color,
                    primarySpecification,
                    secondarySpecification,
                    attributes: { warranty: "1 Year" },
                    images: uploadedVariantImages
                });

                variantCount++;

                // 4. Stock the variant's Inventory doc via the real
                //    adjustInventory() service (ADD, then random REMOVE/DAMAGE)
                try {
                    await seedInventoryForVariant(variant._id);
                    inventorySeeded++;
                } catch (invError) {
                    console.error(`  Inventory seed failed for variant ${variant._id}: ${invError.message}`);
                    inventoryFailures.push({
                        variantId: variant._id.toString(),
                        product: name,
                        error: invError.message
                    });
                }
            }

            console.log(`Seeded: ${name} (${laptop.variants.length} variants)`);

        } catch (error) {
            console.error(`Failed to seed ${name}:`, error.message);
        }
    }

    console.log(`\nDone. Products created: ${productCount}, Variants created: ${variantCount}`);
    console.log(`Inventory transactions seeded for: ${inventorySeeded} variant(s)`);

    if (inventoryFailures.length) {
        console.log(`\nInventory seeding failed for ${inventoryFailures.length} variant(s):`);
        inventoryFailures.forEach(f =>
            console.log(`  ${f.variantId} (${f.product}) -> ${f.error}`)
        );
    }

    await mongoose.disconnect();
}

seed().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
});
