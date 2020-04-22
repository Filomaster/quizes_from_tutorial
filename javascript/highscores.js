const highScoreTable = document.getElementById("highScoresTable");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoreTable.innerHTML =
  "<tr class='heading'><th>Name</th><th>Score</th></tr>" +
  highScores
    .map((score) => {
      return `<tr class="high-score"><td class="score-name">${score.name}</td><td>${score.score}</td></tr>`;
    })
    .join("");
