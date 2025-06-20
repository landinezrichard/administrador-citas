import {
  formulario,
  pacienteInput,
  propietarioInput,
  emailInput,
  fechaInput,
  sintomasInput,
  modal,
  cancelBtn,
} from "./selectores.js";

import { datosCita, submitCita, closeModal } from "./funciones.js";

// Eventos
pacienteInput.addEventListener("change", datosCita);
propietarioInput.addEventListener("change", datosCita);
emailInput.addEventListener("change", datosCita);
fechaInput.addEventListener("change", datosCita);
sintomasInput.addEventListener("change", datosCita);

formulario.addEventListener("submit", submitCita);

cancelBtn.addEventListener("click", closeModal);
// backdrop.addEventListener('click', closeModal);
modal.addEventListener("click", (e) => {
  const dialogPanel = modal.querySelector("#modalPanel");
  if (!dialogPanel.contains(e.target)) {
    closeModal();
  }
});
