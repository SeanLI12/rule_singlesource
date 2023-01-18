const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const lang = urlParams.get('lang').toUpperCase();;
let title;
for (let i = 0; i < localization["All Terms"].length; i++) {
  if (localization["All Terms"][i]._CMSKEY == "o_SPORTSRULES") {
    title = localization["All Terms"][i][lang];
    localization["All Terms"].splice(i, 1);
  }
  if (localization["All Terms"][i]._CMSKEY == "o_POPULAR") {
    document.getElementById("popularheader").innerHTML = localization["All Terms"][i][lang];
    localization["All Terms"].splice(i, 1);
  }
  if (localization["All Terms"][i]._CMSKEY == "o_ALLSPORTSATOZ") {
    document.getElementById("atozheader").innerHTML = localization["All Terms"][i][lang];
    localization["All Terms"].splice(i, 1);
  }
}
//loop popular
for (let i = 0; i < popularlist.length; i++) {
  let optName = popularlist[i];
  localization["All Terms"].forEach((item, i) => {
    if (item._CMSKEY == optName) {
      let divNode = document.createElement("div");
      let innerdivNode = document.createElement("div");
      innerdivNode.innerHTML = item[lang];
      innerdivNode.addEventListener("click", () => {
        var itemID = item["FILE"];
        const newLocation = "./" + lang.toLowerCase() + "/rules.html?v=" + Date.now() + '&page=' + itemID + '&lang=' + lang;
        window.location.href = newLocation;
        window.parent.window.postMessage({
          topic: "changeTitle",
          data: {
            title: title,
            pageName: item[lang]
          },
        }, "*");
      })
      divNode.appendChild(innerdivNode);
      divNode.setAttribute("class", "items");
      document.getElementById("popular").appendChild(divNode);
      localization["All Terms"].splice(i, 1);
    }
  });
}
//loop all
for (let i = 0; i < localization["All Terms"].length; i++) {
  let divNode = document.createElement("div");
  let innerdivNode = document.createElement("div");
  innerdivNode.innerHTML = localization["All Terms"][i][lang];
  innerdivNode.addEventListener("click", () => {
    var itemID = localization["All Terms"][i]["FILE"];
    const newLocation = "./" + lang.toLowerCase() + "/rules.html?v=" + Date.now() + '&page=' + itemID + '&lang=' + lang;
    window.location.href = newLocation;
    window.parent.window.postMessage({
      topic: "changeTitle",
      data: {
        title: title,
        pageName: localization["All Terms"][i][lang]
      },
    }, "*");
  })
  divNode.appendChild(innerdivNode);
  divNode.setAttribute("class", "items");
  document.getElementById("sportatoz").appendChild(divNode);
}
window.onload = () => {
  postMessageToSetHeight(document.getElementById("landing").scrollHeight);
  window.parent.window.postMessage({
    topic: "changeTitle",
    data: {
      title: title,
      pageName: ""
    },
  }, "*");
}

function postMessageToSetHeight(msg) {
  window.parent.window.postMessage({
    topic: "changeContent",
    data: msg,
  }, "*");
}