import Notificacion from "./Notificacion.js";
import { containerCitas, confirmBtn } from "../selectores.js";
import { cargarEdicion, closeModal, openModal } from "../funciones.js";
import { DB } from "../variables.js";

export default class AdminCitas {
  constructor() {
    this.citas = [];
  }

  mostrar() {
    // Limpiar HTML
    while (containerCitas.firstChild) {
      containerCitas.removeChild(containerCitas.firstChild);
    }

    // Leer citas de indexedDB
    const objectStore = DB.value.transaction("citas").objectStore("citas");

    // Validar si hay citas
    const totalCitas = objectStore.count();
    totalCitas.onsuccess = (e) => {
      // console.log(`Total de citas: ${e.target.result}`);
      if (e.target.result === 0) {
        containerCitas.innerHTML =
          '<p class="text-xl mt-5 mb-10 text-center">No Hay Pacientes</p>';
        return;
      }
    };

    // Recorrer registros
    objectStore.openCursor().onsuccess = (e) => {
      const cursor = e.target.result;
      // console.log(cursor);

      if (cursor) {
        const { paciente, propietario, email, fecha, sintomas, id } =
          cursor.value;

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

        const pacienteParrafo = document.createElement("P");
        pacienteParrafo.classList.add(
          "font-normal",
          "mb-3",
          "text-gray-700",
          "normal-case"
        );
        pacienteParrafo.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${paciente}`;

        const propietarioParrafo = document.createElement("p");
        propietarioParrafo.classList.add(
          "font-normal",
          "mb-3",
          "text-gray-700",
          "normal-case"
        );
        propietarioParrafo.innerHTML = `<span class="font-bold uppercase">Propietario: </span> ${propietario}`;

        const emailParrafo = document.createElement("p");
        emailParrafo.classList.add(
          "font-normal",
          "mb-3",
          "text-gray-700",
          "normal-case"
        );
        emailParrafo.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${email}`;

        const fechaParrafo = document.createElement("p");
        fechaParrafo.classList.add(
          "font-normal",
          "mb-3",
          "text-gray-700",
          "normal-case"
        );
        fechaParrafo.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${fecha}`;

        const sintomasParrafo = document.createElement("p");
        sintomasParrafo.classList.add(
          "font-normal",
          "mb-3",
          "text-gray-700",
          "normal-case"
        );
        sintomasParrafo.innerHTML = `<span class="font-bold uppercase">Síntomas: </span> ${sintomas}`;

        // Botones acciones
        const contenedorBotones = document.createElement("DIV");
        contenedorBotones.classList.add(
          "flex",
          "justify-between",
          "flex-wrap",
          "gap-2",
          "mt-10"
        );

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

        const clone = structuredClone(cursor.value);
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
            this.eliminar(id);
            closeModal();
          };
        };

        contenedorBotones.appendChild(btnEditar);
        contenedorBotones.appendChild(btnEliminar);

        // agrega al HTML
        divCita.appendChild(pacienteParrafo);
        divCita.appendChild(propietarioParrafo);
        divCita.appendChild(emailParrafo);
        divCita.appendChild(fechaParrafo);
        divCita.appendChild(sintomasParrafo);
        divCita.appendChild(contenedorBotones);

        containerCitas.appendChild(divCita);

        // Ir al siguiente elemento
        cursor.continue();
      }
    };
  }

  eliminar(id) {
    const transaction = DB.value.transaction(["citas"], "readwrite");
    const objectStore = transaction.objectStore("citas");

    objectStore.delete(id);

    transaction.oncomplete = () => {
      // console.log("Registro eliminado");
      new Notificacion({
        texto: "Registro Eliminado",
        tipo: "error",
      });
    };

    transaction.onerror = () => {
      // console.log("Error al eliminar el registro");
      new Notificacion({
        texto: "Error al eliminar el registro",
        tipo: "error",
      });
    };

    this.mostrar();
  }
}
