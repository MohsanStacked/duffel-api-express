const flightForm = document.getElementById("flightForm");
const outputSection = document.getElementById("outputSection");
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

let tripType = "single";

// Function to toggle active state for tabs and enable/disable inputs
function toggleTabActiveState(button, tabId) {
  // Remove 'active' class from all buttons and hide all tab contents
  tabButtons.forEach((btn) => btn.classList.remove("active"));
  tabContents.forEach((content) => {
    content.classList.add("hidden");
    content.querySelectorAll("input").forEach((input) => {
      input.setAttribute("disabled", "true");
    });
  });

  // Add 'active' class to clicked button and show corresponding tab content
  button.classList.add("active");
  const activeTab = document.getElementById(`tab-${tabId}`);
  activeTab.classList.remove("hidden");
  activeTab.querySelectorAll("input").forEach((input) => {
    input.removeAttribute("disabled");
  });

  // Update trip type and show/hide return date input accordingly
  tripType = tabId === "return" ? "return" : "single";
  const returnDateField = document.getElementById("return_date");
  returnDateField.style.display = tripType === "return" ? "inline" : "none";
}

// Handle tab switching
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabId = button.dataset.tab;
    toggleTabActiveState(button, tabId);
  });
});

// Function to collect and validate form data
function collectFormData() {
  const formData = new FormData(flightForm);
  return {
    origin: formData.get("origin"),
    destination: formData.get("destination"),
    departure_date: formData.get("departure_date"),
    return_date: formData.get("return_date"),
    age: formData.get("age"),
    tripType,
  };
}

// Function to validate form data
function validateFormData({ origin, destination, departure_date }) {
  if (!origin || !destination || !departure_date) {
    alert("Please fill out all required fields.");
    return false;
  }
  return true;
}

// Function to create slices based on trip type
function createFlightSlices({
  origin,
  destination,
  departure_date,
  return_date,
  tripType,
}) {
  const slices = [
    {
      origin,
      destination,
      departure_date,
    },
  ];
  if (tripType === "return" && return_date) {
    slices.push({
      origin: destination,
      destination: origin,
      departure_date: return_date,
    });
  }
  return slices;
}

// Function to display flight results
function displayFlightResults(data) {
  outputSection.innerHTML = ""; // Clear previous results
  if (data.length === 0) {
    const noResultsDiv = document.createElement("div");
    noResultsDiv.classList.add("no-results");
    noResultsDiv.textContent = "No flight offers found.";
    outputSection.appendChild(noResultsDiv);
    return;
  }

  // Display flights
  data.forEach((offer) => {
    const offerDiv = document.createElement("div");
    offerDiv.classList.add("flight-result");
    const isReturnTrip = tripType === "return";
    offerDiv.innerHTML = `
      <h3>${
        isReturnTrip
          ? `${collectFormData().origin} -> ${collectFormData().destination}`
          : `${collectFormData().origin} -> ${collectFormData().destination}`
      }</h3>
      ${
        isReturnTrip
          ? `<p>----------------</p><h3>${collectFormData().destination} -> ${
              collectFormData().origin
            }</h3>`
          : ""
      }
      <p>Price: <span class="price">$${offer.total_amount}</span></p>
      <p>Airline: ${offer.owner.name || "Unknown"}</p>
    `;

    offerDiv.dataset.offer = JSON.stringify(offer);
    outputSection.appendChild(offerDiv);
  });
}

// Flight form submit handler
flightForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  outputSection.innerHTML = "Searching for your flights..."; // Clear previous results

  const formValues = collectFormData();
  if (!validateFormData(formValues)) return; // Stop submission if validation fails

  const slices = createFlightSlices(formValues);

  const requestData = {
    slices,
    age: formValues.age,
  };

  try {
    const response = await fetch("http://localhost:3000/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const data = await response.json();
      displayFlightResults(data);
    } else {
      console.error("Error:", response.statusText);
      outputSection.innerHTML = "Error fetching flight data.";
    }
  } catch (error) {
    console.error("Error:", error);
    outputSection.innerHTML = "Error occurred during flight search.";
  }
});

// Disable inputs in hidden tabs on page load
document.querySelectorAll(".tab-content.hidden input").forEach((input) => {
  input.setAttribute("disabled", "true");
});
