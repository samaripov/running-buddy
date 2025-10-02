import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="geolocation"
export default class extends Controller {
  connect() {
    //Set up the map and the location marker
    this.mapValue = L.map("map").setView([51.505, -0.09], 13);
    this.marker = L.marker([51.505, -0.09]).addTo(this.mapValue).bindPopup("You are here!").openPopup();

    //Load the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.mapValue);

    this.pathCoordinates = [];

    //set location initially;
    this.getLocation();
    //Update location evey 5sec
    this.timerInterval = setInterval(() => {
      this.getLocation();
    }, 5000);
  }

  disconnect() {
    clearInterval(this.timerInterval);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.showPosition.bind(this),
        this.showError
      );
    } else {
      console.log("Geolocation is not supported on this browser.");
    }
  }
  showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    //Update map view and marker location
    this.mapValue.setView([latitude, longitude], 90);
    this.marker.setLatLng([latitude, longitude]);

    this.drawPath(latitude, longitude);
  }

  showError(error) {
    console.error("Error occured. Error code: " + error.code);
  }

  addMarker(lat, lon, message) {
    L.marker([lat, lon])
      .addTo(this.mapValue)
      .bindPopup(message)
      .openPopup();
  }

  drawPath(lat, lon) {
    this.pathCoordinates.push([lat, lon]);

    if(this.pathPolyline) {
      //Update existing polyline
      this.pathPolyline.setLatLngs(this.pathCoordinates);
    } else {
      //Create polyline
      this.pathPolyline = L.polyline(this.pathCoordinates, { color: "red" }).addTo(this.mapValue);
    }
  } 
}
