document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("bookingModal");
  const closeBtn = document.querySelector(".close");

  // --- Открытие формы ---
  document.getElementById("openBookingForm").addEventListener("click", function () {
    modal.style.display = "block";
  });

  // --- Закрытие формы ---
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // --- Инициализация календаря (inline) ---
  flatpickr("#datepicker", {
    minDate: "today",
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "F j, Y",
    inline: true,
    onChange: function(selectedDates, dateStr, instance) {
      console.log("Дата выбрана:", dateStr);
    }
  });

  // --- Маска для телефона ---
  const phoneInputField = document.querySelector("[name=phone]");
  const phoneMask = new IMask(phoneInputField, {
    mask: "+{7} (000) 000-00-00"
  });

  // --- EmailJS отправка формы ---
  emailjs.init("YOUR_USER_ID");

  document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const form = this;

    emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", form)
      .then(() => {
        form.reset();
        phoneMask.unmask(); // Сброс маски
        phoneMask.masked.reformat(); // Перезапуск маски
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
