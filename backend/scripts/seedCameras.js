/**
 * seedCameras.js
 *
 * Seeds 50 camera products (with variants) into the DB by calling
 * the ACTUAL createProduct / addProductImages / createProductVariant
 * functions from your codebase — not direct Model.create() calls.
 *
 * Same structure as seedMobiles.js — only the data array, image folder,
 * and category changed.
 *
 * ------------------------------------------------------------------
 * BEFORE RUNNING — fix these:
 * ------------------------------------------------------------------
 * 1. Update the require() paths below to match your project structure
 *    (same ones you fixed in seedMobiles.js).
 * 2. CATEGORY_ID is already set to your Camera category.
 * 3. Make sure MONGO_URI and Cloudinary env vars are loaded (dotenv).
 * 4. Make sure backend/seed-data/camera/image1.jpg ... image30.jpg exist.
 *
 * Run with: node seed-data/seedCameras.js
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

const CATEGORY_ID = "6aabb4b91ff4257d8818b2a7"; // Camera
const IMAGE_DIR = path.join(
    __dirname,
    "..",
    "seed-data",
    "camera"
); // backend/seed-data/camera
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
// 50 camera definitions
// Each has 2 variant configs: [megapixel, kit, color, price, discount]
// ---------------------------------------------------------------

const cameras = [
    { brand: "Canon", model: "EOS R5", desc: "Professional full-frame mirrorless camera with 8K video.", specs: { sensor: "45MP Full-Frame CMOS", processor: "DIGIC X", iso: "100-51200", viewfinder: "5.76M-dot EVF", video: "8K30 RAW", connectivity: "Wi-Fi, Bluetooth" }, variants: [["45MP","Body Only","Black",339999,3],["45MP","with 24-105mm Lens","Black",419999,3]] },
    { brand: "Canon", model: "EOS R6 Mark II", desc: "Versatile full-frame mirrorless built for speed and low light.", specs: { sensor: "24.2MP Full-Frame CMOS", processor: "DIGIC X", iso: "100-102400", viewfinder: "3.69M-dot EVF", video: "4K60", connectivity: "Wi-Fi, Bluetooth" }, variants: [["24.2MP","Body Only","Black",219999,4],["24.2MP","with 24-105mm Lens","Black",279999,4]] },
    { brand: "Canon", model: "EOS R50", desc: "Compact and beginner-friendly APS-C mirrorless camera.", specs: { sensor: "24.2MP APS-C CMOS", processor: "DIGIC X", iso: "100-32000", viewfinder: "2.36M-dot EVF", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["24.2MP","Body Only","Black",64999,6],["24.2MP","with 18-45mm Lens","White",74999,6]] },
    { brand: "Canon", model: "EOS R10", desc: "Fast-shooting APS-C mirrorless for action and everyday use.", specs: { sensor: "24.2MP APS-C CMOS", processor: "DIGIC X", iso: "100-32000", viewfinder: "2.36M-dot EVF", video: "4K60", connectivity: "Wi-Fi, Bluetooth" }, variants: [["24.2MP","Body Only","Black",79999,5],["24.2MP","with 18-150mm Lens","Black",109999,5]] },
    { brand: "Canon", model: "EOS 90D", desc: "DSLR with a high-resolution sensor and rugged build.", specs: { sensor: "32.5MP APS-C CMOS", processor: "DIGIC 8", iso: "100-25600", viewfinder: "Optical Pentaprism", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["32.5MP","Body Only","Black",99999,7],["32.5MP","with 18-135mm Lens","Black",129999,7]] },
    { brand: "Canon", model: "EOS 850D", desc: "Entry-level DSLR with vari-angle touchscreen.", specs: { sensor: "24.1MP APS-C CMOS", processor: "DIGIC 8", iso: "100-25600", viewfinder: "Optical Pentamirror", video: "4K25", connectivity: "Wi-Fi, Bluetooth" }, variants: [["24.1MP","Body Only","Black",64999,8],["24.1MP","with 18-55mm Lens","Black",74999,8]] },
    { brand: "Canon", model: "PowerShot G7X Mark III", desc: "Pocketable compact camera favored by vloggers.", specs: { sensor: "20.1MP 1-inch CMOS", processor: "DIGIC 8", iso: "125-12800", viewfinder: "None", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["20.1MP","Standard","Black",54999,5],["20.1MP","Standard","Silver",54999,5]] },
    { brand: "Canon", model: "PowerShot SX70 HS", desc: "Superzoom bridge camera with a 65x optical zoom lens.", specs: { sensor: "20.3MP 1/2.3-inch CMOS", processor: "DIGIC 8", iso: "100-3200", viewfinder: "2.36M-dot EVF", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["20.3MP","Standard","Black",44999,6],["20.3MP","Standard","Black",44999,6]] },
    { brand: "Canon", model: "EOS R8", desc: "Lightweight full-frame mirrorless with flagship-level AF.", specs: { sensor: "24.2MP Full-Frame CMOS", processor: "DIGIC X", iso: "100-102400", viewfinder: "2.36M-dot EVF", video: "4K60", connectivity: "Wi-Fi, Bluetooth" }, variants: [["24.2MP","Body Only","Black",159999,5],["24.2MP","with 24-50mm Lens","Black",179999,5]] },
    { brand: "Canon", model: "EOS 250D", desc: "Compact and lightweight DSLR for beginners.", specs: { sensor: "24.1MP APS-C CMOS", processor: "DIGIC 8", iso: "100-25600", viewfinder: "Optical Pentamirror", video: "4K25", connectivity: "Wi-Fi, Bluetooth" }, variants: [["24.1MP","Body Only","Black",54999,8],["24.1MP","with 18-55mm Lens","White",64999,8]] },
    { brand: "Nikon", model: "Z9", desc: "Flagship full-frame mirrorless built for professionals.", specs: { sensor: "45.7MP Full-Frame CMOS", processor: "Expeed 7", iso: "64-25600", viewfinder: "5.76M-dot EVF", video: "8K30", connectivity: "Wi-Fi, Bluetooth, Ethernet" }, variants: [["45.7MP","Body Only","Black",489999,2],["45.7MP","Body Only","Black",489999,2]] },
    { brand: "Nikon", model: "Z6 III", desc: "Hybrid full-frame mirrorless for stills and video.", specs: { sensor: "24.5MP Full-Frame Partially Stacked CMOS", processor: "Expeed 7", iso: "100-64000", viewfinder: "5.76M-dot EVF", video: "6K60 RAW", connectivity: "Wi-Fi, Bluetooth" }, variants: [["24.5MP","Body Only","Black",249999,4],["24.5MP","with 24-70mm Lens","Black",329999,4]] },
    { brand: "Nikon", model: "Z50", desc: "Compact APS-C mirrorless designed for travel.", specs: { sensor: "20.9MP APS-C CMOS", processor: "Expeed 6", iso: "100-51200", viewfinder: "2.36M-dot EVF", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["20.9MP","Body Only","Black",64999,7],["20.9MP","with 16-50mm Lens","Black",74999,7]] },
    { brand: "Nikon", model: "D780", desc: "Hybrid DSLR combining optical viewfinder with live-view AF.", specs: { sensor: "24.5MP Full-Frame CMOS", processor: "Expeed 6", iso: "100-51200", viewfinder: "Optical Pentaprism", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["24.5MP","Body Only","Black",184999,5],["24.5MP","with 24-120mm Lens","Black",249999,5]] },
    { brand: "Nikon", model: "D3500", desc: "Beginner-friendly DSLR with long battery life.", specs: { sensor: "24.2MP APS-C CMOS", processor: "Expeed 4", iso: "100-25600", viewfinder: "Optical Pentamirror", video: "1080p60", connectivity: "Bluetooth" }, variants: [["24.2MP","Body Only","Black",34999,9],["24.2MP","with 18-55mm Lens","Black",39999,9]] },
    { brand: "Nikon", model: "Coolpix P1000", desc: "Bridge camera with an extreme 125x optical zoom.", specs: { sensor: "16MP 1/2.3-inch CMOS", processor: "Expeed", iso: "100-6400", viewfinder: "2.36M-dot EVF", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["16MP","Standard","Black",84999,6],["16MP","Standard","Black",84999,6]] },
    { brand: "Nikon", model: "Zf", desc: "Retro-styled full-frame mirrorless with modern internals.", specs: { sensor: "24.5MP Full-Frame CMOS", processor: "Expeed 7", iso: "100-64000", viewfinder: "3.69M-dot EVF", video: "4K60", connectivity: "Wi-Fi, Bluetooth" }, variants: [["24.5MP","Body Only","Black",189999,4],["24.5MP","Body Only","Silver",189999,4]] },
    { brand: "Nikon", model: "Z fc", desc: "Retro-styled APS-C mirrorless with dial-based controls.", specs: { sensor: "20.9MP APS-C CMOS", processor: "Expeed 6", iso: "100-51200", viewfinder: "2.36M-dot EVF", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["20.9MP","Body Only","Silver",84999,6],["20.9MP","with 16-50mm Lens","Silver",99999,6]] },
    { brand: "Nikon", model: "D7500", desc: "Enthusiast-level APS-C DSLR with rugged build.", specs: { sensor: "20.9MP APS-C CMOS", processor: "Expeed 5", iso: "100-51200", viewfinder: "Optical Pentaprism", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["20.9MP","Body Only","Black",84999,7],["20.9MP","with 18-140mm Lens","Black",114999,7]] },
    { brand: "Nikon", model: "Z30", desc: "Vlogging-focused mirrorless with no viewfinder.", specs: { sensor: "20.9MP APS-C CMOS", processor: "Expeed 6", iso: "100-51200", viewfinder: "None", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["20.9MP","Body Only","Black",59999,8],["20.9MP","with 16-50mm Lens","Black",69999,8]] },
    { brand: "Sony", model: "Alpha 7 IV", desc: "All-rounder full-frame mirrorless for hybrid shooters.", specs: { sensor: "33MP Full-Frame CMOS", processor: "Bionz XR", iso: "100-51200", viewfinder: "3.68M-dot EVF", video: "4K60", connectivity: "Wi-Fi, Bluetooth" }, variants: [["33MP","Body Only","Black",219999,4],["33MP","with 28-70mm Lens","Black",259999,4]] },
    { brand: "Sony", model: "Alpha 7C II", desc: "Compact full-frame mirrorless with in-body stabilization.", specs: { sensor: "33MP Full-Frame CMOS", processor: "Bionz XR", iso: "100-51200", viewfinder: "2.36M-dot EVF", video: "4K60", connectivity: "Wi-Fi, Bluetooth" }, variants: [["33MP","Body Only","Black",199999,5],["33MP","Body Only","Silver",199999,5]] },
    { brand: "Sony", model: "Alpha 6400", desc: "Compact APS-C mirrorless with fast real-time tracking AF.", specs: { sensor: "24.2MP APS-C CMOS", processor: "Bionz X", iso: "100-32000", viewfinder: "2.36M-dot EVF", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["24.2MP","Body Only","Black",84999,6],["24.2MP","with 16-50mm Lens","Black",94999,6]] },
    { brand: "Sony", model: "ZV-E10", desc: "Interchangeable-lens camera built specifically for vlogging.", specs: { sensor: "24.2MP APS-C CMOS", processor: "Bionz X", iso: "100-32000", viewfinder: "None", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["24.2MP","Body Only","Black",64999,7],["24.2MP","with 16-50mm Lens","White",74999,7]] },
    { brand: "Sony", model: "RX100 VII", desc: "Premium pocket compact with a 24-200mm zoom lens.", specs: { sensor: "20.1MP 1-inch CMOS", processor: "Bionz X", iso: "100-12800", viewfinder: "2.36M-dot EVF", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["20.1MP","Standard","Black",124999,4],["20.1MP","Standard","Black",124999,4]] },
    { brand: "Sony", model: "Alpha 1", desc: "Flagship hybrid camera for speed, resolution, and video.", specs: { sensor: "50.1MP Full-Frame Stacked CMOS", processor: "Bionz XR", iso: "100-32000", viewfinder: "9.44M-dot EVF", video: "8K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["50.1MP","Body Only","Black",549999,2],["50.1MP","Body Only","Black",549999,2]] },
    { brand: "Sony", model: "Alpha 7R V", desc: "High-resolution full-frame mirrorless for landscape and studio.", specs: { sensor: "61MP Full-Frame CMOS", processor: "Bionz XR", iso: "100-32000", viewfinder: "9.44M-dot EVF", video: "8K24", connectivity: "Wi-Fi, Bluetooth" }, variants: [["61MP","Body Only","Black",329999,3],["61MP","with 24-105mm Lens","Black",409999,3]] },
    { brand: "Sony", model: "ZV-1 II", desc: "Compact vlogging camera with a wide-angle zoom lens.", specs: { sensor: "20.1MP 1-inch CMOS", processor: "Bionz X", iso: "100-12800", viewfinder: "None", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["20.1MP","Standard","Black",64999,6],["20.1MP","Standard","White",64999,6]] },
    { brand: "Sony", model: "Alpha 6700", desc: "Advanced APS-C mirrorless with AI-based subject recognition.", specs: { sensor: "26MP APS-C CMOS", processor: "Bionz XR", iso: "100-32000", viewfinder: "2.36M-dot EVF", video: "4K60", connectivity: "Wi-Fi, Bluetooth" }, variants: [["26MP","Body Only","Black",139999,5],["26MP","with 16-50mm Lens","Black",154999,5]] },
    { brand: "Sony", model: "FX30", desc: "Compact cinema camera for professional video work.", specs: { sensor: "26MP APS-C CMOS", processor: "Bionz XR", iso: "100-32000", viewfinder: "None", video: "4K120", connectivity: "Wi-Fi, Bluetooth" }, variants: [["26MP","Body Only","Black",164999,4],["26MP","Body Only","Black",164999,4]] },
    { brand: "Fujifilm", model: "X-T5", desc: "Retro-styled APS-C mirrorless with a high-resolution sensor.", specs: { sensor: "40.2MP APS-C X-Trans CMOS", processor: "X-Processor 5", iso: "125-12800", viewfinder: "3.69M-dot EVF", video: "6.2K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["40.2MP","Body Only","Black",164999,4],["40.2MP","with 18-55mm Lens","Silver",194999,4]] },
    { brand: "Fujifilm", model: "X-S20", desc: "Compact hybrid camera geared toward vlogging and stills.", specs: { sensor: "26.1MP APS-C X-Trans CMOS", processor: "X-Processor 5", iso: "125-12800", viewfinder: "2.36M-dot EVF", video: "6.2K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["26.1MP","Body Only","Black",134999,5],["26.1MP","with 18-55mm Lens","Black",164999,5]] },
    { brand: "Fujifilm", model: "X100V", desc: "Fixed-lens compact camera with classic rangefinder styling.", specs: { sensor: "26.1MP APS-C X-Trans CMOS", processor: "X-Processor 4", iso: "160-12800", viewfinder: "Hybrid OVF/EVF", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["26.1MP","Standard","Black",134999,3],["26.1MP","Standard","Silver",134999,3]] },
    { brand: "Fujifilm", model: "X-T30 II", desc: "Compact enthusiast camera with Fujifilm's film simulations.", specs: { sensor: "26.1MP APS-C X-Trans CMOS", processor: "X-Processor 4", iso: "160-12800", viewfinder: "2.36M-dot EVF", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["26.1MP","Body Only","Black",94999,6],["26.1MP","with 15-45mm Lens","Silver",109999,6]] },
    { brand: "Fujifilm", model: "GFX100S", desc: "Medium-format mirrorless camera in a compact body.", specs: { sensor: "102MP Medium-Format CMOS", processor: "X-Processor 4", iso: "100-12800", viewfinder: "3.69M-dot EVF", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["102MP","Body Only","Black",629999,2],["102MP","Body Only","Black",629999,2]] },
    { brand: "Fujifilm", model: "X-E4", desc: "Minimalist rangefinder-style APS-C mirrorless camera.", specs: { sensor: "26.1MP APS-C X-Trans CMOS", processor: "X-Processor 4", iso: "160-12800", viewfinder: "2.36M-dot EVF", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["26.1MP","Body Only","Black",89999,7],["26.1MP","with 27mm Lens","Silver",104999,7]] },
    { brand: "Panasonic", model: "Lumix S5 II", desc: "Full-frame hybrid mirrorless with phase-detect autofocus.", specs: { sensor: "24.2MP Full-Frame CMOS", processor: "L2 Engine", iso: "100-51200", viewfinder: "2.36M-dot EVF", video: "6K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["24.2MP","Body Only","Black",174999,5],["24.2MP","with 20-60mm Lens","Black",204999,5]] },
    { brand: "Panasonic", model: "Lumix GH6", desc: "Micro Four Thirds camera built for professional video.", specs: { sensor: "25.2MP Micro Four Thirds CMOS", processor: "Venus Engine", iso: "100-25600", viewfinder: "3.68M-dot EVF", video: "5.7K60", connectivity: "Wi-Fi, Bluetooth" }, variants: [["25.2MP","Body Only","Black",184999,4],["25.2MP","with 12-60mm Lens","Black",224999,4]] },
    { brand: "Panasonic", model: "Lumix G100", desc: "Lightweight vlogging camera with a built-in directional mic.", specs: { sensor: "20.3MP Micro Four Thirds CMOS", processor: "Venus Engine", iso: "200-25600", viewfinder: "2.36M-dot EVF", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["20.3MP","Body Only","Black",54999,7],["20.3MP","with 12-32mm Lens","Black",64999,7]] },
    { brand: "Panasonic", model: "Lumix FZ80", desc: "Superzoom bridge camera with a 60x optical zoom.", specs: { sensor: "18.1MP 1/2.3-inch CMOS", processor: "Venus Engine", iso: "80-3200", viewfinder: "0.2-inch EVF", video: "4K30", connectivity: "Wi-Fi" }, variants: [["18.1MP","Standard","Black",34999,8],["18.1MP","Standard","Black",34999,8]] },
    { brand: "OM System", model: "OM-1", desc: "Rugged Micro Four Thirds flagship built for outdoor use.", specs: { sensor: "20.4MP Micro Four Thirds Stacked CMOS", processor: "TruePic X", iso: "80-102400", viewfinder: "5.76M-dot EVF", video: "4K60", connectivity: "Wi-Fi, Bluetooth" }, variants: [["20.4MP","Body Only","Black",184999,5],["20.4MP","with 12-40mm Lens","Black",229999,5]] },
    { brand: "OM System", model: "OM-5", desc: "Weather-sealed compact mirrorless for travel and hiking.", specs: { sensor: "20.4MP Micro Four Thirds CMOS", processor: "TruePic IX", iso: "200-25600", viewfinder: "2.36M-dot EVF", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["20.4MP","Body Only","Black",99999,6],["20.4MP","with 12-45mm Lens","Silver",119999,6]] },
    { brand: "Olympus", model: "PEN E-P7", desc: "Stylish retro compact with in-body image stabilization.", specs: { sensor: "20.3MP Micro Four Thirds CMOS", processor: "TruePic VIII", iso: "200-25600", viewfinder: "None", video: "4K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["20.3MP","Body Only","Black",64999,7],["20.3MP","with 14-42mm Lens","Silver",74999,7]] },
    { brand: "Leica", model: "Q3", desc: "Premium full-frame compact with a fixed Summilux lens.", specs: { sensor: "60.3MP Full-Frame CMOS", processor: "Leica Maestro IV", iso: "50-100000", viewfinder: "5.76M-dot EVF", video: "8K30", connectivity: "Wi-Fi, Bluetooth" }, variants: [["60.3MP","Standard","Black",549999,1],["60.3MP","Standard","Black",549999,1]] },
    { brand: "Leica", model: "M11", desc: "Iconic full-frame rangefinder for manual-focus photography.", specs: { sensor: "60.3MP Full-Frame CMOS", processor: "Leica Maestro III", iso: "64-50000", viewfinder: "Optical Rangefinder", video: "None", connectivity: "Wi-Fi, Bluetooth" }, variants: [["60.3MP","Body Only","Black",729999,1],["60.3MP","Body Only","Silver",729999,1]] },
    { brand: "GoPro", model: "Hero 12 Black", desc: "Rugged waterproof action camera with HyperSmooth stabilization.", specs: { sensor: "27MP 1/1.9-inch CMOS", processor: "GP2", iso: "100-6400", viewfinder: "None", video: "5.3K60", connectivity: "Wi-Fi, Bluetooth", waterproof: "10m" }, variants: [["27MP","Standard","Black",39999,6],["27MP","Standard","Black",39999,6]] },
    { brand: "GoPro", model: "Hero 11 Black Mini", desc: "Compact, screen-free action camera for mounted shooting.", specs: { sensor: "27MP 1/1.9-inch CMOS", processor: "GP2", iso: "100-6400", viewfinder: "None", video: "5.3K60", connectivity: "Wi-Fi, Bluetooth", waterproof: "10m" }, variants: [["27MP","Standard","Black",32999,7],["27MP","Standard","Black",32999,7]] },
    { brand: "DJI", model: "Osmo Action 4", desc: "Rugged action camera with a large 1/1.3-inch sensor.", specs: { sensor: "1/1.3-inch CMOS", processor: "DJI Image Processor", iso: "100-6400", viewfinder: "None", video: "4K120", connectivity: "Wi-Fi, Bluetooth", waterproof: "18m" }, variants: [["12.7MP","Standard","Black",34999,7],["12.7MP","Standard","Black",34999,7]] },
    { brand: "DJI", model: "Osmo Pocket 3", desc: "Handheld gimbal camera with a rotatable touchscreen.", specs: { sensor: "1-inch CMOS", processor: "DJI Image Processor", iso: "100-6400", viewfinder: "None", video: "4K120", connectivity: "Wi-Fi, Bluetooth" }, variants: [["9.4MP","Standard","White",44999,5],["9.4MP","Standard","White",44999,5]] },
    { brand: "Ricoh", model: "GR III", desc: "Pocketable street photography camera with a 28mm lens.", specs: { sensor: "24.2MP APS-C CMOS", processor: "GR Engine 6", iso: "100-102400", viewfinder: "None", video: "1080p60", connectivity: "Wi-Fi, Bluetooth" }, variants: [["24.2MP","Standard","Black",94999,4],["24.2MP","Standard","Black",94999,4]] }
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

    for (const camera of cameras) {

        const name = `${camera.brand} ${camera.model}`;

        try {

            // 1. Create the product (goes through your real service, so
            //    slug/sku generation and duplicate checks all run normally)
            const product = await createProduct({
                categoryId: CATEGORY_ID,
                name,
                description: camera.desc,
                brand: camera.brand,
                specification: camera.specs
            });

            productCount++;

            // 2. Upload 1-2 product-level images via the real cloudinary path
            await addProductImages(product._id, pickImages(2));

            // 3. Create each variant
            for (const [megapixel, kit, color, price, discountPercentage] of camera.variants) {

                const primarySpecification = { name: "Megapixel", value: megapixel };
                const secondarySpecification = { name: "Kit", value: kit };

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
                    attributes: { warranty: "1 Year" },
                    images: uploadedVariantImages
                });

                variantCount++;
            }

            console.log(`Seeded: ${name} (${camera.variants.length} variants)`);

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
