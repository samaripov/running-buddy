import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="create-run-record"
export default class extends Controller {
  static targets = ["time", "distance", "coordinates"];
  submit(event) {
    console.log("Attempting save")
    event.preventDefault();

    const runTimerDiv = document.getElementById("run-timer");
    const geolocationDiv = document.getElementById("geolocation");
    const runTimerController = runTimerDiv["run-timer"];
    const geolocationController = geolocationDiv["geolocation"];

    const distance = geolocationController.distance;
    const time = runTimerController.timeValue;
    const coordinates = geolocationController.pathCoordinates;

    console.log(`Sending this data: ${JSON.stringify({ time, distance, coordinates })}`);

    fetch("/run_records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").content,
      },
      body: JSON.stringify({ time, distance, coordinates }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Success: ", data);
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }
}
