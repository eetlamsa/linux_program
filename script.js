async function updateData() {
  try {
    const res = await fetch("/api/update");
    const data = await res.json();
    console.log("Update response:", data);

    if (data.status !== "ok") {
      alert("Error fetching data: " + JSON.stringify(data));
      return;
    }

    loadData();
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Fetch failed: " + err.message);
  }
}

async function loadData() {
  try {
    const res = await fetch("/api/data");
    const data = await res.json();

    const list = document.getElementById("data");
    list.innerHTML = "";

    data.forEach(row => {
      const li = document.createElement("li");
      li.textContent = `${row.city}: ${row.temperature} °C (${row.timestamp})`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Load data error:", err);
  }
}

document.getElementById("fetchButton").addEventListener("click", updateData);

loadData();
