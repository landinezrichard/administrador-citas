import { formulario } from "../selectores.js";

export default class Notificacion {
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
