document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("bookingModal");
  const closeBtn = document.querySelector(".close");

  // Открытие формы
  document.getElementById("openBookingForm").addEventListener("click", function () {
    modal.style.display = "block";
  });

  // Закрытие по крестику
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Закрытие по клику вне окна
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Инициализация календаря
  flatpickr("#datepicker", {
    minDate: "today",
    dateFormat: "Y-m-d"
  });

  // EmailJS
  emailjs.init("YOUR_USER_ID");

  // Обработка отправки формы
  document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const form = this;

    emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", form)
      .then(() => {
        form.reset();
        document.getElementById("successMessage").style.display = "block";
        setTimeout(() => {
          modal.style.display = "none";
          document.getElementById("successMessage").style.display = "none";
        }, 3000);
      })
      .catch(err => {
        alert("Ошибка при отправке: " + JSON.stringify(err));
      });
  });
});