import { useEffect, useState } from "react";


const KeyValueFields = ({
    value = {},
    onChange,
    disabled = false,
    error,
    resetKey,
    label = "Specifications",
    keyPlaceholder = "Name",
    valuePlaceholder = "Value",
    addLabel = "Add"
}) => {

    const [rows, setRows] = useState([]);


    useEffect(() => {

        if (
            !value ||
            typeof value !== "object"
        ) {
            setRows([]);
            return;
        }

        const entries =
            value instanceof Map
                ? Array.from(value.entries())
                : Object.entries(value);

        setRows(
            entries.map(
                ([name, fieldValue], index) => ({
                    id: `${name}-${index}`,
                    name,
                    value: String(
                        fieldValue ?? ""
                    )
                })
            )
        );

    }, [resetKey]);


    const buildValue = (updatedRows) => {

        const result = {};

        updatedRows.forEach(row => {

            const name = row.name.trim();
            const value = row.value.trim();

            if (name && value) {
                result[name] = value;
            }

        });

        return result;
    };


    const addRow = () => {

        setRows(current => [

            ...current,

            {
                id: crypto.randomUUID(),
                name: "",
                value: ""
            }

        ]);

    };


    const updateRow = (
        id,
        field,
        fieldValue
    ) => {

        const updatedRows = rows.map(row =>
            row.id === id
                ? {
                    ...row,
                    [field]: fieldValue
                }
                : row
        );

        setRows(updatedRows);

        onChange(
            buildValue(updatedRows)
        );

    };


    const removeRow = (id) => {

        const updatedRows =
            rows.filter(
                row => row.id !== id
            );

        setRows(updatedRows);

        onChange(
            buildValue(updatedRows)
        );

    };


    return (
        <div className="w-full">

            <div className="
                mb-2
                flex
                items-center
                justify-between
            ">

                <label className="
                    text-sm
                    font-medium
                    text-gray-700
                ">
                    {label}
                </label>


                <button
                    type="button"
                    onClick={addRow}
                    disabled={disabled}
                    className="
                        text-sm
                        font-medium
                        text-gray-900
                        hover:text-gray-600
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    + {addLabel}
                </button>

            </div>


            <div className="space-y-3">

                {rows.map(row => (

                    <div
                        key={row.id}
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <input
                            type="text"
                            value={row.name}
                            onChange={event =>
                                updateRow(
                                    row.id,
                                    "name",
                                    event.target.value
                                )
                            }
                            disabled={disabled}
                            placeholder={keyPlaceholder}
                            className="
                                h-11
                                flex-1
                                rounded-xl
                                border
                                border-gray-300
                                bg-white
                                px-4
                                text-sm
                                text-gray-900
                                outline-none
                                focus:border-gray-900
                                focus:ring-2
                                focus:ring-gray-100
                                disabled:cursor-not-allowed
                                disabled:bg-gray-100
                            "
                        />


                        <input
                            type="text"
                            value={row.value}
                            onChange={event =>
                                updateRow(
                                    row.id,
                                    "value",
                                    event.target.value
                                )
                            }
                            disabled={disabled}
                            placeholder={valuePlaceholder}
                            className="
                                h-11
                                flex-1
                                rounded-xl
                                border
                                border-gray-300
                                bg-white
                                px-4
                                text-sm
                                text-gray-900
                                outline-none
                                focus:border-gray-900
                                focus:ring-2
                                focus:ring-gray-100
                                disabled:cursor-not-allowed
                                disabled:bg-gray-100
                            "
                        />


                        <button
                            type="button"
                            onClick={() =>
                                removeRow(row.id)
                            }
                            disabled={disabled}
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                text-lg
                                text-gray-500
                                hover:bg-red-50
                                hover:text-red-600
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            ×
                        </button>

                    </div>

                ))}

            </div>


            {rows.length === 0 && (

                <div className="
                    rounded-xl
                    border
                    border-dashed
                    border-gray-300
                    px-4
                    py-6
                    text-center
                ">
                    <p className="text-sm text-gray-500">
                        No {label.toLowerCase()} added.
                    </p>
                </div>

            )}


            {error && (

                <p className="
                    mt-2
                    text-xs
                    text-red-500
                ">
                    {error}
                </p>

            )}

        </div>
    );
};


export default KeyValueFields;