
// Hamburger Icon onClick

let hm = document.querySelector(".hamburger-icon")
hm.addEventListener("click", () => {
  hm.classList.toggle("open")
  console.log("clicked")
});

hm.addEventListener("keypress", (event)=> {
  if (event.keyCode === 13) { // key code of the keybord key
    event.preventDefault();
    hm.classList.toggle("open")
  }
});


