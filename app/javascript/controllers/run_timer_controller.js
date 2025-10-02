import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="run-timer"
export default class extends Controller {
  static targets = ["timer"];

  connect() {
    //Make self visible to other controllers
    this.element[this.identifier] = this

    this.timeValue = 0;
    this.interval = 10;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.startTimer.bind(this),
        this.showError
      );
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.elapsedTime();
    }, this.interval);
  }

  disconnect() {
    clearInterval(this.timerInterval);
  }

  elapsedTime() {
    this.timeValue = this.timeValue + this.interval;
    const formatedTime = this.formatTime(this.timeValue);
    document.title = formatedTime;
    this.timerTarget.textContent = formatedTime;
  }

  formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);

    let milliseconds = Math.floor((ms % 1000) / 10);
    let seconds = totalSeconds % 60;
    let minutes = totalMinutes % 60;
    let hours = totalHours % 24;

    const pad = (num, length = 2) => String(num).padStart(length, "0");
    
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
  }

  showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.error("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.error("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.error("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.error("An unknown error occurred.");
        break;
    }
  }
}
