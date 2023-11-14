const form = document.getElementById("form");
const tableBody = document.getElementById("tablebody");
document.body.style.backgroundColor='#0083B0'
const url = "https://mock-api-template-rh6s.onrender.com/users";
const divPagination = document.getElementById("pagination-container");

const itemsPerPage = 10;
let currentPage = 1;
let data = [];

const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const currentPageSpan = document.getElementById("currentPageSpan");

window.addEventListener("load", () => {
    fetchData();
});

function fetchData() {
    fetch(url)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Error fetching data: ${res.status} - ${res.statusText}`);
            }
            return res.json();
        })
        .then((fetchedData) => {
            data = fetchedData; 
            renderTable(currentPage);
        })
        .catch((error) => console.error("Error fetching data: ", error));
}

function createPaginationButtons(totalPages) {
    divPagination.innerHTML = '';

    const prevButton = document.createElement("button");
    prevButton.innerText = "← Previous";
    prevButton.addEventListener("click", () => goToPage(currentPage - 1));
    divPagination.appendChild(prevButton);

    const numButtonsToShow = 3; 
    const halfNumButtons = Math.floor(numButtonsToShow / 2);

    for (let i = currentPage - halfNumButtons; i <= currentPage + halfNumButtons; i++) {
        if (i >= 1 && i <= totalPages) {
            const paginationButton = document.createElement("button");
            paginationButton.innerText = i;
            paginationButton.addEventListener("click", () => goToPage(i));
            divPagination.appendChild(paginationButton);
        }
    }

    const nextButton = document.createElement("button");
    nextButton.innerText = "Next →";
    nextButton.addEventListener("click", () => goToPage(currentPage + 1));
    divPagination.appendChild(nextButton);
}

function goToPage(page) {
    if (page >= 1 && page <= Math.ceil(data.length / itemsPerPage)) {
        currentPage = page;
        renderTable(currentPage);
    }
}

function calculateTotalPages() {
    return Math.ceil(data.length / itemsPerPage);
}

function renderTable(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = data.slice(startIndex, endIndex);

    tableBody.innerHTML = '';

    pageData.forEach((element) => {
        const newRow = document.createElement("tr");
        const cellUserId = document.createElement("td");
        const cellid = document.createElement("td");
        const celltitle = document.createElement("td");
        const cellCompleted = document.createElement("td");
        const celldel = document.createElement("td");
        const cellDeleted = document.createElement("button");
        const deleteIcon = document.createElement('i');
        const cellUpdate = document.createElement("td");
        const editButton = document.createElement("button");
        const pencilIcon = document.createElement("i");

        cellDeleted.innerText = "Delete ";
        // cellDeleted.style.backgroundColor = "rgb(209,26,42)";
        cellDeleted.style.backgroundColor='rgb(220,53,69)'
        cellDeleted.style.color='#fff'

        deleteIcon.className = "fas fa-trash"; 
        deleteIcon.style.fontSize='12.5px'

        editButton.innerText = "Edit ";
        editButton.style.backgroundColor = "rgb(44,134,188)";
        editButton.style.color='#fff'
        



        pencilIcon.className = "fa fa-pencil color-muted"; 
        pencilIcon.style.fontSize='12px'


        cellUserId.innerHTML = element.userid;
        cellid.innerHTML = element.id;
        celltitle.innerHTML = element.title;
        cellCompleted.innerHTML = element.completed;

        if (cellCompleted.innerText === "true") {
            cellCompleted.style.color = "blue";
        } else {
            cellCompleted.style.color = "red";
        }

        cellDeleted.addEventListener("click", async function () {
            const confirmdel = confirm("Are you sure want to delete the entire row....?");
            if (confirmdel) {
                let response = await fetch(url + "/" + element.id, { method: "DELETE" });
                console.log(response);
                fetchData();
            }
            alert('Deleted successfully.....');
        });

        editButton.addEventListener("click", function () {
            enterEditMode(element.id, element);
        });

        
        editButton.appendChild(pencilIcon);

        celldel.appendChild(cellDeleted);
        cellDeleted.appendChild(deleteIcon); 
        cellUpdate.appendChild(editButton);

        newRow.appendChild(cellUserId);
        newRow.appendChild(cellid);
        newRow.appendChild(celltitle);
        newRow.appendChild(cellCompleted);
        newRow.appendChild(celldel);
        newRow.appendChild(cellUpdate);

        tableBody.appendChild(newRow);
    });

    createPaginationButtons(calculateTotalPages());

    currentPageSpan.textContent = page;
}

function addNewRecord(data) {
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then((res) => {
            if (res.ok) {
                alert("User created successfully....");
                fetchData();
            } else {
                throw new Error("Network response was not ok");
            }
        })
        .catch((error) => {
            console.error("Error creating user: ", error);
        });
}

function updateExistingRecord(id, data) {
    fetch(url + `/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then((res) => {
            if (res.ok) {
                alert("Data updated successfully🥳🥳🥳.......");
                fetchData();
            } else {
                throw Error("Network response was not ok");
            }
        })
        .catch((error) => {
            console.error("Error updating data: ", error);
        });
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const recordId = document.getElementById("recordId").value;
    const UserId = document.getElementById("name").value;
    const id = document.getElementById("id").value;
    const title = document.getElementById("title").value;
    const Completed = document.getElementById("checkbox").checked ? "true" : "false";
    console.log("clicked me");
    const obj = {
        userid: UserId,
        id,
        title,
        completed: Completed,
    };

    if (recordId) {
        updateExistingRecord(recordId, obj);
    } else {
        addNewRecord(obj);
    }

    form.reset();
});

function enterEditMode(id, data) {
    document.getElementById("recordId").value = id;
    document.getElementById("name").value = data.userid;
    document.getElementById("id").value = data.id;
    document.getElementById("title").value = data.title;
    document.getElementById("checkbox").checked = data.completed;
}

document.addEventListener("DOMContentLoaded", function () {
    var themeToggle = document.getElementById("theme-toggle");
    var body = document.body;
    var iconLight = document.getElementById("icon-light");
    var iconDark = document.getElementById("icon-dark");
    var table = document.getElementById('table');
    var paginationContainer = document.getElementById('pagination-container');

    iconLight.classList.add("d-none");
    // iconDark.classList.add("d-none");

    themeToggle.addEventListener("click", function () {
        body.classList.toggle("dark-theme");

        if (body.classList.contains("dark-theme")) {
            iconLight.classList.remove("d-none");
            iconDark.classList.add("d-none");
            document.querySelector('#div2').style.backgroundColor = 'black';
            document.body.style.backgroundColor = 'black';
            document.querySelector('#div2').style.color = 'white';
            document.querySelector('#cap').style.color = 'white';
            table.classList.remove("table-light", "table-primary");
            table.classList.add("table-dark", "table-secondary");
            table.style.border='1px solid white';
            table.style.borderRadius='10px';
        } else {
            iconLight.classList.add("d-none");
            iconDark.classList.remove("d-none");
            document.querySelector('#div2').style.backgroundColor = 'white';
            document.body.style.backgroundColor = ' #0083B0';
            document.querySelector('#div2').style.color = 'black';
            document.querySelector('#cap').style.color = 'black';
            table.classList.remove("table-dark", "table-secondary");
            table.classList.add("table-light", "table-primary");
        

        
        }
    });
});
