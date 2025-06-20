import AdminCitas from "./classes/AdminCitas.js";
import Notificacion from "./classes/Notificacion.js";
import { citaObj, editando } from "./variables.js";
import {
  backdrop,
  formulario,
  formularioSubmit,
  pacienteInput,
  propietarioInput,
  emailInput,
  fechaInput,
  sintomasInput,
  modal,
} from "./selectores.js";

const citas = new AdminCitas();

// Funciones
export function datosCita(e) {
  citaObj[e.target.name] = e.target.value;
  //   console.log(citaObj);
}

export function submitCita(e) {
  e.preventDefault();
  // validar campos
  if (Object.values(citaObj).some((valor) => valor.trim() === "")) {
    new Notificacion({
      texto: "Todos los campos son obligatorios",
      tipo: "error",
    });
    return;
  }

  if (editando.value) {
    // console.log("Editando registro");
    citas.editar({ ...citaObj });
    new Notificacion({
      texto: "Registro Actualizado",
      tipo: "exito",
    });
  } else {
    // Se agrega copia del objeto o sino sobre-escribe la info del paciente anterior
    citas.agregar({ ...citaObj });
    // mostrar notificacion
    new Notificacion({
      texto: "Paciente Registrado",
      tipo: "exito",
    });
  }
  //reiniciar form y objeto
  formulario.reset();
  reiniciarObjetoCita();
  formularioSubmit.value = "Registrar Paciente";
  editando.value = false;
}

export function reiniciarObjetoCita() {
  // citaObj.paciente = "";
  // citaObj.propietario = "";
  // citaObj.email = "";
  // citaObj.fecha = "";
  // citaObj.sintomas = "";

  // Lo anterior es equivalente a:
  Object.assign(citaObj, {
    id: generarId(),
    paciente: "",
    propietario: "",
    email: "",
    fecha: "",
    sintomas: "",
  });
}

export function cargarEdicion(cita) {
  // console.log(cita);
  Object.assign(citaObj, cita);

  pacienteInput.value = cita.paciente;
  propietarioInput.value = cita.propietario;
  emailInput.value = cita.email;
  fechaInput.value = cita.fecha;
  sintomasInput.value = cita.sintomas;

  editando.value = true;

  formularioSubmit.value = "Guardar Cambios";
}

export function generarId() {
  return Math.random().toString(36).substring(2) + Date.now();
}

// Mostrar el modal
export function openModal() {
  modal.classList.remove("hidden");
  // Fuerza reflow para que las clases de transición se apliquen correctamente
  requestAnimationFrame(() => {
    // Mostrar backdrop
    backdrop.classList.remove("opacity-0");
    backdrop.classList.add("opacity-100");

    // Mostrar panel
    const panel = document.getElementById("modalPanel");
    panel.classList.remove("opacity-0", "scale-95");
    panel.classList.add("opacity-100", "scale-100");
  });
}

// Ocultar el modal
export function closeModal() {
  // Ocultar backdrop
  backdrop.classList.remove("opacity-100");
  backdrop.classList.add("opacity-0");

  // Ocultar panel
  const panel = document.getElementById("modalPanel");
  panel.classList.remove("opacity-100", "scale-100");
  panel.classList.add("opacity-0", "scale-95");

  // Esperar que termine la animación para ocultar el modal
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 300); // Debe coincidir con `duration-300`
}
