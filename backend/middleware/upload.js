const multer = require("multer");

const storage = multer.memoryStorage();

const imageFileFilter = (allowedTypes = []) => {

    return (req, file, cb) => {

        if (!file.mimetype.startsWith("image/")) {
            return cb(
                new Error("Only image files are allowed"),
                false
            );
        }

        if (
            allowedTypes.length > 0 &&
            !allowedTypes.includes(file.mimetype)
        ) {
            return cb(
                new Error("This image format is not allowed"),
                false
            );
        }

        cb(null, true);
    };
};


const upload = multer({
    storage,

    fileFilter: imageFileFilter(),

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


const profileImageUpload = multer({
    storage,

    fileFilter: imageFileFilter([
        "image/jpeg",
        "image/png",
        "image/webp"
    ]),

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


const reviewImageUpload = multer({
    storage,

    fileFilter: imageFileFilter([
        "image/jpeg",
        "image/png",
        "image/webp"
    ]),

    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 5
    }
});



module.exports = {
    upload,
    profileImageUpload,
    reviewImageUpload
};