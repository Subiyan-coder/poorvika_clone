/**
 * seedMobiles.js
 *
 * Seeds 50 mobile phone products (with variants) into the DB by calling
 * the ACTUAL createProduct / addProductImages / createProductVariant
 * functions from your codebase — not direct Model.create() calls.
 *
 * ------------------------------------------------------------------
 * BEFORE RUNNING — fix these:
 * ------------------------------------------------------------------
 * 1. Update the require() paths below to match your project structure.
 * 2. Set CATEGORY_ID to a real, active Category _id in your DB
 *    (createProduct reads category.sku, so the category must have one).
 * 3. Make sure MONGO_URI and Cloudinary env vars are loaded (dotenv).
 * 4. Make sure backend/seed-data/mobiles/image1.jpg ... image30.jpg exist.
 *
 * Run with: node seed-data/seedMobiles.js
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

const CATEGORY_ID = "6aabb63b1ff4257d8818b2b3";
const IMAGE_DIR = path.join(
    __dirname,
    "..",
    "seed-data",
    "mobiles"
); // backend/seed-data/mobiles

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
// 50 mobile phone definitions
// Each has 2 variant configs (ram/storage/color/price/discount)
// ---------------------------------------------------------------

const mobiles = [
    { brand: "Samsung", model: "Galaxy S24 Ultra", desc: "Flagship Samsung phone with S-Pen support and a 200MP camera.", specs: { display: "6.8-inch QHD+ AMOLED", processor: "Snapdragon 8 Gen 3", camera: "200MP Quad Camera", battery: "5000mAh", os: "Android 14" }, variants: [["12GB","256GB","Titanium Black",129999,5],["12GB","512GB","Titanium Gray",144999,5]] },
    { brand: "Samsung", model: "Galaxy S24", desc: "Compact flagship with AI-powered camera features.", specs: { display: "6.2-inch FHD+ AMOLED", processor: "Exynos 2400", camera: "50MP Triple Camera", battery: "4000mAh", os: "Android 14" }, variants: [["8GB","128GB","Onyx Black",79999,8],["8GB","256GB","Marble Gray",84999,8]] },
    { brand: "Samsung", model: "Galaxy A54", desc: "Mid-range Samsung phone with a bright AMOLED display.", specs: { display: "6.4-inch FHD+ AMOLED", processor: "Exynos 1380", camera: "50MP OIS Camera", battery: "5000mAh", os: "Android 13" }, variants: [["6GB","128GB","Awesome Lime",32999,10],["8GB","256GB","Awesome Violet",37999,10]] },
    { brand: "Samsung", model: "Galaxy A34", desc: "Reliable mid-ranger with a large display and long battery life.", specs: { display: "6.6-inch FHD+ sAMOLED", processor: "MediaTek Dimensity 1080", camera: "48MP OIS Camera", battery: "5000mAh", os: "Android 13" }, variants: [["6GB","128GB","Awesome Silver",26999,12],["8GB","128GB","Awesome Graphite",28999,12]] },
    { brand: "Samsung", model: "Galaxy M14", desc: "Budget Samsung phone with a massive 6000mAh battery.", specs: { display: "6.6-inch FHD+", processor: "MediaTek Helio G99", camera: "50MP Triple Camera", battery: "6000mAh", os: "Android 13" }, variants: [["4GB","64GB","Berry Blue",13999,5],["6GB","128GB","Icy Silver",15999,5]] },
    { brand: "Samsung", model: "Galaxy Z Flip5", desc: "Compact foldable phone with a large cover screen.", specs: { display: "6.7-inch Foldable AMOLED", processor: "Snapdragon 8 Gen 2", camera: "12MP Dual Camera", battery: "3700mAh", os: "Android 13" }, variants: [["8GB","256GB","Mint",99999,6],["8GB","512GB","Graphite",109999,6]] },
    { brand: "Apple", model: "iPhone 15 Pro Max", desc: "Apple's flagship with a titanium frame and A17 Pro chip.", specs: { display: "6.7-inch Super Retina XDR", processor: "A17 Pro", camera: "48MP Triple Camera", battery: "4441mAh", os: "iOS 17" }, variants: [["-","256GB","Natural Titanium",159900,2],["-","512GB","Blue Titanium",179900,2]] },
    { brand: "Apple", model: "iPhone 15", desc: "Dynamic Island comes to the standard iPhone lineup.", specs: { display: "6.1-inch Super Retina XDR", processor: "A16 Bionic", camera: "48MP Dual Camera", battery: "3349mAh", os: "iOS 17" }, variants: [["-","128GB","Black",79900,3],["-","256GB","Pink",89900,3]] },
    { brand: "Apple", model: "iPhone 14", desc: "Reliable performance with an improved camera system.", specs: { display: "6.1-inch Super Retina XDR", processor: "A15 Bionic", camera: "12MP Dual Camera", battery: "3279mAh", os: "iOS 16" }, variants: [["-","128GB","Midnight",65900,5],["-","256GB","Starlight",71900,5]] },
    { brand: "Apple", model: "iPhone 13", desc: "Still a strong performer with a compact form factor.", specs: { display: "6.1-inch Super Retina XDR", processor: "A15 Bionic", camera: "12MP Dual Camera", battery: "3240mAh", os: "iOS 16" }, variants: [["-","128GB","Blue",59900,8],["-","256GB","Pink",64900,8]] },
    { brand: "Apple", model: "iPhone SE (2022)", desc: "Compact and affordable iPhone with Touch ID.", specs: { display: "4.7-inch Retina HD", processor: "A15 Bionic", camera: "12MP Single Camera", battery: "2018mAh", os: "iOS 16" }, variants: [["-","64GB","Midnight",43900,4],["-","128GB","Starlight",48900,4]] },
    { brand: "OnePlus", model: "OnePlus 12", desc: "Flagship killer with Hasselblad camera tuning.", specs: { display: "6.82-inch QHD+ AMOLED", processor: "Snapdragon 8 Gen 3", camera: "50MP Triple Camera", battery: "5400mAh", os: "OxygenOS 14" }, variants: [["12GB","256GB","Flowy Emerald",64999,4],["16GB","512GB","Silky Black",69999,4]] },
    { brand: "OnePlus", model: "OnePlus 12R", desc: "Value flagship with fast charging and a smooth display.", specs: { display: "6.78-inch QHD+ AMOLED", processor: "Snapdragon 8 Gen 2", camera: "50MP Dual Camera", battery: "5500mAh", os: "OxygenOS 14" }, variants: [["8GB","128GB","Cool Blue",39999,6],["16GB","256GB","Iron Gray",44999,6]] },
    { brand: "OnePlus", model: "OnePlus Nord 3", desc: "Mid-range Nord with flagship-level display quality.", specs: { display: "6.74-inch FHD+ AMOLED", processor: "MediaTek Dimensity 9000", camera: "50MP OIS Camera", battery: "5000mAh", os: "OxygenOS 13.1" }, variants: [["8GB","128GB","Misty Green",29999,10],["16GB","256GB","Tempest Gray",33999,10]] },
    { brand: "OnePlus", model: "OnePlus Nord CE3", desc: "Balanced mid-ranger for everyday performance.", specs: { display: "6.7-inch FHD+ AMOLED", processor: "Snapdragon 782G", camera: "50MP OIS Camera", battery: "5000mAh", os: "OxygenOS 13.1" }, variants: [["8GB","128GB","Aqua Surge",24999,8],["8GB","256GB","Groove Gold",26999,8]] },
    { brand: "OnePlus", model: "OnePlus Nord 4", desc: "Metal-unibody Nord with flagship chipset.", specs: { display: "6.74-inch FHD+ AMOLED", processor: "Snapdragon 7+ Gen 3", camera: "50MP OIS Camera", battery: "5500mAh", os: "OxygenOS 14.1" }, variants: [["8GB","256GB","Obsidian Midnight",29999,7],["12GB","256GB","Mercurial Silver",32999,7]] },
    { brand: "Xiaomi", model: "Xiaomi 14", desc: "Compact flagship with Leica-tuned optics.", specs: { display: "6.36-inch AMOLED", processor: "Snapdragon 8 Gen 3", camera: "50MP Leica Triple Camera", battery: "4610mAh", os: "HyperOS" }, variants: [["12GB","256GB","Black",69999,5],["12GB","512GB","White",74999,5]] },
    { brand: "Xiaomi", model: "Xiaomi 13", desc: "Premium build with strong everyday performance.", specs: { display: "6.36-inch AMOLED", processor: "Snapdragon 8 Gen 2", camera: "50MP Leica Triple Camera", battery: "4500mAh", os: "MIUI 14" }, variants: [["8GB","256GB","Mint Green",54999,8],["12GB","256GB","Black",59999,8]] },
    { brand: "Xiaomi", model: "Redmi Note 13 Pro", desc: "Popular mid-range series known for camera quality.", specs: { display: "6.67-inch AMOLED", processor: "MediaTek Dimensity 7200 Ultra", camera: "200MP OIS Camera", battery: "5100mAh", os: "MIUI 14" }, variants: [["8GB","128GB","Coral Purple",24999,10],["8GB","256GB","Midnight Black",26999,10]] },
    { brand: "Xiaomi", model: "Redmi 13C", desc: "Entry-level phone with a large display and big battery.", specs: { display: "6.74-inch HD+", processor: "MediaTek Helio G85", camera: "50MP Dual Camera", battery: "5000mAh", os: "MIUI 14" }, variants: [["4GB","128GB","Navy Blue",9999,5],["6GB","128GB","Star Blue",10999,5]] },
    { brand: "Xiaomi", model: "Redmi 12", desc: "Affordable phone with a 90Hz display.", specs: { display: "6.79-inch FHD+", processor: "MediaTek Helio G88", camera: "50MP AI Dual Camera", battery: "5000mAh", os: "MIUI 14" }, variants: [["4GB","128GB","Sky Blue",11999,6],["6GB","128GB","Polar Silver",13999,6]] },
    { brand: "Xiaomi", model: "Redmi A3", desc: "Ultra-budget phone for basic smartphone needs.", specs: { display: "6.71-inch HD+", processor: "MediaTek Helio G36", camera: "8MP AI Dual Camera", battery: "5000mAh", os: "Android 14 Go Edition" }, variants: [["3GB","64GB","Star Black",7499,4],["4GB","128GB","Olive Green",8499,4]] },
    { brand: "POCO", model: "POCO X6", desc: "Performance-focused mid-ranger with a curved AMOLED display.", specs: { display: "6.67-inch Curved AMOLED", processor: "Snapdragon 7s Gen 2", camera: "64MP OIS Camera", battery: "5100mAh", os: "HyperOS" }, variants: [["8GB","256GB","Black",23999,9],["12GB","256GB","Blue",25999,9]] },
    { brand: "POCO", model: "POCO M6 Pro", desc: "Budget performance phone with a large HD+ display.", specs: { display: "6.79-inch FHD+", processor: "MediaTek Helio G99 Ultra", camera: "64MP OIS Camera", battery: "5000mAh", os: "HyperOS" }, variants: [["6GB","128GB","Power Black",13999,7],["8GB","256GB","Astral Blue",15999,7]] },
    { brand: "Realme", model: "Realme 12 Pro+", desc: "Camera-focused phone with a periscope telephoto lens.", specs: { display: "6.7-inch AMOLED", processor: "Snapdragon 7s Gen 2", camera: "50MP Periscope Camera", battery: "5000mAh", os: "Realme UI 5.0" }, variants: [["8GB","128GB","Submarine Blue",29999,8],["12GB","256GB","Beach Sand",32999,8]] },
    { brand: "Realme", model: "Realme 11x", desc: "Value-focused phone with a curved display.", specs: { display: "6.72-inch AMOLED", processor: "MediaTek Dimensity 6100+", camera: "100MP Camera", battery: "5000mAh", os: "Realme UI 4.0" }, variants: [["6GB","128GB","Purple Dawn",14999,10],["8GB","128GB","Midnight Black",16999,10]] },
    { brand: "Realme", model: "Realme Narzo 60", desc: "Distinctive vegan-leather back with a bright display.", specs: { display: "6.72-inch AMOLED", processor: "MediaTek Dimensity 6020", camera: "64MP Camera", battery: "5000mAh", os: "Realme UI 4.0" }, variants: [["8GB","128GB","Mars Orange",15999,9],["8GB","256GB","Cool Blue",17999,9]] },
    { brand: "Vivo", model: "Vivo V29", desc: "Stylish phone with a curved AMOLED display and Aura light.", specs: { display: "6.78-inch Curved AMOLED", processor: "Snapdragon 778G", camera: "50MP Portrait Camera", battery: "4600mAh", os: "FunTouch OS 13" }, variants: [["8GB","128GB","Himalayan Blue",33999,6],["12GB","256GB","Space Black",37999,6]] },
    { brand: "Vivo", model: "Vivo Y200", desc: "Mid-range phone with a curved display and fast charging.", specs: { display: "6.67-inch Curved AMOLED", processor: "Snapdragon 4 Gen 2", camera: "50MP OIS Camera", battery: "5000mAh", os: "FunTouch OS 14" }, variants: [["8GB","128GB","Diamond Black",19999,8],["8GB","256GB","Pearl White",21999,8]] },
    { brand: "Vivo", model: "Vivo T3x", desc: "Budget-friendly phone with a large battery.", specs: { display: "6.72-inch FHD+", processor: "Snapdragon 6 Gen 1", camera: "50MP OIS Camera", battery: "6000mAh", os: "FunTouch OS 14" }, variants: [["6GB","128GB","Marine Blue",14999,7],["8GB","128GB","Crimson Bliss",16499,7]] },
    { brand: "Oppo", model: "Oppo Reno 11", desc: "Portrait-focused camera phone with a sleek design.", specs: { display: "6.7-inch AMOLED", processor: "MediaTek Dimensity 7050", camera: "50MP Portrait Camera", battery: "5000mAh", os: "ColorOS 14" }, variants: [["8GB","128GB","Rock Grey",29999,7],["8GB","256GB","Wave Green",31999,7]] },
    { brand: "Oppo", model: "Oppo Reno 12", desc: "AI-focused camera phone with a refined design.", specs: { display: "6.7-inch AMOLED", processor: "MediaTek Dimensity 7300 Energy", camera: "50MP AI Portrait Camera", battery: "5800mAh", os: "ColorOS 14.1" }, variants: [["8GB","256GB","Matte Brown",32999,6],["12GB","256GB","Amber Orange",35999,6]] },
    { brand: "Oppo", model: "Oppo A78", desc: "Reliable mid-range phone with a compact design.", specs: { display: "6.56-inch FHD+", processor: "Snapdragon 680", camera: "50MP AI Camera", battery: "5000mAh", os: "ColorOS 13.1" }, variants: [["8GB","128GB","Glowing Black",17999,9],["8GB","128GB","Aqua Green",17999,9]] },
    { brand: "Oppo", model: "Oppo F25 Pro", desc: "Curved display phone with military-grade durability.", specs: { display: "6.7-inch Curved AMOLED", processor: "MediaTek Dimensity 7050", camera: "64MP OIS Camera", battery: "5000mAh", os: "ColorOS 14" }, variants: [["8GB","128GB","Coral Purple",24999,8],["12GB","256GB","Sunny Gold",27999,8]] },
    { brand: "Google", model: "Pixel 8 Pro", desc: "Google's flagship with advanced AI camera features.", specs: { display: "6.7-inch LTPO OLED", processor: "Google Tensor G3", camera: "50MP Triple Camera", battery: "5050mAh", os: "Android 14" }, variants: [["12GB","128GB","Obsidian",106999,4],["12GB","256GB","Porcelain",114999,4]] },
    { brand: "Google", model: "Pixel 8", desc: "Compact flagship with clean Android and great cameras.", specs: { display: "6.2-inch OLED", processor: "Google Tensor G3", camera: "50MP Dual Camera", battery: "4575mAh", os: "Android 14" }, variants: [["8GB","128GB","Hazel",75999,5],["8GB","256GB","Rose",81999,5]] },
    { brand: "Google", model: "Pixel 7a", desc: "Mid-range Pixel with flagship-level camera performance.", specs: { display: "6.1-inch OLED", processor: "Google Tensor G2", camera: "64MP Dual Camera", battery: "4385mAh", os: "Android 14" }, variants: [["8GB","128GB","Charcoal",43999,6],["8GB","128GB","Sea",43999,6]] },
    { brand: "Motorola", model: "Motorola Edge 40", desc: "Sleek design with a curved pOLED display.", specs: { display: "6.55-inch Curved pOLED", processor: "MediaTek Dimensity 8020", camera: "50MP OIS Camera", battery: "4400mAh", os: "Android 13" }, variants: [["8GB","256GB","Eclipse Black",29999,10],["8GB","256GB","Nebula Green",29999,10]] },
    { brand: "Motorola", model: "Moto G84", desc: "Curved pOLED display in a budget package.", specs: { display: "6.55-inch Curved pOLED", processor: "Snapdragon 695", camera: "50MP OIS Camera", battery: "5000mAh", os: "Android 13" }, variants: [["8GB","128GB","Marshmallow Blue",17999,8],["12GB","256GB","Viva Magenta",19999,8]] },
    { brand: "Nothing", model: "Nothing Phone (2)", desc: "Distinctive transparent design with the Glyph Interface.", specs: { display: "6.7-inch LTPO OLED", processor: "Snapdragon 8+ Gen 1", camera: "50MP Dual Camera", battery: "4700mAh", os: "Nothing OS 2.5" }, variants: [["8GB","128GB","White",44999,5],["12GB","256GB","Dark Gray",49999,5]] },
    { brand: "Nothing", model: "Nothing Phone (2a)", desc: "Budget-friendly Nothing phone with Glyph lights.", specs: { display: "6.7-inch AMOLED", processor: "MediaTek Dimensity 7200 Pro", camera: "50MP Dual Camera", battery: "5000mAh", os: "Nothing OS 2.5" }, variants: [["8GB","128GB","Milk",23999,7],["12GB","256GB","Black",26999,7]] },
    { brand: "iQOO", model: "iQOO 12", desc: "Performance flagship with a gaming-tuned chipset.", specs: { display: "6.78-inch LTPO AMOLED", processor: "Snapdragon 8 Gen 3", camera: "50MP OIS Camera", battery: "5000mAh", os: "FunTouch OS 14" }, variants: [["12GB","256GB","Legend",59999,6],["16GB","512GB","Alpha",64999,6]] },
    { brand: "iQOO", model: "iQOO Neo 9", desc: "Value-flagship focused on gaming performance.", specs: { display: "6.78-inch AMOLED", processor: "Snapdragon 8 Gen 2", camera: "50MP OIS Camera", battery: "5160mAh", os: "FunTouch OS 14" }, variants: [["8GB","128GB","Fiery Red",34999,7],["12GB","256GB","Frost Blue",38999,7]] },
    { brand: "iQOO", model: "iQOO Z9", desc: "Mid-range phone with slim bezels and fast charging.", specs: { display: "6.67-inch Curved AMOLED", processor: "MediaTek Dimensity 7200", camera: "50MP OIS Camera", battery: "5000mAh", os: "FunTouch OS 14" }, variants: [["8GB","128GB","Nova",19999,9],["8GB","256GB","Onyx Green",21999,9]] },
    { brand: "Asus", model: "ROG Phone 8", desc: "Gaming flagship with AirTrigger controls and top-tier cooling.", specs: { display: "6.78-inch LTPO AMOLED 165Hz", processor: "Snapdragon 8 Gen 3", camera: "50MP Triple Camera", battery: "5500mAh", os: "Android 14" }, variants: [["12GB","256GB","Phantom Black",89999,4],["16GB","512GB","Storm White",99999,4]] },
    { brand: "Infinix", model: "Infinix Zero 30", desc: "Feature-rich mid-ranger with a curved display.", specs: { display: "6.78-inch Curved AMOLED", processor: "MediaTek Helio G99", camera: "108MP OIS Camera", battery: "5000mAh", os: "XOS 13" }, variants: [["8GB","256GB","Rome Green",21999,10],["8GB","256GB","Sunset Gold",21999,10]] },
    { brand: "Tecno", model: "Tecno Camon 20", desc: "Camera-centric phone with a lightweight design.", specs: { display: "6.67-inch AMOLED", processor: "MediaTek Helio G99", camera: "64MP OIS Camera", battery: "5000mAh", os: "HiOS 13" }, variants: [["8GB","128GB","Serenity Blue",16999,10],["8GB","256GB","Predawn Black",18999,10]] },
    { brand: "Lava", model: "Lava Blaze 2", desc: "Affordable Indian-made phone with a clean UI.", specs: { display: "6.5-inch HD+ IPS", processor: "MediaTek Helio G85", camera: "50MP Dual Camera", battery: "5000mAh", os: "Android 13" }, variants: [["4GB","64GB","Glass Blue",8999,6],["4GB","128GB","Glass Green",9999,6]] },
    { brand: "Honor", model: "Honor 90", desc: "Slim design with a 200MP main camera sensor.", specs: { display: "6.7-inch Curved AMOLED", processor: "Snapdragon 7 Gen 1", camera: "200MP OIS Camera", battery: "5000mAh", os: "MagicOS 7.1" }, variants: [["8GB","256GB","Emerald Green",29999,9],["12GB","512GB","Midnight Black",33999,9]] },
    { brand: "Sony", model: "Xperia 10 V", desc: "Compact phone with a 21:9 cinematic display.", specs: { display: "6.1-inch Full HD+ OLED", processor: "Snapdragon 695", camera: "48MP Triple Camera", battery: "5000mAh", os: "Android 13" }, variants: [["6GB","128GB","Lavender",34999,5],["6GB","128GB","Black",34999,5]] }
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
            `Category ${CATEGORY_ID} not found. Set CATEGORY_ID to a real, active category with a 'sku' field.`
        );
    }

    let productCount = 0;
    let variantCount = 0;

    for (const mobile of mobiles) {

        const name = `${mobile.brand} ${mobile.model}`;

        try {

            // 1. Create the product (goes through your real service, so
            //    slug/sku generation and duplicate checks all run normally)
            const product = await createProduct({
                categoryId: CATEGORY_ID,
                name,
                description: mobile.desc,
                brand: mobile.brand,
                specification: mobile.specs
            });

            productCount++;

            // 2. Upload 1-2 product-level images via the real cloudinary path
            await addProductImages(product._id, pickImages(2));

            // 3. Create each variant
            for (const [ram, storage, color, price, discountPercentage] of mobile.variants) {

                const primarySpecification = { name: "RAM", value: ram };
                const secondarySpecification = { name: "Storage", value: storage };

                const images = pickImages(1);

                // Upload variant images the same way addProductImages does,
                // then pass the resulting {url, publicId} objects straight
                // into createProductVariant (which stores them as-is).
                const { uploadImage } = require("../services/cloudinaryService"); // adjust path
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
                    attributes: { network: "5G", warranty: "1 Year" },
                    images: uploadedVariantImages
                });

                variantCount++;
            }

            console.log(`Seeded: ${name} (${mobile.variants.length} variants)`);

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
