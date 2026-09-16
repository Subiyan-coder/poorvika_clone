import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

import {
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    ChevronRight
} from "lucide-react";


import {
    getProfile,
    updateProfile,
    updateProfileImage
} from "../services/profileService";

import { toastSuccess } from "../utils/toast";


const Profile = () => {

    const { setUser } = useAuth();

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);

    const [profileImage, setProfileImage] =
        useState(null);

    const [profileImagePreview, setProfileImagePreview] = useState("");

    const [loading, setLoading] =
        useState(true);

    const [uploading, setUploading] =
        useState(false);

    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState("");
    const [savingName, setSavingName] = useState(false);


    // =========================
    // Load Profile
    // =========================

    useEffect(() => {

        const loadProfile = async () => {

            try {

                const response =
                    await getProfile();

                setProfile(
                    response.data
                );

                setName(
                    response.data.name || ""
                );

            }
            catch (error) {

                console.error(
                    "Profile loading failed:",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        };


        loadProfile();

    }, []);


    useEffect(() => {

    if (!profileImage) {

        setProfileImagePreview("");

        return;
    }

    const url =
        URL.createObjectURL(profileImage);

    setProfileImagePreview(url);

    return () => {
        URL.revokeObjectURL(url);
    };

}, [profileImage]);


    const handleSaveName = async () => {

        if (!name.trim()) {
            return;
        }

        try {

            setSavingName(true);

            const response = await updateProfile({
                name: name.trim()
            });

            setProfile(response.data);
            setEditingName(false);

            toastSuccess("Name updated successfully");

        }
        catch (error) {

            console.error(
                "Name update failed:",
                error
            );

        }
        finally {

            setSavingName(false);

        }
    };


    const handleProfileImageUpload = async () => {

        if (!profileImage) {
            return;
        }

        try {

            setUploading(true);

            const response =
                await updateProfileImage(profileImage);

            const updatedProfile =
                response.data || response;

            setProfile(previous => ({
                ...previous,
                profileImage: updatedProfile.profileImage
            }));

            setUser(previous => ({
                ...previous,
                profileImage: updatedProfile.profileImage
            }));

            setProfileImage(null);

            toastSuccess(
                "Profile picture updated successfully"
            );

        }
        catch (error) {

            console.error(
                "Profile image update failed:",
                error
            );

        }
        finally {

            setUploading(false);

        }
    };


    // =========================
    // Loading
    // =========================

    if (loading) {

        return (
            <div className="
                flex
                min-h-[60vh]
                items-center
                justify-center
            ">

                <p className="
                    text-sm
                    text-gray-500
                ">
                    Loading profile...
                </p>

            </div>
        );

    }


    // =========================
    // Error
    // =========================

    if (!profile) {

        return (
            <div className="
                flex
                min-h-[60vh]
                items-center
                justify-center
            ">

                <p className="
                    text-sm
                    text-red-500
                ">
                    Unable to load profile.
                </p>

            </div>
        );

    }


    // =========================
    // Profile Actions
    // =========================

    const profileActions = [

        {
            label: "Account",
            description:
                "Manage your email and phone number",
            icon: User,
            path: "account"
        },

        {
            label: "Addresses",
            description:
                "Manage your saved addresses",
            icon: MapPin,
            path: "address"
        },

        {
            label: "Change Password",
            description:
                "Update your account password",
            icon: Lock,
            path: "password"
        }

    ];


    return (
        <div className="
            mx-auto
            w-full
            max-w-5xl
            px-4
            py-8
            sm:px-6
            lg:px-8
        ">


            {/* =========================
                Header
            ========================= */}

            <div className="mb-8">

                <h1 className="
                    text-2xl
                    font-semibold
                    tracking-tight
                    text-gray-900
                ">
                    Profile
                </h1>

                <p className="
                    mt-1
                    text-sm
                    text-gray-500
                ">
                    Manage your account and personal
                    information.
                </p>

            </div>


            {/* =========================
                Profile Information
            ========================= */}

            <div className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
            ">

                <div className="
                    flex
                    flex-col
                    gap-8
                    sm:flex-row
                    sm:items-start
                ">


                    {/* Profile Image */}

                    <div className="w-full sm:w-48">

                        <p className="
                            mb-3
                            text-sm
                            font-medium
                            text-gray-700
                        ">
                            Profile picture
                        </p>


                        <div className="
                            flex
                            flex-col
                            items-center
                        ">

                            <div className="
                                flex
                                h-32
                                w-32
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-full
                                border
                                border-gray-200
                                bg-gray-100
                            ">

                                {profileImagePreview ||
                                profile?.profileImage?.url ? (

                                    <img
                                        src={
                                            profileImagePreview ||
                                            profile.profileImage.url
                                        }
                                        alt={profile.name || "Profile"}
                                        className="
                                            h-full
                                            w-full
                                            object-cover
                                        "
                                    />

                                ) : (

                                    <User
                                        size={52}
                                        strokeWidth={1.5}
                                        className="text-gray-400"
                                    />

                                )}

                            </div>


                            {/* Change image */}

                            {!profileImage && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        document
                                            .getElementById("profileImageInput")
                                            .click()
                                    }
                                    className="
                                        mt-4
                                        rounded-xl
                                        border
                                        border-gray-300
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        transition
                                        hover:bg-gray-50
                                    "
                                >
                                    Change image
                                </button>

                            )}


                            {/* File input */}

                            <input
                                id="profileImageInput"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(event) => {

                                    const file =
                                        event.target.files?.[0];

                                    if (file) {
                                        setProfileImage(file);
                                    }

                                    event.target.value = "";

                                }}
                            />


                            {/* Selected image actions */}

                            {profileImage && (

                                <div className="
                                    mt-4
                                    flex
                                    gap-2
                                ">

                                    <button
                                        type="button"
                                        onClick={handleProfileImageUpload}
                                        disabled={uploading}
                                        className="
                                            rounded-xl
                                            bg-gray-900
                                            px-4
                                            py-2
                                            text-sm
                                            font-medium
                                            text-white
                                            hover:bg-gray-800
                                            disabled:opacity-50
                                        "
                                    >
                                        {uploading
                                            ? "Uploading..."
                                            : "Upload image"
                                        }
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setProfileImage(null)
                                        }
                                        disabled={uploading}
                                        className="
                                            rounded-xl
                                            border
                                            border-gray-300
                                            px-4
                                            py-2
                                            text-sm
                                            font-medium
                                            text-gray-700
                                            hover:bg-gray-50
                                        "
                                    >
                                        Cancel
                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                    {/* Profile Details */}

                    <div className="
                        flex-1
                        space-y-6
                    ">


                        {/* Name */}

                        <div className="
                            flex
                            items-start
                            gap-3
                        ">

                            <User
                                size={19}
                                className="
                                    mt-0.5
                                    text-gray-500
                                "
                            />

                            <div className="flex-1">

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                ">

                                    <p className="
                                        text-xs
                                        text-gray-500
                                    ">
                                        Name
                                    </p>

                                    {!editingName && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setName(profile.name || "");
                                                setEditingName(true);
                                            }}
                                            className="
                                                text-xs
                                                font-medium
                                                text-gray-700
                                                hover:text-gray-900
                                                hover:underline
                                            "
                                        >
                                            Edit
                                        </button>
                                    )}

                                </div>

                                {editingName ? (

                                    <div className="
                                        mt-2
                                        flex
                                        flex-col
                                        gap-2
                                        sm:flex-row
                                    ">

                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(event) =>
                                                setName(event.target.value)
                                            }
                                            disabled={savingName}
                                            className="
                                                h-10
                                                flex-1
                                                rounded-xl
                                                border
                                                border-gray-300
                                                px-3
                                                text-sm
                                                text-gray-900
                                                outline-none
                                                focus:border-gray-900
                                                focus:ring-2
                                                focus:ring-gray-100
                                            "
                                        />

                                        <button
                                            type="button"
                                            onClick={handleSaveName}
                                            disabled={
                                                savingName ||
                                                !name.trim()
                                            }
                                            className="
                                                h-10
                                                rounded-xl
                                                bg-gray-900
                                                px-4
                                                text-xs
                                                font-medium
                                                text-white
                                                hover:bg-gray-800
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                            "
                                        >
                                            {savingName
                                                ? "Saving..."
                                                : "Save"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setName(profile.name || "");
                                                setEditingName(false);
                                            }}
                                            disabled={savingName}
                                            className="
                                                h-10
                                                rounded-xl
                                                border
                                                border-gray-300
                                                px-4
                                                text-xs
                                                font-medium
                                                text-gray-700
                                                hover:bg-gray-50
                                                disabled:opacity-50
                                            "
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                ) : (

                                    <p className="
                                        mt-1
                                        text-sm
                                        font-medium
                                        text-gray-900
                                    ">
                                        {profile.name}
                                    </p>

                                )}

                            </div>

                        </div>


                        {/* Email */}

                        <div className="
                            flex
                            items-start
                            gap-3
                        ">

                            <Mail
                                size={19}
                                className="
                                    mt-0.5
                                    text-gray-500
                                "
                            />

                            <div>

                                <p className="
                                    text-xs
                                    text-gray-500
                                ">
                                    Email
                                </p>

                                <p className="
                                    mt-1
                                    text-sm
                                    font-medium
                                    text-gray-900
                                ">
                                    {profile.email ||
                                        "Not provided"}
                                </p>

                            </div>

                        </div>


                        {/* Phone */}

                        <div className="
                            flex
                            items-start
                            gap-3
                        ">

                            <Phone
                                size={19}
                                className="
                                    mt-0.5
                                    text-gray-500
                                "
                            />

                            <div>

                                <p className="
                                    text-xs
                                    text-gray-500
                                ">
                                    Phone
                                </p>

                                <p className="
                                    mt-1
                                    text-sm
                                    font-medium
                                    text-gray-900
                                ">
                                    {profile.phone ||
                                        "Not provided"}
                                </p>

                            </div>

                        </div>


                        {/* Role */}

                        <div>

                            <p className="
                                text-xs
                                text-gray-500
                            ">
                                Account type
                            </p>

                            <span className="
                                mt-1
                                inline-flex
                                rounded-full
                                bg-gray-100
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-gray-700
                            ">
                                {profile.role}
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                Profile Actions
            ========================= */}

            <div className="
                mt-6
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
            ">


                {profileActions.map(
                    ({
                        label,
                        description,
                        icon: Icon,
                        path
                    }) => (

                        <button
                            key={path}
                            type="button"
                            onClick={() =>
                                navigate(path)
                            }
                            className="
                                flex
                                w-full
                                items-center
                                gap-4
                                border-b
                                border-gray-100
                                px-5
                                py-4
                                text-left
                                transition
                                last:border-b-0
                                hover:bg-gray-50
                            "
                        >

                            {/* Icon */}

                            <div className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-gray-100
                                text-gray-700
                            ">

                                <Icon size={19} />

                            </div>


                            {/* Text */}

                            <div className="flex-1">

                                <p className="
                                    text-sm
                                    font-medium
                                    text-gray-900
                                ">
                                    {label}
                                </p>

                                <p className="
                                    mt-0.5
                                    text-xs
                                    text-gray-500
                                ">
                                    {description}
                                </p>

                            </div>


                            {/* Arrow */}

                            <ChevronRight
                                size={18}
                                className="
                                    text-gray-400
                                "
                            />

                        </button>

                    )
                )}

            </div>

        </div>
    );
};


export default Profile;