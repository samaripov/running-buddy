import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="geolocation"
export default class extends Controller {
  static targets = ["distance"];

  connect() {
    //Set up the map and the location marker
    this.mapValue = L.map("map").setView([51.505, -0.09], 13);
    this.marker = L.marker([51.505, -0.09]).addTo(this.mapValue).bindPopup("You are here!").openPopup();

    //Load the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.mapValue);

    //Set starting values
    this.pathCoordinates = [];
    this.distance = 0;

    //set location initially;
    this.getLocation();
  }

  disconnect() {
    clearInterval(this.timerInterval);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.showPosition.bind(this),
        this.showError,
        {
          enableHighAccuracy: true // Request more accurate location
        }
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
    this.pathCoordinates.push([latitude, longitude]);

    if(!this.timerInterval) {
      this.startLocationUpdate();
    }
  }
  startLocationUpdate() {
    //Update location and map
    let timePassed = 0;
    const interval = 100;
    this.timerInterval = setInterval(() => {
      timePassed += interval;
      //Update at each step
      this.getLocation();

      //Only update the map every 5 seconds
      if(timePassed >= 5000) {
        this.drawPath();
        timePassed = 0;
      }
    }, interval);
  }


  addMarker(lat, lon, message) {
    L.marker([lat, lon])
      .addTo(this.mapValue)
      .bindPopup(message)
      .openPopup();
  }

  drawPath() {
    console.log(this.pathCoordinates);
    if(this.pathPolyline) {
      //Update existing polyline
      if(this.pathCoordinates.length >= 2) {
        const coord1 = this.pathCoordinates[this.pathCoordinates.length - 1];
        const coord2 = this.pathCoordinates[this.pathCoordinates.length - 2];
        this.updateDistance(coord1, coord2);
      }
      this.pathPolyline.setLatLngs(this.pathCoordinates);
    } else {
      //Create polyline
      this.pathPolyline = L.polyline(this.pathCoordinates, { color: "red" }).addTo(this.mapValue);
    }
  } 

  updateDistance(coord1, coord2) {
    console.log(coord1);
    console.log(coord2);
    this.distance += this.haversineDistance(coord1, coord2);
    this.distanceTarget.textContent = "";
    this.distanceTarget.textContent = `${parseFloat(this.distance).toFixed(2)}km`;
  }

  haversineDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in kilometers
    const lat1 = coord1[0] * (Math.PI / 180); // Convert latitude to radians
    const lon1 = coord1[1] * (Math.PI / 180); // Convert longitude to radians
    const lat2 = coord2[0] * (Math.PI / 180); // Convert latitude to radians
    const lon2 = coord2[1] * (Math.PI / 180); // Convert longitude to radians

    const deltaLat = lat2 - lat1; // Difference in latitude
    const deltaLon = lon2 - lon1; // Difference in longitude

    const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a)); // Angular distance in radians

    return R * c; // Distance in kilometers
  }
}
