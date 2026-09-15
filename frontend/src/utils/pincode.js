const PINCODE_API =
    "https://api.postalpincode.in/pincode";


export const lookupIndianPincode = async (
    pincode
) => {

    const cleanPincode =
        String(pincode)
            .trim()
            .replace(/\D/g, "");


    if (!/^\d{6}$/.test(cleanPincode)) {

        throw new Error(
            "Please enter a valid 6-digit Indian PIN code"
        );
    }


    const response = await fetch(
        `${PINCODE_API}/${cleanPincode}`
    );


    if (!response.ok) {

        throw new Error(
            "Unable to verify PIN code"
        );
    }


    const result =
        await response.json();


    const data = result?.[0];


    if (
        !data ||
        data.Status !== "Success" ||
        !Array.isArray(data.PostOffice) ||
        data.PostOffice.length === 0
    ) {

        throw new Error(
            "Invalid Indian PIN code. Please recheck or re-enter it."
        );
    }


    const areas =
        data.PostOffice.map(
            (postOffice) => ({
                name: postOffice.Name,
                district: postOffice.District,
                state: postOffice.State,
                country: postOffice.Country
            })
        );


    return {
        pincode: cleanPincode,
        areas
    };
};