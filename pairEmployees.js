const uploadBut = document.getElementById("uploadConfirm");
const csvFile = document.getElementById("uploadFile");
const resultsDiv = document.getElementById("resultsDiv");

const uploadCsv = uploadBut.addEventListener("click", () => {
  Papa.parse(csvFile.files[0], {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      const longestWorkPeriod = findLongestWorkPeriod(results.data);
      printResults(longestWorkPeriod);
    },
  });
});

function parseDate(dateString) {
  const formats = [
    "YYYY-MM-DD",
    "YYYY/MM/DD",
    "MM/DD/YYYY",
    "DD-MM-YYYY",
    // Can add more if needed
  ];

  for (const format of formats) {
    const parts = dateString.split(/[\s/:-]/).filter((part) => part !== "");
    const formatParts = format.split(/[\s/:-]/);

    if (parts.length === formatParts.length) {
      const dateObject = {};

      for (let i = 0; i < parts.length; i++) {
        if (formatParts[i] === "YYYY" || formatParts[i] === "YY") {
          dateObject.year = parseInt(parts[i]);
        } else if (formatParts[i] === "MM") {
          dateObject.month = parseInt(parts[i]) - 1;
        } else if (formatParts[i] === "DD") {
          dateObject.day = parseInt(parts[i]);
        }
      }

      if (
        dateObject.year !== undefined &&
        dateObject.month !== undefined &&
        dateObject.day !== undefined
      ) {
        return new Date(dateObject.year, dateObject.month, dateObject.day);
      }
    }
  }

  return null;
}

function calculateOverlap(dateFrom1, dateTo1, dateFrom2, dateTo2) {
  const start = new Date(Math.max(parseDate(dateFrom1), parseDate(dateFrom2)));
  const end = dateTo1 === "NULL" ? new Date() : parseDate(dateTo1);
  const overlapStart = new Date(Math.max(start, parseDate(dateFrom2)));
  const overlapEnd =
    dateTo2 === "NULL" ? new Date() : Math.min(end, parseDate(dateTo2));

  const overlapTime = Math.max(0, overlapEnd - overlapStart);
  return overlapTime / (1000 * 60 * 60 * 24); // Convert milliseconds to days
}

function findLongestWorkPeriod(data) {
  let longestPeriod = 0;
  let longestPair = {};

  for (let i = 0; i < data.length - 1; i++) {
    for (let j = i + 1; j < data.length; j++) {
      if (data[i].ProjectID === data[j].ProjectID) {
        const overlapDays = calculateOverlap(
          data[i].DateFrom,
          data[i].DateTo,
          data[j].DateFrom,
          data[j].DateTo
        );

        if (overlapDays > longestPeriod) {
          longestPeriod = overlapDays;
          longestPair = {
            EmployeeID1: data[i].EmpID,
            EmployeeID2: data[j].EmpID,
            ProjectID: data[i].ProjectID,
            DaysWorked: overlapDays,
          };
        }
      }
    }
  }

  return longestPair;
}

function printResults(resultData) {
  resultsDiv.innerHTML = `
  <table>
    <tr>
      <th>EmployeeID1</th>
      <th>EmployeeID2</th>
      <th>ProjectID</th>
      <th>DaysWorked</th>
    </tr>
    <tr>
      <td>${resultData.EmployeeID1}</td>
      <td>${resultData.EmployeeID2}</td>
      <td>${resultData.ProjectID}</td>
      <td>${resultData.DaysWorked.toFixed(0)}</td>
    </tr>
  </table>`;
}
