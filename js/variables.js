import AdminCitas from "./classes/AdminCitas.js";
import { generarId } from "./funciones.js";

// Objeto de Cita
const citaObj = {
  id: generarId(),
  paciente: "",
  propietario: "",
  email: "",
  fecha: "",
  sintomas: "",
};

let editando = {
  value: false,
};

let DB = {
  value: null
};

const citas = new AdminCitas();

export { citaObj, editando, DB, citas };
