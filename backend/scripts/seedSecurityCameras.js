/**
 * seedSecurityCameras.js
 *
 * Seeds 50 security camera products (with variants) into the DB by calling
 * the ACTUAL createProduct / addProductImages / createProductVariant
 * functions from your codebase — not direct Model.create() calls.
 *
 * Product images: 3 per product. Variant images: 2 per variant.
 * Every variant pair differs in at least resolution (and often
 * connectivity/color too) to avoid duplicate-SKU collisions.
 *
 * ------------------------------------------------------------------
 * BEFORE RUNNING:
 * 1. Make sure backend/seed-data/securitycamera/image1.jpg ... image30.jpg exist.
 * 2. Make sure MONGO_URI and Cloudinary env vars are loaded via ../.env.
 * Run with: node seed-data/seedSecurityCameras.js
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

const CATEGORY_ID = "6aabb6b61ff4257d8818b2b8"; // Security Camera
const IMAGE_DIR = path.join(
    __dirname,
    "..",
    "seed-data",
    "securitycamera"
); // backend/seed-data/securitycamera
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
// 50 security camera definitions
// Each has 2 variant configs: [resolution, connectivity, color, price, discount]
// Variants within a product always differ on at least one field to avoid
// duplicate SKUs (SKU is derived from product.sku + color + primary + secondary).
// ---------------------------------------------------------------

const securityCameras = [
    { brand: "CP Plus", model: "Dome Camera 2MP", desc: "Indoor dome camera with clear night vision for homes and offices.", specs: { type: "Dome", nightVision: "20m IR", storage: "microSD, up to 256GB", powerSource: "DC 12V" }, variants: [["2MP (1080p)","Wired","White",1799,10],["4MP (2K)","Wired","White",2299,10]] },
    { brand: "CP Plus", model: "Bullet Camera 5MP", desc: "Outdoor weatherproof bullet camera with long-range night vision.", specs: { type: "Bullet", nightVision: "40m IR", storage: "microSD, up to 256GB", powerSource: "DC 12V" }, variants: [["5MP","Wired","White",2999,10],["5MP","PoE","Grey",3499,10]] },
    { brand: "CP Plus", model: "PTZ Camera 4MP", desc: "Pan-tilt-zoom camera for wide outdoor coverage.", specs: { type: "PTZ", nightVision: "50m IR", storage: "microSD, up to 256GB", powerSource: "DC 24V" }, variants: [["4MP (2K)","Wired","White",7999,8],["4MP (2K)","PoE","White",8999,8]] },
    { brand: "Hikvision", model: "DS-2CE Dome 2MP", desc: "Reliable analog dome camera for basic indoor surveillance.", specs: { type: "Dome", nightVision: "20m IR", storage: "DVR-based", powerSource: "DC 12V" }, variants: [["2MP (1080p)","Wired","White",1999,6],["2MP (1080p)","Wired","Black",1999,6]] },
    { brand: "Hikvision", model: "ColorVu Bullet 4MP", desc: "Full-color night vision bullet camera for outdoor use.", specs: { type: "Bullet", nightVision: "Full-color 30m", storage: "microSD, up to 256GB", powerSource: "PoE / DC 12V" }, variants: [["4MP (2K)","PoE","White",4499,8],["6MP","PoE","White",5499,8]] },
    { brand: "Hikvision", model: "Mini PTZ 2MP", desc: "Compact indoor pan-tilt camera with auto-tracking.", specs: { type: "PTZ", nightVision: "10m IR", storage: "microSD, up to 128GB", powerSource: "DC 5V" }, variants: [["2MP (1080p)","Wi-Fi","White",3299,7],["4MP (2K)","Wi-Fi","White",3999,7]] },
    { brand: "Dahua", model: "Dome Camera 4MP", desc: "Vandal-resistant dome camera for commercial spaces.", specs: { type: "Dome", nightVision: "30m IR", storage: "microSD, up to 256GB", powerSource: "PoE / DC 12V" }, variants: [["4MP (2K)","PoE","White",3299,9],["4MP (2K)","Wired","White",2999,9]] },
    { brand: "Dahua", model: "Bullet Camera 6MP", desc: "High-resolution bullet camera built for outdoor perimeters.", specs: { type: "Bullet", nightVision: "50m IR", storage: "microSD, up to 256GB", powerSource: "PoE / DC 12V" }, variants: [["6MP","PoE","White",4999,8],["8MP (4K)","PoE","White",6499,8]] },
    { brand: "Dahua", model: "Starlight Dome 2MP", desc: "Low-light optimized dome camera for dim environments.", specs: { type: "Dome", nightVision: "Starlight, 30m", storage: "microSD, up to 256GB", powerSource: "PoE / DC 12V" }, variants: [["2MP (1080p)","PoE","White",2799,9],["2MP (1080p)","Wired","Black",2599,9]] },
    { brand: "TP-Link", model: "Tapo C110", desc: "Affordable Wi-Fi indoor camera with motion alerts.", specs: { type: "Indoor", nightVision: "30ft IR", storage: "microSD, up to 512GB", powerSource: "USB" }, variants: [["3MP (2K)","Wi-Fi","White",1899,12],["3MP (2K)","Wi-Fi","Black",1899,12]] },
    { brand: "TP-Link", model: "Tapo C210 Pan/Tilt", desc: "Indoor Wi-Fi camera with 360-degree pan and tilt coverage.", specs: { type: "Pan/Tilt", nightVision: "30ft IR", storage: "microSD, up to 512GB", powerSource: "USB" }, variants: [["3MP (2K)","Wi-Fi","White",2599,10],["4MP (2K+)","Wi-Fi","White",3099,10]] },
    { brand: "TP-Link", model: "Tapo C420 Outdoor", desc: "Weatherproof outdoor Wi-Fi camera with color night vision.", specs: { type: "Outdoor", nightVision: "Full-color 30ft", storage: "microSD, up to 512GB", powerSource: "DC 12V" }, variants: [["4MP (2K+)","Wi-Fi","White",4499,9],["4MP (2K+)","Wi-Fi","Black",4499,9]] },
    { brand: "Ezviz", model: "C6N Pan/Tilt", desc: "Indoor smart camera with human detection and pan/tilt.", specs: { type: "Pan/Tilt", nightVision: "30ft IR", storage: "microSD, up to 256GB", powerSource: "USB" }, variants: [["2MP (1080p)","Wi-Fi","White",2199,10],["4MP (2K)","Wi-Fi","White",2799,10]] },
    { brand: "Ezviz", model: "C3W Outdoor", desc: "Outdoor camera with spotlight and siren deterrent.", specs: { type: "Outdoor", nightVision: "Full-color spotlight", storage: "microSD, up to 256GB", powerSource: "DC 12V" }, variants: [["2MP (1080p)","Wi-Fi","White",3499,8],["2MP (1080p)","Wi-Fi","Black",3499,8]] },
    { brand: "Ezviz", model: "H8 Pro", desc: "Outdoor pan/tilt camera with 355-degree coverage.", specs: { type: "Pan/Tilt", nightVision: "Full-color 15m", storage: "microSD, up to 256GB", powerSource: "DC 12V" }, variants: [["4MP (2K)","Wi-Fi","White",4999,9],["4MP (2K)","Wi-Fi","Black",4999,9]] },
    { brand: "Xiaomi", model: "Mi 360 Home Security Camera 2K", desc: "Popular indoor smart camera with AI motion tracking.", specs: { type: "Indoor", nightVision: "9m IR", storage: "microSD, up to 32GB", powerSource: "USB" }, variants: [["3MP (2K)","Wi-Fi","White",2999,11],["2MP (1080p)","Wi-Fi","White",2299,11]] },
    { brand: "Xiaomi", model: "Mi Outdoor Camera CW300", desc: "Weatherproof outdoor camera with dual-band Wi-Fi.", specs: { type: "Outdoor", nightVision: "30m IR", storage: "microSD, up to 32GB", powerSource: "DC 12V" }, variants: [["3MP (2K)","Wi-Fi","White",3999,9],["3MP (2K)","Wi-Fi","Black",3999,9]] },
    { brand: "Ring", model: "Indoor Cam", desc: "Compact plug-in indoor security camera with two-way talk.", specs: { type: "Indoor", nightVision: "IR Night Vision", storage: "Cloud (subscription)", powerSource: "USB" }, variants: [["2MP (1080p)","Wi-Fi","White",4999,5],["2MP (1080p)","Wi-Fi","Black",4999,5]] },
    { brand: "Ring", model: "Stick Up Cam", desc: "Versatile battery or wired camera for indoor or outdoor use.", specs: { type: "Indoor/Outdoor", nightVision: "IR Night Vision", storage: "Cloud (subscription)", powerSource: "Battery / Wired" }, variants: [["2MP (1080p)","Wi-Fi","White",7999,6],["2MP (1080p)","Battery","Black",7999,6]] },
    { brand: "Ring", model: "Spotlight Cam", desc: "Outdoor camera with built-in spotlight and siren.", specs: { type: "Outdoor", nightVision: "Full-color spotlight", storage: "Cloud (subscription)", powerSource: "Battery / Wired" }, variants: [["2MP (1080p)","Wi-Fi","White",11999,6],["2MP (1080p)","Battery","Black",11999,6]] },
    { brand: "Arlo", model: "Pro 5", desc: "Wire-free outdoor camera with 2K HDR and color night vision.", specs: { type: "Outdoor", nightVision: "Full-color", storage: "Cloud (subscription)", powerSource: "Battery" }, variants: [["4MP (2K)","Wi-Fi","White",15999,7],["4MP (2K)","Wi-Fi","Black",15999,7]] },
    { brand: "Arlo", model: "Essential Spotlight", desc: "Compact wire-free camera with built-in spotlight.", specs: { type: "Outdoor", nightVision: "Full-color spotlight", storage: "Cloud (subscription)", powerSource: "Battery" }, variants: [["2MP (1080p)","Wi-Fi","White",10999,7],["2MP (1080p)","Wi-Fi","Black",10999,7]] },
    { brand: "Arlo", model: "Ultra 2", desc: "Premium 4K camera with auto-zoom and tracking.", specs: { type: "Outdoor", nightVision: "Full-color", storage: "Cloud (subscription)", powerSource: "Battery" }, variants: [["8MP (4K)","Wi-Fi","White",22999,5],["8MP (4K)","Wi-Fi","Black",22999,5]] },
    { brand: "Reolink", model: "Argus 4", desc: "Battery-powered wire-free camera with spotlight and siren.", specs: { type: "Outdoor", nightVision: "Full-color spotlight", storage: "microSD, up to 256GB", powerSource: "Battery / Solar" }, variants: [["4MP (2K+)","Wi-Fi","White",7999,8],["4MP (2K+)","4G LTE","White",9999,8]] },
    { brand: "Reolink", model: "E1 Pro", desc: "Indoor pan/tilt camera with wide 355-degree horizontal view.", specs: { type: "Pan/Tilt", nightVision: "10m IR", storage: "microSD, up to 256GB", powerSource: "USB" }, variants: [["4MP (2K+)","Wi-Fi","White",3799,10],["4MP (2K+)","Wi-Fi","Black",3799,10]] },
    { brand: "Reolink", model: "RLC-810A", desc: "PoE outdoor camera with person/vehicle detection.", specs: { type: "Outdoor", nightVision: "30m IR", storage: "microSD, up to 256GB", powerSource: "PoE" }, variants: [["8MP (4K)","PoE","White",6999,9],["4MP (2K+)","PoE","White",5499,9]] },
    { brand: "Nest", model: "Cam (Battery)", desc: "Wire-free outdoor/indoor camera with intelligent alerts.", specs: { type: "Outdoor/Indoor", nightVision: "IR Night Vision", storage: "Cloud (subscription)", powerSource: "Battery" }, variants: [["2MP (1080p)","Wi-Fi","White",12999,4],["2MP (1080p)","Wi-Fi","Black",12999,4]] },
    { brand: "Nest", model: "Cam with Floodlight", desc: "Outdoor camera with bright floodlight and package detection.", specs: { type: "Outdoor", nightVision: "Full-color floodlight", storage: "Cloud (subscription)", powerSource: "Wired" }, variants: [["2MP (1080p)","Wi-Fi","White",19999,4],["2MP (1080p)","Wi-Fi","Black",19999,4]] },
    { brand: "Wyze", model: "Cam v4", desc: "Budget-friendly indoor/outdoor camera with color night vision.", specs: { type: "Indoor/Outdoor", nightVision: "Full-color", storage: "microSD, up to 256GB", powerSource: "USB" }, variants: [["3MP (2K)","Wi-Fi","White",2499,11],["3MP (2K)","Wi-Fi","Black",2499,11]] },
    { brand: "Wyze", model: "Cam Outdoor", desc: "Wire-free battery camera for outdoor monitoring.", specs: { type: "Outdoor", nightVision: "IR Night Vision", storage: "microSD, up to 256GB", powerSource: "Battery" }, variants: [["2MP (1080p)","Wi-Fi","White",3999,10],["2MP (1080p)","Wi-Fi","Black",3999,10]] },
    { brand: "D-Link", model: "Full HD Wi-Fi Camera", desc: "Simple indoor Wi-Fi camera with motion and sound detection.", specs: { type: "Indoor", nightVision: "5m IR", storage: "microSD, up to 128GB", powerSource: "USB" }, variants: [["2MP (1080p)","Wi-Fi","White",2999,9],["2MP (1080p)","Wi-Fi","Black",2999,9]] },
    { brand: "D-Link", model: "Pan & Tilt Camera", desc: "Indoor camera with remote pan and tilt control.", specs: { type: "Pan/Tilt", nightVision: "7.5m IR", storage: "microSD, up to 128GB", powerSource: "USB" }, variants: [["2MP (1080p)","Wi-Fi","White",3499,9],["4MP (2K)","Wi-Fi","White",4299,9]] },
    { brand: "Godrej", model: "Eagle Eye Dome", desc: "Indoor dome camera built for Indian homes with app monitoring.", specs: { type: "Dome", nightVision: "10m IR", storage: "microSD, up to 128GB", powerSource: "DC 12V" }, variants: [["2MP (1080p)","Wi-Fi","White",3299,8],["2MP (1080p)","Wired","White",2799,8]] },
    { brand: "Godrej", model: "Vault IP Camera", desc: "Outdoor IP camera with two-way audio and mobile alerts.", specs: { type: "Outdoor", nightVision: "20m IR", storage: "microSD, up to 128GB", powerSource: "DC 12V" }, variants: [["4MP (2K)","Wi-Fi","White",4599,8],["4MP (2K)","Wired","White",3999,8]] },
    { brand: "Zicom", model: "Smart Home Camera", desc: "Entry-level Wi-Fi camera for basic home monitoring.", specs: { type: "Indoor", nightVision: "8m IR", storage: "microSD, up to 64GB", powerSource: "USB" }, variants: [["1MP (720p)","Wi-Fi","White",1599,10],["2MP (1080p)","Wi-Fi","White",1999,10]] },
    { brand: "Qubo", model: "Smart Cam 360", desc: "360-degree indoor camera with two-way talk and SD storage.", specs: { type: "Pan/Tilt", nightVision: "10m IR", storage: "microSD, up to 128GB", powerSource: "USB" }, variants: [["3MP (2K)","Wi-Fi","White",2799,10],["3MP (2K)","Wi-Fi","Black",2799,10]] },
    { brand: "Qubo", model: "Smart Wi-Fi Camera", desc: "Compact fixed indoor camera with motion alerts.", specs: { type: "Indoor", nightVision: "8m IR", storage: "microSD, up to 128GB", powerSource: "USB" }, variants: [["2MP (1080p)","Wi-Fi","White",1899,11],["2MP (1080p)","Wi-Fi","Black",1899,11]] },
    { brand: "Imou", model: "Ranger 2", desc: "Indoor pan/tilt camera with human detection and privacy mode.", specs: { type: "Pan/Tilt", nightVision: "10m IR", storage: "microSD, up to 256GB", powerSource: "USB" }, variants: [["2MP (1080p)","Wi-Fi","White",2299,10],["4MP (2K)","Wi-Fi","White",2999,10]] },
    { brand: "Imou", model: "Cruiser", desc: "Outdoor pan/tilt camera with active deterrence.", specs: { type: "Outdoor", nightVision: "Full-color spotlight", storage: "microSD, up to 256GB", powerSource: "DC 12V" }, variants: [["4MP (2K)","Wi-Fi","White",4999,9],["4MP (2K)","Wi-Fi","Black",4999,9]] },
    { brand: "Imou", model: "Cell Pro", desc: "Battery-powered outdoor camera with solar panel support.", specs: { type: "Outdoor", nightVision: "Full-color", storage: "microSD, up to 256GB", powerSource: "Battery / Solar" }, variants: [["4MP (2K)","Wi-Fi","White",6499,8],["4MP (2K)","4G LTE","White",7999,8]] },
    { brand: "Swann", model: "Enforcer Bullet", desc: "Outdoor bullet camera with built-in strobe and siren.", specs: { type: "Bullet", nightVision: "30m IR", storage: "DVR/NVR-based", powerSource: "DC 12V" }, variants: [["4MP (2K)","Wired","White",5999,7],["4MP (2K)","Wired","Black",5999,7]] },
    { brand: "Swann", model: "4K Dome", desc: "High-resolution dome camera for detailed outdoor footage.", specs: { type: "Dome", nightVision: "30m IR", storage: "DVR/NVR-based", powerSource: "DC 12V" }, variants: [["8MP (4K)","Wired","White",8999,6],["4MP (2K)","Wired","White",6999,6]] },
    { brand: "Amcrest", model: "UltraHD 4K", desc: "PoE outdoor camera with AI-based smart detection.", specs: { type: "Bullet", nightVision: "30m IR", storage: "microSD, up to 256GB", powerSource: "PoE" }, variants: [["8MP (4K)","PoE","White",7499,8],["8MP (4K)","PoE","Black",7499,8]] },
    { brand: "Amcrest", model: "ProHD Outdoor", desc: "Weatherproof Wi-Fi camera with two-way audio.", specs: { type: "Outdoor", nightVision: "20m IR", storage: "microSD, up to 128GB", powerSource: "DC 12V" }, variants: [["2MP (1080p)","Wi-Fi","White",3999,9],["2MP (1080p)","Wi-Fi","Black",3999,9]] },
    { brand: "Uniview", model: "Mini Bullet", desc: "Compact PoE bullet camera for small business use.", specs: { type: "Bullet", nightVision: "30m IR", storage: "microSD, up to 256GB", powerSource: "PoE" }, variants: [["2MP (1080p)","PoE","White",2699,9],["4MP (2K)","PoE","White",3399,9]] },
    { brand: "Uniview", model: "Dome IP Camera", desc: "Indoor/outdoor dome camera with wide dynamic range.", specs: { type: "Dome", nightVision: "30m IR", storage: "microSD, up to 256GB", powerSource: "PoE" }, variants: [["4MP (2K)","PoE","White",3799,9],["4MP (2K)","Wired","White",3299,9]] },
    { brand: "Panasonic", model: "Smart Indoor Camera", desc: "Indoor camera with smart home integration and voice alerts.", specs: { type: "Indoor", nightVision: "8m IR", storage: "microSD, up to 128GB", powerSource: "USB" }, variants: [["2MP (1080p)","Wi-Fi","White",3299,7],["2MP (1080p)","Wi-Fi","Black",3299,7]] },
    { brand: "CP Plus", model: "Video Doorbell", desc: "Smart video doorbell with two-way talk and motion alerts.", specs: { type: "Doorbell", nightVision: "5m IR", storage: "microSD, up to 128GB", powerSource: "Battery / Wired" }, variants: [["2MP (1080p)","Wi-Fi","White",4999,7],["2MP (1080p)","Wi-Fi","Black",4999,7]] },
    { brand: "Ezviz", model: "Video Doorbell DB2", desc: "Wire-free video doorbell with pre-installed battery.", specs: { type: "Doorbell", nightVision: "5m IR", storage: "Cloud + microSD", powerSource: "Battery" }, variants: [["2MP (1080p)","Wi-Fi","White",5999,6],["2MP (1080p)","Wi-Fi","Black",5999,6]] },
    { brand: "TP-Link", model: "Tapo Video Doorbell D230", desc: "2K video doorbell with chime and local storage support.", specs: { type: "Doorbell", nightVision: "Full-color", storage: "microSD, up to 512GB", powerSource: "Battery / Wired" }, variants: [["3MP (2K)","Wi-Fi","White",6999,8],["3MP (2K)","Wi-Fi","Black",6999,8]] }
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

    for (const cam of securityCameras) {

        const name = `${cam.brand} ${cam.model}`;

        try {

            // 1. Create the product via the real service
            const product = await createProduct({
                categoryId: CATEGORY_ID,
                name,
                description: cam.desc,
                brand: cam.brand,
                specification: cam.specs
            });

            productCount++;

            // 2. Upload 3 product-level images via the real cloudinary path
            await addProductImages(product._id, pickImages(3));

            // 3. Create each variant (2 images per variant)
            const seenVariantKeys = new Set();

            for (const [resolution, connectivity, color, price, discountPercentage] of cam.variants) {

                const variantKey = `${color}|${resolution}|${connectivity}`.toUpperCase();

                if (seenVariantKeys.has(variantKey)) {
                    console.warn(`  Skipping duplicate variant for ${name}: ${variantKey}`);
                    continue;
                }
                seenVariantKeys.add(variantKey);

                const primarySpecification = { name: "Resolution", value: resolution };
                const secondarySpecification = { name: "Connectivity", value: connectivity };

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
                    attributes: { warranty: "1 Year" },
                    images: uploadedVariantImages
                });

                variantCount++;
            }

            console.log(`Seeded: ${name} (${cam.variants.length} variants)`);

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
