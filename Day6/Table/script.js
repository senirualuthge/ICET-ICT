const CUSTOMER_KEY = "customers";
const ITEM_KEY = "items";

let customers = [];
let items = [];

function escapeHtml(value) {
    return String(value === undefined || value === null ? "" : value).replace(/[&<>"']/g, function (ch) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
}

function loadCustomers() {
    const saved = localStorage.getItem(CUSTOMER_KEY);
    customers = saved ? JSON.parse(saved) : [];
    renderCustomers();
}

function saveCustomers() {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customers));
}

function renderCustomers() {
    const tbody = document.getElementById("tblCustomers");
    if (!tbody) return;

    if (customers.length === 0) {
        tbody.innerHTML = `<tr><td class="empty" colspan="5">No customers yet.</td></tr>`;
        return;
    }

    let body = "";

    for (let i = 0; i < customers.length; i++) {
        const customer = customers[i];
        body += `
            <tr>
                <td>${escapeHtml(customer.name)}</td>
                <td>${escapeHtml(customer.gender)}</td>
                <td>${escapeHtml(customer.address)}</td>
                <td>${escapeHtml(customer.age)}</td>
                <td>${escapeHtml(customer.contact)}</td>
            </tr>
        `;
    }

    tbody.innerHTML = body;
}

function addCustomer() {
    const customer = {
        name: document.getElementById("txtName").value.trim(),
        gender: document.getElementById("cboGender").value,
        address: document.getElementById("txtAddress").value.trim(),
        age: document.getElementById("txtAge").value,
        contact: document.getElementById("txtContact").value.trim()
    };

    customers.push(customer);
    saveCustomers();
    renderCustomers();
    resetForm("txtName");
    console.log("customers array:", customers);
}

function loadItems() {
    const saved = localStorage.getItem(ITEM_KEY);
    items = saved ? JSON.parse(saved) : [];
    renderItems();
}

function saveItems() {
    localStorage.setItem(ITEM_KEY, JSON.stringify(items));
}

function renderItems() {
    const tbody = document.getElementById("tblItems");
    if (!tbody) return;

    if (items.length === 0) {
        tbody.innerHTML = `<tr><td class="empty" colspan="4">No items yet.</td></tr>`;
        return;
    }

    let body = "";

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const total = Number(item.quantity) * Number(item.unitPrice);
        body += `
            <tr>
                <td>${escapeHtml(item.item)}</td>
                <td>${escapeHtml(item.quantity)}</td>
                <td>${Number(item.unitPrice).toFixed(2)}</td>
                <td>${total.toFixed(2)}</td>
            </tr>
        `;
    }

    tbody.innerHTML = body;
}

function addItem() {
    const item = {
        item: document.getElementById("txtItem").value.trim(),
        quantity: document.getElementById("txtQuantity").value,
        unitPrice: document.getElementById("txtUnitPrice").value
    };

    items.push(item);
    saveItems();
    renderItems();
    resetForm("txtItem");
    console.log("items array:", items);
}

function resetForm(focusId) {
    const form = document.querySelector("form");
    if (form) form.reset();
    const focusEl = focusId ? document.getElementById(focusId) : null;
    if (focusEl) focusEl.focus();
}

function clearForm() {
    const form = document.querySelector("form");
    if (form) form.reset();
    const first = document.querySelector("form input, form select");
    if (first) first.focus();
}

loadCustomers();
loadItems();
