
const ITEM_KEY = "items";

let items = [];

function loadItems() {
    const saved = localStorage.getItem(ITEM_KEY);
    items = saved ? JSON.parse(saved) : [];
    console.log("items array:", items);
}

function saveItems() {
    localStorage.setItem(ITEM_KEY, JSON.stringify(items));
}

function addItem() {
    let txtItem = document.getElementById("txtItem").value;
    let txtQuantity = document.getElementById("txtQuantity").value;
    let txtUnitPrice = document.getElementById("txtUnitPrice").value;

    let item = {
        item: txtItem,
        quantity: txtQuantity,
        unitPrice: txtUnitPrice
    };

    items.push(item);
    saveItems();

    console.log(items);

    document.querySelector("form").reset();
}

function clearForm() {
    document.querySelector("form").reset();
    document.getElementById("txtItem").focus();
}

loadItems();
