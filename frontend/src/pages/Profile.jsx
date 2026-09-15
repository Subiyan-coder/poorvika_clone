import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    ChevronRight
} from "lucide-react";

import ImageUploader from "../components/ImageUploader";

import {
    getProfile,
    updateProfileImage
} from "../services/profileService";

import { toastSuccess } from "../utils/toast";


const Profile = () => {

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);

    const [profileImage, setProfileImage] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [uploading, setUploading] =
        useState(false);


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


    // =========================
    // Profile Image
    // =========================

    const handleImageChange = async (file) => {

        if (!file) {
            return;
        }


        try {

            setUploading(true);


            const response =
                await updateProfileImage(file);


            /*
             * If the backend returns the
             * updated profile, use it.
             *
             * Otherwise fetch the profile again.
             */

            if (response?.data) {

                setProfile(
                    response.data
                );

            }
            else {

                const updatedProfile =
                    await getProfile();

                setProfile(
                    updatedProfile.data
                );

            }


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

                    <div className="
                        w-full
                        sm:w-48
                    ">

                        <ImageUploader
                            value={profileImage}
                            onChange={handleImageChange}
                            multiple={false}
                            maxFiles={1}
                            disabled={uploading}
                            label="Profile picture"
                        />

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

                            <div>

                                <p className="
                                    text-xs
                                    text-gray-500
                                ">
                                    Name
                                </p>

                                <p className="
                                    mt-1
                                    text-sm
                                    font-medium
                                    text-gray-900
                                ">
                                    {profile.name}
                                </p>

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