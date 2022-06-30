
// Hamburger Icon onClick

let hm = document.querySelector(".hamburger-icon")
let bars = document.querySelector(".bars")
hm.addEventListener("click", () => {
  hm.classList.toggle("open")
  bars.classList.toggle("open-bars")
  console.log("clicked")
});

hm.addEventListener("keypress", (event)=> {
  if (event.keyCode === 13) { // key code of the keybord key
    event.preventDefault();
    hm.classList.toggle("open")
  }
});


