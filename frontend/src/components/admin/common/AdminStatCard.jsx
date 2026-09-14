const AdminStatCard = ({
    label,
    value
}) => {

    return (
        <div className="admin-card p-5">

            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="
                mt-2
                text-2xl
                font-semibold
                text-gray-900
            ">
                {value}
            </p>

        </div>
    );
};


export default AdminStatCard;