document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("bookingModal");
  const closeBtn = document.querySelector(".close");

  // --- Открытие формы ---
  const openButton = document.getElementById("openBookingForm");
  if (openButton) {
    openButton.addEventListener("click", function () {
      modal.style.display = "block";
    });
  } else {
    console.error("Кнопка 'Забронировать' не найдена!");
  }

  // --- Закрытие формы по крестику ---
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  // --- Закрытие при клике вне окна ---
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // --- Инициализация календаря (flatpickr) ---
  const datePicker = document.getElementById("datepicker");
  if (datePicker) {
    flatpickr(datePicker, {
      minDate: "today",
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "F j, Y",
      inline: true,
      onChange: function (selectedDates, dateStr, instance) {
        console.log("Дата выбрана:", dateStr);
      }
    });
  } else {
    console.error("Поле даты не найдено!");
  }

  // --- Маска телефона без сторонних библиотек ---
  const phoneInput = document.querySelector("[name=phone]");
  if (phoneInput) {
    phoneInput.value = "+7 (___) ___-__-__"; // Начальное значение

    phoneInput.addEventListener("focus", function () {
      if (!this.value || this.value === "+7 (___) ___-__-__") {
        this.value = "+7 (";
      }
    });

    phoneInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, ""); // Оставляем только цифры
      let formattedValue = "+7 ("; // Базовая маска

      if (value.length > 1) {
        formattedValue += value.slice(1, 4); // 3 цифры после +
      }

      if (value.length >= 4) {
        formattedValue += ") " + value.slice(4, 7); // следующие 3
      }

      if (value.length >= 7) {
        formattedValue += "-" + value.slice(7, 9); // следующие 2
      }

      if (value.length >= 9) {
        formattedValue += "-" + value.slice(9, 11); // последние 2
      }

      this.value = formattedValue;

      // Автоматический курсор
      if (formattedValue.endsWith("(")) this.setSelectionRange(4, 4);
      else if (formattedValue.endsWith(") ")) this.setSelectionRange(6, 6);
      else if (formattedValue.endsWith("-")) this.setSelectionRange(formattedValue.length - 1, formattedValue.length - 1);
    });
  } else {
    console.error("Поле телефона не найдено!");
  }

  // --- EmailJS и отправка формы ---
  const form = document.getElementById("bookingForm");
  const successMessage = document.getElementById("successMessage");

  if (form) {
    emailjs.init("YOUR_USER_ID"); // Замени на свой USER ID

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Проверяем, есть ли все поля
      const name = form.querySelector("[name=name]");
      const email = form.querySelector("[name=email]");
      const phone = form.querySelector("[name=phone]");
      const date = form.querySelector("[name=date]");

      if (!name || !email || !phone || !date) {
        alert("Не все поля формы найдены!");
        return;
      }

      // Отправка через EmailJS
      emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", form)
        .then(() => {
          form.reset(); // Сброс формы
          document.getElementById("datepicker")._flatpickr.clear(); // Сброс календаря
          successMessage.style.display = "block";

          setTimeout(() => {
            modal.style.display = "none";
            successMessage.style.display = "none";
          }, 3000);
        })
        .catch(err => {
          alert("Ошибка при отправке: " + JSON.stringify(err));
        });
    });
  } else {
    console.error("Форма не найдена!");
  }
});
