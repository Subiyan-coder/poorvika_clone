import { useRef } from "react";


const OtpInput = ({
    value,
    onChange,
    length = 6,
    disabled = false
}) => {

    const inputRefs = useRef([]);


    const updateOtp = (index, digit) => {

        const otp = value.split("");

        while (otp.length < length) {
            otp.push("");
        }

        otp[index] = digit;

        onChange(
            otp.join("").slice(0, length)
        );
    };


    const handleChange = (index, event) => {

        const input = event.target.value;

        const digit = input
            .replace(/\D/g, "")
            .slice(-1);


        updateOtp(index, digit);


        if (digit && index < length - 1) {

            inputRefs.current[index + 1]?.focus();

        }

    };


    const handleKeyDown = (index, event) => {

        if (event.key !== "Backspace") {
            return;
        }


        if (value[index]) {

            updateOtp(index, "");

            return;
        }


        if (index > 0) {

            inputRefs.current[index - 1]?.focus();

        }

    };


    const handlePaste = (event) => {

        event.preventDefault();


        const pasted = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, length);


        if (!pasted) {
            return;
        }


        onChange(pasted);


        const nextIndex = Math.min(
            pasted.length,
            length - 1
        );


        inputRefs.current[nextIndex]?.focus();

    };


    return (
        <div className="flex justify-center gap-2">

            {Array.from({ length }).map((_, index) => (

                <input
                    key={index}
                    ref={(element) => {
                        inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={
                        index === 0
                            ? "one-time-code"
                            : "off"
                    }
                    maxLength={1}
                    value={value[index] || ""}
                    disabled={disabled}
                    onChange={(event) =>
                        handleChange(index, event)
                    }
                    onKeyDown={(event) =>
                        handleKeyDown(index, event)
                    }
                    onPaste={handlePaste}
                    className="
                        h-12
                        w-11
                        rounded-xl
                        border
                        border-gray-300
                        bg-white
                        text-center
                        text-lg
                        font-medium
                        outline-none
                        transition
                        focus:border-gray-900
                        focus:ring-2
                        focus:ring-gray-100
                        disabled:bg-gray-100
                    "
                />

            ))}

        </div>
    );
};


export default OtpInput;