toggleDropdownSub = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let dropdown = document.getElementById("myDropdownSub");
    dropdown.classList.toggle("show");
    window.parent.postMessage({
      topic: "closeDropdown",
      data: "",
    }, "*")
  };
  clickfuc = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let dropdown = document.getElementById("myDropdownSub");
    dropdown.classList.remove("show");
    let currentTarget = e.target.getAttribute("href").substring(1);
    let elementpos = getPosition(currentTarget);
    //window.scrollTo(0, elementpos[1]);
    let data = {
      topic: "setScrollValue",
      data: elementpos[1],
    };
    window.parent.window.parent.window.postMessage(data, "*");
  };
  getPosition = (element) => {
    let e = document.getElementById(element);
    let left = 0;
    let top = 0;
    do {
      left += e.offsetLeft;
      top += e.offsetTop;
    } while ((e = e.offsetParent));
    return [left, top];
  };
  window.onload = (event) => {
    let dropdown = document.getElementById("myDropdownSub");
    let dropdownlinks = dropdown.getElementsByTagName("a");
    for (var i = 0; i < dropdownlinks.length; i++) {
      dropdownlinks[i].addEventListener("click", clickfuc, false);
    }
    document.body.addEventListener("click",
      () => {
        document.getElementById("myDropdownSub").classList.remove("show");
      }, false);
    if (document.documentElement.clientWidth < 640) {
      let pagecontent = document.getElementById("linktable");
      let linkary = pagecontent.getElementsByTagName("a");
      var dropdownContainer = document.createElement("select");
      dropdownContainer.classList.add("dropdownIOS");
      for (var i = 0; i < linkary.length; i++) {
        let ahref = linkary[i].attributes.href.value;
        let optionName = linkary[i].innerHTML;
        let optionElement = document.createElement("option");
        optionElement.innerHTML = optionName;
        optionElement.value = ahref;
        dropdownContainer.appendChild(optionElement);
      }
      dropdownContainer.onchange = function(e) {
        e.preventDefault();
        e.stopPropagation();
        let currentTarget = e.target.value.substring(1);
        let elementpos = getPosition(currentTarget);
        let data = {
          topic: "setScrollValue",
          data: elementpos[1],
        };
        window.parent.window.parent.window.postMessage(data, "*");
        document.getElementsByClassName("dropdownIOS")[0].selectedIndex = 0;
      };
      document.getElementById("myDropdownSub").appendChild(dropdownContainer);
    }
  };
  window.onmessage = function(event) {
    if (event.data.topic == "closeDropdown") {
      document.getElementById("myDropdownSub").classList.remove("show");
    }
  }