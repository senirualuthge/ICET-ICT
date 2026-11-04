
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

let customer ={
    name:"Saman",
    age:"12",
    address:"walana",
    salary:"7500",
    contact:{
        provider:"Dialog",
        ContactNo:"123654789098",
        data:{
            sample:"0001",
            test1:{
                vm:"km90",
                sv:"kn80"
            }
        }
    }
    orders:[
        {
            name:"egg bun",
            quentity:"33",
            unitPrice:"150",
        },

        {
            name:"vegbun",
            unitprice:"100"
        }

    ]
}

console.log(customer.contact.ContactNo);
