import KeyValueFields from "../common/KeyValueFields";


const ProductSpecification = (props) => {

    return (
        <KeyValueFields
            {...props}
            label="Specifications"
            keyPlaceholder="Name"
            valuePlaceholder="Value"
            addLabel="Add Specification"
        />
    );

};


export default ProductSpecification;