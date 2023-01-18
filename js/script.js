var sportsViewer = document.getElementById("sports-viewer");
var distEvent;
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function toggleDropdown(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById("myDropdown").classList.toggle("show");
  document.getElementById("sports-viewer").contentWindow.postMessage({
    topic: "closeDropdown",
    data: "",
  }, "*")
}
clickFrame = () => {
  document.getElementById("myDropdownSub").classList.remove("show");
  a;
  var dropdowns = document.getElementsByClassName("dropdown-content");
  var i;
  for (var i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if (openDropdown.classList.contains("show")) {
      openDropdown.classList.remove("show");
    }
  }
};
// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches(".dropbtn")) {
    if (event.target.matches(".menu-item")) {
      var itemID = event.target.id;
      var dropdownButton = document.getElementById("dropdown-button");
      dropdownButton.innerText = document.getElementById(itemID).innerText;
      for (var l = 0; l < document.getElementById("selectContainer").children.length; l++) {
        if (document.getElementById("selectContainer").children[l].innerText == document.getElementById(itemID).innerText) {
          document.getElementById("selectContainer").selectedIndex = l;
        }
      }
      window.parent.parent.postMessage({
        topic: "changeTitle",
        data: {
          title: "",
          pageName: document.getElementById(itemID).innerText
        },
      }, "*");
      const newLocation = "./sports/" + event.target.id + ".html?v=" + Date.now();
      sportsViewer.style.height = 0;
      sportsViewer.src = newLocation;
    }
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function postMessageTo(data) {
  if (data != undefined) {
    if (data.topic == "setScrollValue") {
      data.containerheight = sportsViewer.contentWindow.innerHeight + 32;
      window.parent.window.postMessage(data, "*");
      // mainViewer.contentWindow.scrollTo(0,data.data);
    }
  }
  if (!distEvent) return;
  distEvent.source.postMessage(data, distEvent.origin);
}

function postMessageToSetHeight() {
  postMessageTo({
    topic: "setHeight",
    data: document.body.scrollHeight,
  });
}

function postMessageToChangeContent(frame) {
  let innerDoc = frame.contentDocument || frame.contentWindow.document;
  if (innerDoc.querySelectorAll(".maindiv")[0].offsetHeight > 0) {
    window.parent.window.postMessage({
      topic: "changeContent",
      data: sportsViewer.contentDocument.querySelectorAll(".maindiv")[0].offsetHeight + 200,
    }, "*");
  } else {
    window.parent.window.postMessage({
      topic: "changeContent",
      data: sportsViewer.contentDocument.querySelectorAll("body")[0].offsetHeight + 200,
    }, "*");
  }
  postMessageTo({
    topic: "changeContent",
    data: null,
  });
}

function postMessageToSetScrollValue(scrollValue) {
  postMessageTo({
    topic: "setScrollValue",
    data: scrollValue,
  });
}

function updateIFrameHeight(frame) {
  let innerDoc = frame.contentDocument || frame.contentWindow.document;
  frame.style.height = innerDoc.scrollHeight + "px";
}
sportsViewer.scrolling = "no";
sportsViewer.onload = function(e) {
  updateIFrameHeight(sportsViewer);
  postMessageToChangeContent(sportsViewer);
  // Bubble events to parent
  sportsViewer.contentDocument.onclick = function(event) {
    document.getElementById("myDropdown").classList.remove("show");
  };
  if (sportsViewer.src.includes("/sports/football.html")) {
    var linkTable = sportsViewer.contentDocument.getElementById("linktable");
    linkTable.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      if (event.target.matches("a")) {
        var anchorName = event.target.getAttribute("href").substring(1);
        var targetAnchorDom = sportsViewer.contentDocument.querySelector('a[id="' + anchorName + '"]');
        if (targetAnchorDom == undefined) {
          var targetAnchorDom = sportsViewer.contentDocument.querySelector('div[id="' + anchorName + '"]');
        }
        postMessageToSetScrollValue(targetAnchorDom.offsetTop + 8);
      }
    });
  }
};
window.onmessage = function(event) {
  if (event.data.topic == "closeDropdown") {
    document.getElementById("myDropdown").classList.remove("show");
  }
  if (event.data.topic == "thmUpdate") {
    var datatoupdate = event.data.data;
    console.log(datatoupdate);
  }
  if (event.data === "scroll") {
    console.log(event.data);
  }
  if (event.data === "initEvent") {
    distEvent = event;
  }
  if (event.data === "getHeight") {
    // need calc iframe content height when change window size
    updateIFrameHeight(sportsViewer);
    postMessageToSetHeight();
  }
};
const childWindow = document.getElementById("sports-viewer").contentWindow;
window.addEventListener("message", (message) => {
  if (message.source !== childWindow) {
    return; 
  }
  
});
window.onload = () => {
  var itemID = getParameterByName('page');
  if (itemID != undefined) {
    var dropdownButton = document.getElementById("dropdown-button");
    dropdownButton.innerText = document.getElementById(itemID).textContent;
    for (var l = 0; l < document.getElementById("selectContainer").children.length; l++) {
      if (document.getElementById("selectContainer").children[l].innerText == document.getElementById(itemID).textContent) {
        document.getElementById("selectContainer").selectedIndex = l;
      }
    }
    const newLocation = "./sports/" + itemID + ".html?v=" + Date.now();
    sportsViewer.style.height = 0;
    sportsViewer.src = newLocation;
  }
}