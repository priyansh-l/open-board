let menu = document.querySelector(".menu");
let tool_cont = document.querySelector(".tool-cont");
let pencil_tool_cont = document.querySelector(".pencil-tool-cont");
let eraser_range_cont = document.querySelector(".eraser-range-cont");
let sticky_note = document.querySelector(".note-sticky");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let upload = document.querySelector(".upload");
// true and false
let pencil_flag = false; //this flag is for color selction of pencil
let eraser_flag = false;
let tools_open = true;

// menu game
menu.addEventListener("click", () => {
  tools_open = !tools_open;

  if (tools_open === false) {
    // tools_open false matlab ab se tools open band rahega
    let i = menu.querySelector("i");
    i.classList.remove("fa-times");
    i.classList.add("fa-bars");
    tool_cont.style.display = "none";
    pencil_tool_cont.style.display = "none";
    eraser_range_cont.style.display = "none";
    eraser_flag = false;
    pencil_flag = false;
  } else {
    tool_cont.style.display = "flex";
    let i = menu.querySelector("i");
    i.classList.add("fa-times");
    i.classList.remove("fa-bars");
  }
});

// pencil listeners and eraser listeners
pencil.addEventListener("click", () => {
  pencil_flag = !pencil_flag;
  pencil_flag_for_component = true;
  eraser_flag = false;
  tool.lineWidth = pencil_width;
  tool.strokeStyle = pencil_color;
  eraser_range_cont.style.display = "none";
  if (pencil_flag) {
    pencil_tool_cont.style.display = "block";
    console.log("In pencil_tool_cont");
  } else {
    pencil_tool_cont.style.display = "none";
  }
});

eraser.addEventListener("click", () => {
  eraser_flag = !eraser_flag;
  pencil_flag = false;
  pencil_flag_for_component = false;
  pencil_tool_cont.style.display = "none";
  tool.lineWidth = eraser_width; //red black blue ke liye white eraser ka hi work karega
  tool.strokeStyle = "white";
  if (eraser_flag) {
    eraser_range_cont.style.display = "block";
  } else {
    eraser_range_cont.style.display = "none";
  }
});

window.addEventListener("click", (event) => {
  // Check if pencil_flag is true and the click did not occur inside pencil_tool_cont
  // console.log("hii");
  // console.log(pencil_flag);
  // console.log(pencil_tool_cont.contains(event.target));
  // console.log(pencil.contains(event.target));

  // chalo man lo ki upload ya phir download kisi pe bhi
  // click hota hai to apne ko flags ki chinta kerne ki
  // jarurat nahi hai
  // kiuki yaha vo settle ho jayenge
  // pencil or eraser pe phir se click hua to
  // yaha se nahi unki event listener
  // se hi settle honge
  // ager unhe bhi yaha se rakh rahe the
  // to undo dono(pencil and eraser ke eventListeners) or window(eventListeners) ke beech conflict ho
  // raha tha
  if (
    pencil_flag &&
    !pencil_tool_cont.contains(event.target) &&
    !pencil.contains(event.target)
  ) {
    pencil_flag = false;
    // console.log("hello");
    pencil_tool_cont.style.display = "none";
  }
  if (
    eraser_flag &&
    !eraser_range_cont.contains(event.target) &&
    !eraser.contains(event.target)
  ) {
    eraser_flag = false;
    eraser_range_cont.style.display = "none";
  }
});

// upload game
upload.addEventListener("click", () => {
  // first generate file and set file as its attribute
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();
  input.addEventListener("change", () => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);
    stickyTemplate(`<img src= '${url}' />`);
  });
});

// sticky note
sticky_note.addEventListener("click", (event) => {
  stickyTemplate("<textarea></textarea>");
});

function stickyTemplate(stickyTemplateHTML) {
  let sticky = document.createElement("div");
  sticky.classList.add("sticky-note", "scale-tools");
  sticky.innerHTML = `
  <div class="header">
            <div class="minimize"><i class="fa-solid fa-minimize"></i></div>
            <div class="delete"><i class="fa-solid fa-trash"></i></div>
        </div>
        <div class="text-area">
            ${stickyTemplateHTML}
        </div>
  `;
  document.body.appendChild(sticky);
  // drag and drop game

  sticky.onmousedown = function (event) {
    let shiftX = event.clientX - sticky.getBoundingClientRect().left;
    let shiftY = event.clientY - sticky.getBoundingClientRect().top;

    sticky.style.position = "absolute";
    sticky.style.zIndex = 1000;
    // document.body.append(sticky);commented taki bar bar add na ho

    moveAt(event.pageX, event.pageY);

    // moves the sticky at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
      sticky.style.left = pageX - shiftX + "px";
      sticky.style.top = pageY - shiftY + "px";
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    // move the sticky on mousemove
    document.addEventListener("mousemove", onMouseMove);

    // drop the sticky, remove unneeded handlers
    sticky.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      sticky.onmouseup = null;
    };
  };

  sticky.ondragstart = function () {
    return false;
  };
  let minimize = sticky.querySelector(".minimize");
  let remove = sticky.querySelector(".delete");
  MinimizeAndRemove(minimize, remove, sticky);
}

function MinimizeAndRemove(minimize, remove, sticky) {
  minimize.addEventListener("click", () => {
    let textArea = sticky.querySelector(".text-area");
    let display = getComputedStyle(textArea).getPropertyValue("display");
    if (display === "none") {
      textArea.style.display = "block";
      sticky.style.boxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px";
      let i = minimize.querySelector("i");
      i.classList.remove("fa-maximize");
      i.classList.add("fa-minimize");
    } else {
      let i = sticky.querySelector("i");
      textArea.style.display = "none";
      sticky.style.boxShadow = "none";
      i.classList.remove("fa-minimize");
      i.classList.add("fa-maximize");
    }
  });
  remove.addEventListener("click", () => {
    sticky.remove();
  });
}
