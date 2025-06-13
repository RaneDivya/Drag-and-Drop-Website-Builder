const toolbox = document.querySelectorAll("#toolbox div");
const canvas = document.getElementById("canvas");
const form = document.getElementById("propertiesForm");
const deleteBtn = document.getElementById("deleteBtn");
let selectedElement = null;

toolbox.forEach(item => {
    item.addEventListener("dragstart", e => {
        e.dataTransfer.setData("type", e.target.dataset.type);
    });
});

canvas.addEventListener("dragover", e => {
    e.preventDefault();
})

canvas.addEventListener("drop", e => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    let el;
    if (type === "text") {
        el = document.createElement("div");
        el.textContent = "Edit me";
    }

    else if (type === "image") {
        el = document.createElement("img");
        el.src = "https://via.placeholder.com/300";
        el.style.width = "100px";
    }

    else if (type === "button") {
        el = document.createElement("button");
        el.textContent = "Click me";
    }

    el.classList.add("draggable");
    if (type === "image" ||  type === "button") {
        el.style.border = "1px solid #999";
    } 
    else {
    el.style.border = "none";
    }
    el.style.top = `${e.offsetY}px`;
    el.style.left = `${e.offsetX}px`;

    el.addEventListener ("click", ()=> {
        selectedElement = el;
        updateForm();
    });

    canvas.appendChild(el);
    dragElement(el);
});

function dragElement(elmnt) {
    let pos1= 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
      }
}

function updateForm() {
    if (!selectedElement) return;
    form.reset();
    if (selectedElement.tagName ==="IMG") {
        form.editImageUrl.value = selectedElement.src;
    }
    else {
        form.editText.value = selectedElement.textContent;
        form.editFontSize.value = parseInt(window.getComputedStyle(selectedElement).fontSize);
        form.editColor.value = rgbToHex(window.getComputedStyle(selectedElement).color);
    }
}

form.addEventListener("submit", e => {
  e.preventDefault();
  if (!selectedElement) return;

  if (selectedElement.tagName === 'IMG') {
    const newUrl = form.editImageUrl.value.trim();

    const testImg = new Image();
    testImg.onload = () => {
      selectedElement.src = newUrl;
    };
    testImg.onerror = () => {
      alert("Image failed to load. Try another URL.");
      selectedElement.src = "https://via.placeholder.com/300";
    };

    testImg.src = newUrl;
    } 
    else {
    selectedElement.textContent = form.editText.value;
    selectedElement.style.fontSize = form.editFontSize.value + 'px';
    selectedElement.style.color = form.editColor.value;
    }
});


function rgbToHex(rgb) {
      const result = rgb.match(/\d+/g).map(x => parseInt(x).toString(16).padStart(2, '0'));
      return `#${result.join('')}`;
    }

deleteBtn.addEventListener("click", () => {
    if (!selectedElement) return;
    selectedElement.parentElement.removeChild(selectedElement);
    selectedElement = null;
    form.reset();
});    