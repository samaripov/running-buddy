import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="run-timer"
export default class extends Controller {
  static values = { timeValue: Number }

  connect() {
    console.log("RUN-TIMER CONNECTED SUCCESSFULLY!");
    if (this.timeValue === undefined || this.timeValue === null || isNaN(this.timeValue)) {
      this.timeValue = 0;
    }
    this.timerInterval = setInterval(() => {
      this.elapsedTime();
    }, 10);
  }

  disconnect() {
    clearInterval(this.timerInterval);
  }

  elapsedTime() {
    this.timeValue = this.timeValue + 10;
    this.element.textContent = this.formatTime(this.timeValue);
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
}
