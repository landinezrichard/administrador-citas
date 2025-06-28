import Notificacion from "./classes/Notificacion.js";
import { citaObj, editando, DB, citas } from "./variables.js";
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

    // Actualizar registro en indexedDB
    const transaction = DB.value.transaction(["citas"], "readwrite");
    const objectStore = transaction.objectStore("citas");

    objectStore.put(citaObj);

    transaction.oncomplete = () => {
      new Notificacion({
        texto: "Registro Actualizado",
        tipo: "exito",
      });
    };

    transaction.onerror = () => {
      new Notificacion({
        texto: "Error al actualizar el registro",
        tipo: "error",
      });
    };
  } else {
    // Insertar registro en indexedDB
    const transaction = DB.value.transaction(["citas"], "readwrite");

    // Habilitar el objectStore
    const objectStore = transaction.objectStore("citas");

    // Insertar en la BD
    objectStore.add(citaObj);

    transaction.oncomplete = () => {
      // console.log("Cita agregada a la base de datos");

      // mostrar notificacion
      new Notificacion({
        texto: "Paciente Registrado",
        tipo: "exito",
      });
    };
  }
  citas.mostrar();
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

// Crear Base de datos
export function crearDB() {
  //Crear base de datos version 1.0
  const crearDB = window.indexedDB.open("citas", 1);

  // Si hay un error
  crearDB.onerror = function () {
    console.log("Hubo un error a la hora de crear la BD");
  };

  // Si se creo bien
  crearDB.onsuccess = function () {
    console.log("Base de datos creada!!!");

    DB.value = crearDB.result;

    // Mostrar citas cuando indexedDB esté listo
    citas.mostrar();
  };

  // Definir Schema
  crearDB.onupgradeneeded = function (e) {
    const db = e.target.result;

    const objectStore = db.createObjectStore("citas", {
      keyPath: "id",
      autoIncrement: true,
    });

    // Definir las columnas
    objectStore.createIndex("paciente", "paciente", { unique: false });
    objectStore.createIndex("propietario", "propietario", { unique: false });
    objectStore.createIndex("email", "email", { unique: false });
    objectStore.createIndex("fecha", "fecha", { unique: false });
    objectStore.createIndex("sintomas", "sintomas", { unique: false });
    objectStore.createIndex("id", "id", { unique: true });

    console.log("DB creada y lista!!!");
  };
}
