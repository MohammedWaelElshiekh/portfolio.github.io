// the counter function
function counter() {
  let i = 0;
  let done = [];
  setInterval(() => {
    if (
      i <=
      document.querySelectorAll(".box span")[0].getAttribute("data-counter")
    ) {
      document.querySelectorAll(".box span")[0].innerHTML = i;
    } else {
      done.push("");
    }
    if (
      i <=
      document.querySelectorAll(".box span")[1].getAttribute("data-counter")
    ) {
      document.querySelectorAll(".box span")[1].innerHTML = i;
    } else {
      done.push("");
    }
    if (
      i <=
      document.querySelectorAll(".box span")[2].getAttribute("data-counter")
    ) {
      document.querySelectorAll(".box span")[2].innerHTML = i;
    } else {
      done.push("");
    }
    if (done.length === 3) {
      clearInterval();
    }
    i++;
  }, 50);
}
// the progressBars function
function brogressbars() {
  let items = document.querySelectorAll(".about .progress-bar");
  items.forEach((ele) => {
    ele.style.width = ele.innerHTML;
  });
}
//triggers the counters to start
window.onscroll = () => {
  if (window.scrollY >= 600) {
    brogressbars();
    counter();
    window.onscroll = null;
  }
};

// my work section
let projects = {
  app: document.querySelectorAll(".mywork .contents .project[cat='app']"),
  web: document.querySelectorAll(".mywork .contents .project[cat='web']"),
  all: document.querySelectorAll(".mywork .contents .project"),
};
let lis = document.querySelectorAll(".sorts li button");
lis.forEach((el) => {
  el.addEventListener("click", () => {
    console.info("works");
    projects.all.forEach((el) => {
      el.classList.remove("active");
    });
    projects[el.getAttribute("cat")].forEach((ele) => {
      ele.classList.add("active");
    });
    lis.forEach((el) => {
      el.classList.remove("active");
    });
    el.classList.add("active");
  });
});
// triggering bootstrab tooltip
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);
