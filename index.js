const form = document.querySelector(".save");
form.addEventListener("submit", AddPlayer);
document.querySelector(".result").addEventListener("click", result);
let Starbut = document.getElementById("Start");
let resultbut = document.getElementById("Result");
Starbut.disabled = true;
const players = {};
resultbut.style.display = "none";

function addPlayer(playername) {
  players[playername] = {};
}

function AddPlayer(e) {
  e.preventDefault();
  const playerName = e.target.querySelector('input[name="name"]').value;
  RenderPlayer(playerName);
  addPlayer(playerName);
  console.log(playerName);
  clearInput();
  Starbut.disabled = false;
}

function clearInput() {
  const inputField = document.querySelector('input[name="name"]');
  inputField.value = "";
}

function RenderPlayer(playerName) {
  const Spleare = document.querySelector(".players");
  const h4 = document.createElement("h4");
  const playerDiv = document.createElement("div");
  h4.textContent = playerName;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-player";
  deleteButton.addEventListener("click", () => {
    deletePlayer(playerName);
    removePlayer(playerName);
  });

  playerDiv.appendChild(h4);
  playerDiv.appendChild(deleteButton);
  const Splear = document.querySelector(".players");
  Splear.appendChild(playerDiv);
}

function deletePlayer(playerName) {
  delete players[playerName];
}

function removePlayer(playerName) {
  const playersC = document.querySelector(".players");
  const playerDivs = playersC.querySelectorAll("div");
  playerDivs.forEach((playerDiv) => {
    const h4 = playerDiv.querySelector("h4");
    if (h4.textContent === playerName) {
      playersC.removeChild(playerDiv);
    }
  });
}

document.getElementById("Start").addEventListener("click", () => {
  getScore();
  let but = document.getElementById("but");
  but.disabled = true;
  Starbut.disabled = true;

  document.getElementById("Start").style.display = "none";

  const saveForm = document.querySelector(".save");
  saveForm.style.display = "none";
  const playersDiv = document.querySelector(".players");
  playersDiv.style.display = "none";

  const resultDiv = document.querySelector(".result");
  resultDiv.hidden = false;
  resultbut.style.display = "block";
});


async function getScore() {
  const response = await fetch("info.json");
  const data = await response.json();
  console.log(data);
  renderCourt(data.court);
}

function renderCourt(court) {
  court.forEach((c, index) => {
    console.log(c);

    let div = document.createElement("div");
    div.className = "holeinput";
    div.id = c.id;

    let info = document.createElement("p");
    info.className = "info";
    info.innerHTML = "info: " + c.info;

    let par = document.createElement("p");
    par.className = "par";
    par.innerHTML = "par: " + c.par;

    div.appendChild(info);
    div.appendChild(par);

    for (let player in players) {
      console.log(player);
      let input = document.createElement("input");
      input.type = "number";
      let i = document.createElement("i");
      i.innerHTML = player;
      input.name = player;
      input.dataset.id = c.id;
      input.addEventListener("input", (e) => {
        const holeId = e.target.dataset.id;
        const playerName = e.target.name;
        const score = e.target.value;
        savescore(playerName, holeId, score);
      });

      div.appendChild(i);
      div.appendChild(input);
    }
    document.querySelector(".scoreList").appendChild(div);

    if (index < court.length - 1) {
      let hr = document.createElement("hr");
      document.querySelector(".scoreList").appendChild(hr);
    }
  });
}

function savescore(name, holeid, result) {
  players[name][holeid] = result;
  console.log(players);
}

function result() {
  const totalScores = {};
  for (let playerName in players) {
    let total = 0;
    for (let holeId in players[playerName]) {
      total += parseInt(players[playerName][holeId]);
    }
    totalScores[playerName] = total;
  }
  Total(totalScores);
  const scoreboard = document.querySelector(".scoreList");
  scoreboard.style.display = "none";
  const playerList = document.querySelector(".players");
  playerList.style.display = "none";

  resultbut.disabled = true;
  resultbut.style.display = "none";


  const refreshButton = document.createElement("button");
  refreshButton.textContent = "Start again";
  refreshButton.addEventListener("click", function () {
    location.reload();
  });

  document.querySelector(".c").appendChild(refreshButton);
}



function Total(totalS) {
  let div = document.createElement("div");
  div.className = "totaltScore";

  let vinnare = document.createElement("p");
  vinnare.className = "vinnare";

  let highestScore = Infinity;
  let vinnareSpelare = "";

  for (let playerName in totalS) {
    let s = document.createElement("p");
    s.className = "playerName";
    s.innerHTML = playerName;

    let q = document.createElement("i");
    q.className = "playerScore";
    q.innerHTML = totalS[playerName];

    div.appendChild(s);
    div.appendChild(q);
    console.log(playerName + ":" + totalS[playerName]);

    if (totalS[playerName] < highestScore) {
      highestScore = totalS[playerName];
      vinnareSpelare = playerName;
    }
  }

  vinnare.innerHTML = "Vinnare: " + vinnareSpelare;
  vinnare.className = "Vinnare";
  div.appendChild(vinnare);

  div.className = "result";
  document.querySelector(".c").appendChild(div);
}