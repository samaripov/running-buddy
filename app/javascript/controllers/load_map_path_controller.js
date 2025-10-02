import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="load-map-path"
export default class extends Controller {
  connect() {
    const map_id = this.data.get("mapIdValue")
    const pathValue = this.data.get("pathValue");
    const coordinates = JSON.parse(pathValue); 

    console.log(coordinates);
    console.log(map_id);
    const middleCoordinate = coordinates[Math.floor(coordinates.length/2)];
    console.log(middleCoordinate)
    this.mapValue = L.map(map_id).setView([middleCoordinate[0], middleCoordinate[1]], 90);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.mapValue);

    L.polyline(coordinates, { color: "blue" }).addTo(this.mapValue);
  }
}
