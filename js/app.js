const contenedor = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", () => {
  formulario.addEventListener("submit", buscarDatosClima);
});

function buscarDatosClima(e) {
  e.preventDefault();

  //Validacion

  const ciudad = document.querySelector("#ciudad").value;
  const pais = document.querySelector("#pais").value;

  if (ciudad === "" || pais === "") {
    mostrarError("Ambos campos son obligatorios");

    return;
  }

  //Consulta a la API

  consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
  const alerta = document.querySelector(".bg-red-100");

  if (!alerta) {
    const alerta = document.createElement("div");

    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-md",
      "mx-auto",
      "mt-6",
      "text-center"
    );

    alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}<span>
        
        `;
    contenedor.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }
}

function consultarAPI(ciudad, pais) {
  const appID = "14e05f4ea3e51817966cb2cfb2a2a0ee";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

  animacionCarga(); //Spinner de carga

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      limpiarHTML();

      if (datos.cod === "404") {
        mostrarError("Ciudad no encontrada");

        return;
      }

      //Mostrar resultados en el DOM

      mostrarRes(datos);
    });
}

function mostrarRes(datos) {
  console.log(datos);
  const {
    name,
    main: { temp, temp_max, temp_min },
  } = datos;

  const grCentigrados = kelvinACentigrados(temp);
  const grCentigradosMax = kelvinACentigrados(temp_max);
  const grCentigradosMin = kelvinACentigrados(temp_min);

  const nombreCiudad = document.createElement("p");
  nombreCiudad.textContent = `Clima en ${name}`;
  nombreCiudad.classList.add("font-bold", "text-4xl", "lugar");

  const tempActual = document.createElement("p");

  const tempMaxima = document.createElement("p");
  tempMaxima.innerHTML = `${grCentigradosMax} &#8451;`;

  const tempMinima = document.createElement("p");
  tempMinima.innerHTML = `${grCentigradosMin} &#8451;`;

  tempActual.innerHTML = `${grCentigrados} &#8451;`;
  tempActual.classList.add("font-bold", "text-6xl");

  tempMaxima.innerHTML = `MAX: ${grCentigradosMax} &#8451;`;
  tempMaxima.classList.add("text-xl");

  tempMinima.innerHTML = `MIN: ${grCentigradosMin} &#8451;`;
  tempMinima.classList.add("text-xl");

  const resultadoDiv = document.createElement("div");
  resultadoDiv.classList.add("text-center", "text-white");
  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(tempActual);
  resultadoDiv.appendChild(tempMaxima);
  resultadoDiv.appendChild(tempMinima);

  resultado.appendChild(resultadoDiv);
}

function kelvinACentigrados(grados) {
  return parseInt(grados - 273.15);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function animacionCarga() {

    limpiarHTML();

  const divAnimacion = document.createElement("div");
  divAnimacion.classList.add("spinner");

  divAnimacion.innerHTML = `
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
              `;

              resultado.appendChild(divAnimacion);
}
