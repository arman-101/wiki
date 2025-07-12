const searchBtn = document.getElementById("button-search");

function listenForm() {
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const dayInput = parseInt(document.getElementById("day-input").value);
    const monthInput = parseInt(document.getElementById("month-input").value);
    const selectInput = document.getElementById("select-input").value;
    const errorMsg = document.getElementById("input-error");

    if (dayInput <= 0 || dayInput > 31 || !dayInput) {
      errorMsg.textContent = "Day value has to be between 1-31";
      return;
    }
    if (monthInput <= 0 || monthInput > 12 || !monthInput) {
      errorMsg.textContent = "Month value has to be between 1-12";
      return;
    }
    if (selectInput === "not-chosen") {
      errorMsg.textContent = "Pick selection between births, deaths and events";
      return;
    }
    if (
      (monthInput === 2 && dayInput === 30) ||
      (monthInput === 2 && dayInput === 31)
    ) {
      errorMsg.textContent = "February doesn't have day 30 and 31, input again";
      return;
    }
    if (monthInput === 4 && dayInput === 31) {
      errorMsg.textContent = "April doesn't have day 31, input again";
      return;
    }
    if (monthInput === 6 && dayInput === 31) {
      errorMsg.textContent = "June doesn't have day 31, input again";
      return;
    }
    if (monthInput === 9 && dayInput === 31) {
      errorMsg.textContent = "September doesn't have day 31, input again";
      return;
    }
    if (monthInput === 11 && dayInput === 31) {
      errorMsg.textContent = "November doesn't have day 31, input again";
      return;
    }

    // passed checks
    errorMsg.textContent = "";
    fetchData(dayInput, monthInput, selectInput);
  });
}

async function fetchData(day, month, event) {
  try {
    const response = await fetch(
      `http://history.muffinlabs.com/date/${month}/${day}`
    );

    if (!response.ok) {
      throw new Error("Network error is not OK");
    }

    const data = await response.json();

    // next here
    displayData(data, event);
    dataGlobal = data;
    eventGlobal = event;
  } catch (error) {
    console.error("Error is: ", error);
  }
}

function displayData(data, chosenEvent) {
  const userData = data.data[chosenEvent];

  if (!userData || !Array.isArray(userData)) {
    console.error(`No Data Found for ${chosenEvent}`);
    return;
  }

  // results info
  const daySearched = document.getElementById("day-searched");
  daySearched.textContent = data.date;
  const totalSearched = document.getElementById("total-searched");
  totalSearched.textContent = `Total ${chosenEvent}: ${userData.length}`;

  const appendRow = document.getElementById("t-body");
  appendRow.innerHTML = "";

  userData.forEach((data, index) => {
    const row = document.createElement("tr");

    // index
    const numberRow = document.createElement("th");
    numberRow.scope = "row";
    numberRow.textContent = index + 1;

    // years
    const yearRow = document.createElement("td");
    yearRow.textContent = data.year;

    // name
    const nameRow = document.createElement("td");
    nameRow.textContent = data.text;

    // links
    const linkRow = document.createElement("td");
    if (data.links && data.links.length > 0) {
      const firstLink = data.links[0];

      const anchor = document.createElement("a");
      anchor.href = firstLink.link;
      anchor.textContent = firstLink.title;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";

      linkRow.appendChild(anchor);
    } else {
      linkRow.textContent = "No links available";
    }

    row.appendChild(numberRow);
    row.appendChild(yearRow);
    row.appendChild(nameRow);
    row.appendChild(linkRow);
    appendRow.appendChild(row);
  });
}


function addFooter() {
  const footerDate = document.getElementById("footer-date");
  const date = new Date();
  const year = date.getFullYear();
  footerDate.textContent = `@ Arman ${year}`;
}

let dataGlobal = null;
let eventGlobal = null;
const sortBtn = document.getElementById("year");
let isYearAsc = true;

// main
function main() {
  listenForm();
  addFooter();

  sortBtn.addEventListener("click", () => {
    if (!dataGlobal || !eventGlobal) return; // Skip if no data

    isYearAsc = !isYearAsc; // Toggle sort direction
    const sortedData = [...dataGlobal.data[eventGlobal]]; // Copy array
    sortedData.sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      return isYearAsc ? yearA - yearB : yearB - yearA;
    });

    displayData({ data: { [eventGlobal]: sortedData } }, eventGlobal);
    sortBtn.textContent = `Year ${isYearAsc ? "↑" : "↓"}`; // UI feedback
  });
}

main();
