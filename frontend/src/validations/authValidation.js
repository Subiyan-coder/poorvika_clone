import { z } from "zod";


/* Common fields */

export const nameSchema = z
    .string()
    .trim()
    .min(
        2,
        "Name must be at least 2 characters"
    )
    .max(
        100,
        "Name cannot exceed 100 characters"
    );


export const emailSchema = z
    .string()
    .trim()
    .email(
        "Enter a valid email address"
    );


export const phoneSchema = z
    .string()
    .trim()
    .regex(
        /^[6-9]\d{9}$/,
        "Enter a valid 10-digit phone number"
    );


export const passwordSchema = z
    .string()
    .min(
        8,
        "Password must be at least 8 characters"
    )
    .max(
        128,
        "Password cannot exceed 128 characters"
    )
    .regex(
        /[A-Z]/,
        "Password must contain an uppercase letter"
    )
    .regex(
        /[a-z]/,
        "Password must contain a lowercase letter"
    )
    .regex(
        /\d/,
        "Password must contain a number"
    );

/* Login */

export const loginSchema = z.object({

    identifier: z
        .string()
        .trim()
        .min(
            1,
            "Email or phone number is required"
        ),

    password: z
        .string()
        .min(
            1,
            "Password is required"
        )

});


/* Register */

export const registerSchema = z
    .object({

        name: nameSchema,

        email: emailSchema,

        phone: phoneSchema,

        password: passwordSchema,

        confirmPassword: z
            .string()
            .min(
                1,
                "Please confirm your password"
            )

    })
    .refine(
        data =>
            data.password ===
            data.confirmPassword,
        {
            message:
                "Passwords do not match",
            path: ["confirmPassword"]
        }
    );

    
export const registrationOtpRequestSchema = z.object({

    identifier: z
        .string()
        .trim()
        .min(
            1,
            "Email or phone number is required"
        )

});


/* Change Password */

export const changePasswordSchema = z
    .object({

        currentPassword: z
            .string()
            .min(
                1,
                "Current password is required"
            ),

        newPassword: passwordSchema,

        confirmPassword: z
            .string()
            .min(
                1,
                "Please confirm your password"
            )

    })
    .refine(
        data =>
            data.newPassword ===
            data.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"]
        }
    );


    
export const otpSchema = z.object({

    otp: z
        .string()
        .regex(
            /^\d{6}$/,
            "OTP must be exactly 6 digits"
        )

});