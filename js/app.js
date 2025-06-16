const formulario = document.querySelector("#formulario-cita");
const formularioSubmit = formulario.querySelector('input[type="submit"]');

const pacienteInput = document.querySelector("#paciente");
const propietarioInput = document.querySelector("#propietario");
const emailInput = document.querySelector("#email");
const fechaInput = document.querySelector("#fecha");
const sintomasInput = document.querySelector("#sintomas");

const containerCitas = document.querySelector("#citas");

const modal = document.getElementById("modal");
const confirmBtn = document.querySelector("#confirmModalBtn");
const cancelBtn = document.getElementById("cancelModalBtn");
const backdrop = document.getElementById("modalBackdrop");

// Objeto de Cita
const citaObj = {
  id: generarId(),
  paciente: "",
  propietario: "",
  email: "",
  fecha: "",
  sintomas: "",
};

let editando = false;

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

// Clases
class Notificacion {
  constructor({ texto, tipo }) {
    this.texto = texto;
    this.tipo = tipo;

    this.mostrar();
  }

  mostrar() {
    // eliminar notificaciones previas
    const alertaPrevia = document.querySelector(".alert");
    alertaPrevia?.remove();
    // crear notificación
    const alerta = document.createElement("DIV");
    alerta.classList.add(
      "text-center",
      "w-full",
      "p-3",
      "text-white",
      "my-5",
      "alert",
      "uppercase",
      "font-bold",
      "text-sm"
    );

    this.tipo === "error"
      ? alerta.classList.add("bg-red-500")
      : alerta.classList.add("bg-green-500");

    alerta.textContent = this.texto;

    formulario.parentElement.insertBefore(alerta, formulario);
    // eliminar despues de 3seg
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

class AdminCitas {
  constructor() {
    this.citas = [];
  }

  agregar(cita) {
    this.citas = [...this.citas, cita];
    this.mostrar();
  }

  mostrar() {
    // Limpiar HTML
    while (containerCitas.firstChild) {
      containerCitas.removeChild(containerCitas.firstChild);
    }

    // Validar si hay citas
    if (this.citas.length <= 0) {
      containerCitas.innerHTML =
        '<p class="text-xl mt-5 mb-10 text-center">No Hay Pacientes</p>';
      return;
    }

    // Mostrar citas
    this.citas.forEach((cita) => {
      const divCita = document.createElement("DIV");
      divCita.classList.add(
        "mx-5",
        "my-10",
        "bg-white",
        "shadow-md",
        "px-5",
        "py-10",
        "rounded-xl"
      );

      const paciente = document.createElement("P");
      paciente.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      paciente.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${cita.paciente}`;

      const propietario = document.createElement("p");
      propietario.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      propietario.innerHTML = `<span class="font-bold uppercase">Propietario: </span> ${cita.propietario}`;

      const email = document.createElement("p");
      email.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      email.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${cita.email}`;

      const fecha = document.createElement("p");
      fecha.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      fecha.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${cita.fecha}`;

      const sintomas = document.createElement("p");
      sintomas.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      sintomas.innerHTML = `<span class="font-bold uppercase">Síntomas: </span> ${cita.sintomas}`;

      // Botones acciones
      const contenedorBotones = document.createElement("DIV");
      contenedorBotones.classList.add("flex", "justify-between", "flex-wrap", "gap-2", "mt-10");

      const btnEditar = document.createElement("button");
      btnEditar.classList.add(
        "py-2",
        "px-10",
        "bg-indigo-600",
        "hover:bg-indigo-700",
        "text-white",
        "font-bold",
        "uppercase",
        "rounded-lg",
        "flex",
        "items-center",
        "gap-2"
      );
      btnEditar.innerHTML =
        'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';

      const clone = structuredClone(cita);
      btnEditar.onclick = () => cargarEdicion(clone);

      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add(
        "py-2",
        "px-10",
        "bg-red-600",
        "hover:bg-red-700",
        "text-white",
        "font-bold",
        "uppercase",
        "rounded-lg",
        "flex",
        "items-center",
        "gap-2"
      );
      btnEliminar.innerHTML =
        'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      btnEliminar.onclick = () => {
        openModal();

        confirmBtn.onclick = () => {
          this.eliminar(cita.id);
          closeModal();
        };
      };

      contenedorBotones.appendChild(btnEditar);
      contenedorBotones.appendChild(btnEliminar);

      // agrega al HTML
      divCita.appendChild(paciente);
      divCita.appendChild(propietario);
      divCita.appendChild(email);
      divCita.appendChild(fecha);
      divCita.appendChild(sintomas);
      divCita.appendChild(contenedorBotones);

      containerCitas.appendChild(divCita);
    });
  }

  editar(citaActualizada) {
    this.citas = this.citas.map((cita) =>
      cita.id === citaActualizada.id ? citaActualizada : cita
    );
    this.mostrar();
  }

  eliminar(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id);
    this.mostrar();

    new Notificacion({
      texto: "Registro Eliminado",
      tipo: "error",
    });
  }
}

const citas = new AdminCitas();

// Funciones
function datosCita(e) {
  citaObj[e.target.name] = e.target.value;
  //   console.log(citaObj);
}

function submitCita(e) {
  e.preventDefault();
  // validar campos
  if (Object.values(citaObj).some((valor) => valor.trim() === "")) {
    new Notificacion({
      texto: "Todos los campos son obligatorios",
      tipo: "error",
    });
    return;
  }

  if (editando) {
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
  editando = false;
}

function reiniciarObjetoCita() {
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

function cargarEdicion(cita) {
  // console.log(cita);
  Object.assign(citaObj, cita);

  pacienteInput.value = cita.paciente;
  propietarioInput.value = cita.propietario;
  emailInput.value = cita.email;
  fechaInput.value = cita.fecha;
  sintomasInput.value = cita.sintomas;

  editando = true;

  formularioSubmit.value = "Guardar Cambios";
}

function generarId() {
  return Math.random().toString(36).substring(2) + Date.now();
}

// Mostrar el modal
function openModal() {
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
function closeModal() {
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
