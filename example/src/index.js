var Chart = require("./chartjs");

var context = document.querySelector("#chart").getContext("2d");
var data = [85,62,78,72,65,62];
new Chart.Radar(context, {
  data: {
    labels: data.map(() => ""),
    datasets: [
      {
        data,
        pointRadius: 1.5,
        pointBackgroundColor: "rgb(13,172,154)",
        backgroundColor: "rgba(13,172,154,0.3)",
        borderColor: "transparent"
      }
    ]
  },
  options: {
    animation: false,
    events: [], // Stop responding to any event.
    legend: {
      display: false
    },
    scale: {
      ticks: {
        min: 0,
        max: 100,
        stepSize: 20,
        display: false
      }
    }
  }
});
