const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const lang = urlParams.get('lang').toUpperCase();

  var sportsViewer = document.getElementById("sports-viewer");

  //remove redundant
  for (let i = 0; i < localization["All Terms"].length; i++) {
    if (localization["All Terms"][i]._CMSKEY == "o_SPORTSRULES") {
      title = localization["All Terms"][i][lang];
      localization["All Terms"].splice(i, 1);
    }
    if (localization["All Terms"][i]._CMSKEY == "o_POPULAR") {
      localization["All Terms"].splice(i, 1);
    }
    if (localization["All Terms"][i]._CMSKEY == "o_ALLSPORTSATOZ") {
      localization["All Terms"].splice(i, 1);
    }
  }
  //sorting from popular
  document.getElementById("myDropdown").innerHTML = "";
  let selectContainer = document.createElement("select");
  selectContainer.setAttribute("id", "selectContainer");
  for (let i = 0; i < popularlist.length; i++) {
    let optName = popularlist[i];
    localization["All Terms"].forEach((item, i) => {
      if (item._CMSKEY == optName) {
        let selectionOPTS = document.createElement("option");
        selectionOPTS.innerHTML = item[lang];
        selectionOPTS.setAttribute("id", item["FILE"]);
        selectContainer.appendChild(selectionOPTS);
        let node = document.createElement("button");
        node.setAttribute("class", "menu-item");
        node.setAttribute("id", item["FILE"]);
        node.innerHTML = item[lang];
        document.getElementById("myDropdown").appendChild(node);
        localization["All Terms"].splice(i, 1);
      }
    });
  }
  //sortingall
  for (let i = 0; i < localization["All Terms"].length; i++) {
    let innerdivNode = document.createElement("div");
    innerdivNode.innerHTML = localization["All Terms"][i][lang];
    let selectionOPTS = document.createElement("option");
    selectionOPTS.innerHTML = localization["All Terms"][i][lang];
    selectionOPTS.setAttribute("id", localization["All Terms"][i]["FILE"]);
    selectContainer.appendChild(selectionOPTS);
    let node = document.createElement("button");
    node.setAttribute("class", "menu-item");
    node.setAttribute("id", localization["All Terms"][i]["FILE"]);
    node.innerHTML = localization["All Terms"][i][lang];
    document.getElementById("myDropdown").appendChild(node);
  }
  selectContainer.onchange = function(e) {
    e.preventDefault();
    e.stopPropagation();
    let itemID = e.target.children[e.target.selectedIndex].id;
    var dropdownButton = document.getElementById("dropdown-button");
    dropdownButton.innerText = document.getElementById(itemID).textContent;
    window.parent.parent.postMessage({
      topic: "changeTitle",
      data: {
        title: "",
        pageName: document.getElementById(itemID).textContent
      },
    }, "*");
    const newLocation = "./sports/" + itemID + ".html?v=" + Date.now();
    sportsViewer.style.height = 0;
    sportsViewer.src = newLocation;
  }
  document.getElementsByClassName("rules-dropdown")[0].appendChild(selectContainer);