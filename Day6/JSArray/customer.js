
const CUSTOMER_KEY = "customers";

let customers = [];

function loadCustomers() {
    const saved = localStorage.getItem(CUSTOMER_KEY);
    customers = saved ? JSON.parse(saved) : [];
    console.log("customers array:", customers);
}

function saveCustomers() {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customers));
}

function addCustomer() {
    let txtName = document.getElementById("txtName").value;
    let cboGender = document.getElementById("cboGender").value;
    let txtAddress = document.getElementById("txtAddress").value;
    let txtAge = document.getElementById("txtAge").value;
    let txtContact = document.getElementById("txtContact").value;

    let customer = {
        name: txtName,
        gender: cboGender,
        address: txtAddress,
        age: txtAge,
        contact: txtContact
    };

    customers.push(customer);
    saveCustomers();

    console.log(customers);

    document.querySelector("form").reset();
}

function clearForm() {
    document.querySelector("form").reset();
    document.getElementById("txtName").focus();
}

loadCustomers();
