var coll = document.getElementById("Collapsible");

coll.addEventListener("click", function(e) {
    e.preventDefault();

  this.classList.toggle("active");
  let parent = this.parentElement;
  if (parent.style.top == "50%"){
    parent.style.top = `${50-0.8*0.5*100}%`;
  } else {
    parent.style.top = `50%`;
  }
});