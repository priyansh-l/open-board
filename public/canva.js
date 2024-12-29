let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencil_color_cont = document.querySelectorAll(".pencil-color-cont");
let pencil_color = "red";
let pencil_width_ele = document.querySelector(".pencil-width");
let eraser_width_ele = document.querySelector(".eraser-width");
let eraser_color = "white";
let pencil_width = pencil_width_ele.getAttribute("value");
let eraser_width = eraser_width_ele.getAttribute("value");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");
let RedoUndo = [];
let index = 0;

let pencil_flag_for_component = false;

let mousedown = false;
let red = document.querySelector(".red");
let black = document.querySelector(".black");
let blue = document.querySelector(".blue");
// API
let tool = canvas.getContext("2d");
tool.strokeStyle = pencil_color;
tool.lineWidth = "3";

// tool.beginPath();
// // new graphic (path)  line
// tool.moveTo(10, 10);
// tool.lineTo(100, 100);
// tool.stroke(); //fillcolor
canvas.addEventListener("mousedown", (e) => {
  mousedown = true;
  let data = {
    x: e.clientX,
    y: e.clientY,
  };
  socket.emit("beginPath", data);
});
canvas.addEventListener("mousemove", (e) => {
  if (mousedown) {
    let data = {
      color: pencil_flag_for_component ? pencil_color : eraser_color,
      width: pencil_flag_for_component ? pencil_width : eraser_width,
      x: e.clientX,
      y: e.clientY,
      // yeh flags tool.js me define hai
      // jo server se connected computer(other than sender)
      // unhe iss code se koi matlab nahi hai
      // unme hum bas function laga ke
      // display kara rahe hai

      // balki hum bhi jo display dekhenge vo
      // ek receiver ke roop me dekhenge
    };
    socket.emit("drawStroke", data);
  }
});
canvas.addEventListener("mouseup", (e) => {
  mousedown = false;
  let url = canvas.toDataURL();
  RedoUndo.push(url);
  index = RedoUndo.length - 1;
});

pencil_color_cont.forEach((pencil_coloring) => {
  pencil_coloring.addEventListener("click", () => {
    tool.lineWidth = pencil_width;
    let color = pencil_coloring.classList[0];
    if (pencil_color == "red") {
      red.style.border = "none";
    } else if (pencil_color == "black") {
      black.style.border = "none";
    } else {
      blue.style.border = "none";
    }
    pencil_color = color;
    tool.strokeStyle = pencil_color;
    // pencil_color.style.border = "3px solid white";
    if (pencil_color === "red") {
      red.style.border = "3px solid white";
    } else if (pencil_color === "black") {
      black.style.border = "3px solid white";
    } else {
      blue.style.border = "3px solid white";
    }
  });
});

pencil_width_ele.addEventListener("change", () => {
  tool.strokeStyle = pencil_color;
  pencil_width = pencil_width_ele.value;
  tool.lineWidth = pencil_width;
});
eraser_width_ele.addEventListener("change", () => {
  tool.strokeStyle = "white";
  eraser_width = eraser_width_ele.value;
  tool.lineWidth = eraser_width;
});
download.addEventListener("click", () => {
  let url = canvas.toDataURL();
  let anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "board.jpg";
  anchor.click();
});

redo.addEventListener("click", () => {
  if (index <= RedoUndo.length - 2) {
    index++;
    let data = {
      index,
      RedoUndo,
    };
    socket.emit("undoRedoProcess", data);
  }
});
undo.addEventListener("click", () => {
  if (index > 0) {
    index--;
    let data = {
      index,
      RedoUndo,
    };
    socket.emit("undoRedoProcess", data);
  }
});
function undoRedoProcess(data) {
  // index and RedoUndo already define hai
  index = data.index;
  RedoUndo = data.RedoUndo;
  let url = RedoUndo[index];
  let new_image = new Image();

  // Clear the canvas before drawing the image
  tool.clearRect(0, 0, canvas.width, canvas.height);
  new_image.src = url;
  // event listener of load;
  new_image.onload = (e) => {
    tool.drawImage(new_image, 0, 0, canvas.width, canvas.height);
  };
}

// canvas.js hamara frontend hai
// frontend ne server ko data bheja
// ab server ne aage data bheja ki nahi bheja yeh kaise pata lagega
// jin logo ko bhejega un me bhi hu
// to ab neeche se check karenge ki server se aage gaya ki nahi

function beginPath(data) {
  tool.beginPath();
  tool.moveTo(data.x, data.y);
}

function drawStroke(data) {
  tool.lineWidth = data.width;
  tool.strokeStyle = data.color;
  tool.lineTo(data.x, data.y);
  tool.stroke();
}

socket.on("beginPath", (data) => {
  beginPath(data);
});
socket.on("drawStroke", (data) => {
  drawStroke(data);
});
socket.on("undoRedoProcess", (data) => {
  undoRedoProcess(data);
});
