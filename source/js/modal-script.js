document.querySelector(".form-found__button").addEventListener("click", function (evt) {
    evt.preventDefault();
    document.querySelector(".modal-window").classList.add("modal-window-open");
  });
  
  document.querySelector(".modal-close-button").addEventListener("click", function (evt) {
    evt.preventDefault();
    document.querySelector(".modal-window").classList.remove("modal-window-open");
  });
  