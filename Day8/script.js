const customerNames = [];

function buttonClick() {
  let txtName = document.getElementById("txtName").value;
  // document.getElementById("lblCustomerName").innerText = txtName;
  // document.getElementById("olCustomers").innerHTML += "<li>" + txtName + "</li>";

  customerNames.push(txtName);
  console.log(customerNames);

  loadNames();
}

function loadNames() {
  document.getElementById("lblCustomerName").innerHTML = "";
  for (let cName of customerNames) {
    document.getElementById("lblCustomerName").innerHTML +=
      "<li>" + cName + "</li>";
  }
}

const items = [];

function buttonClick1() {
  let itemName = document.getElementById("item").value;

  items.push(itemName);
  console.log(items);

  loadItems();
}

function loadItems() {
  document.getElementById("lblItemName").innerHTML = "";
  for (let itemName of items) {
    document.getElementById("lblItemName").innerHTML +=
      "<li>" + itemName + "</li>";
  }
}

const customerList = [];

function addCustomer() {
  let customerId = document.getElementById("txtCustomerId").value;
  let customerName = document.getElementById("txtCustomerName").value;
  let customerAge = document.getElementById("txtCustomerAge").value;
  let customerSalary = document.getElementById("txtCustomerSalary").value;

  let customer = {
    id: customerId,
    name: customerName,
    age: customerAge,
    salary: customerSalary,
  };

  customerList.push(customer);
  console.log(customerList);

  loadCustomerTable();

  document.getElementById("txtCustomerId").value = "";
  document.getElementById("txtCustomerName").value = "";
  document.getElementById("txtCustomerAge").value = "";
  document.getElementById("txtCustomerSalary").value = "";
}

function loadCustomerTable() {
  let tableBody = document.getElementById("customerTableBody");
  tableBody.innerHTML = "";

  for (let customer of customerList) {
    tableBody.innerHTML +=
    `<tr>` +
    `<td>${customer.name}</td>` +
    `<td>${customer.id}</td>` +
    `<td>${customer.age}</td>` +
    `<td>${customer.salary}</td>` +
    `</tr>`;
    
  }
}


const studentList = [];

function addStudent() {
  let studentId = document.getElementById("stuId").value;
  let studentName = document.getElementById("stuName").value;
  let studentAge = document.getElementById("stuAge").value;

  let student = {
    id: studentId,
    name: studentName,
    age: studentAge,
    
  };

  studentList.push(student);
  console.log(studentList);

  loadStudentTable();

  document.getElementById("stuId").value = "";
  document.getElementById("stuName").value = "";
  document.getElementById("stuAge").value = "";
}

function loadStudentTable() {
  let tableBody = document.getElementById("StudentTableBody");
  tableBody.innerHTML = "";

  for (let student of studentList) {
    tableBody.innerHTML +=
    `<tr>` +
    `<td>${student.name}</td>` +
    `<td>${student.id}</td>` +
    `<td>${student.age}</td>` +
    `</tr>`;
    
  }
}