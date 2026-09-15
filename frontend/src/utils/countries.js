import { getData } from "country-list";


const countries = getData().sort(
    (a, b) =>
        a.name.localeCompare(b.name)
);


export default countries;