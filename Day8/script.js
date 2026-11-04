function buttonClick() {
let txtName =document.getElementById("txtName").value;
    document.getElementById("lblCustomerName").innerText = txtName;
    document.getElementById("olCustomers").innerHTML += "<li>" + txtName + "</li>";
}