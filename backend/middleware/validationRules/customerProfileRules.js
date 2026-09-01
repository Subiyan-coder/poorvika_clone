const { body } = require("express-validator");

const updateProfileRules = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters")
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage("Name must not contain special characters or numbers"),

    body().custom((value) => {
        if (Object.keys(value).length === 0) {
            throw new Error("At least one profile field is required");
        }

        return true;
    })
];

module.exports = {updateProfileRules};