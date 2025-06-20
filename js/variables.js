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

export { citaObj, editando };
