/* import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBUuUkhSfcJ-HOihR5PZNfdsQSD4vZmHVU",
});

//configuracion de la api de gemini

alert("pochoclo");
//obtener elementos para el dom
const generarBtn = document.getElementById("generarBtn");
const titularesSpan = document.getElementById("titulares-span");
const descripcionesSpan = document.getElementById("descripciones-span");
const imagenGenerada = document.getElementById("imagen-generada");

generarBtn.addEventListener("click", () => console.log("pochoclo"));
//prompt para la IA
const promptTexto = `
Actuá como un modelador de información experto en gramática, lingüística y comunicación.
Aplicá las funciones del lenguaje de Jakobson, en especial la función fática.

Analizá y devolvé en formato estructurado:
- Emisor
- Receptor
- Referente
- Función predominante (Jakobson)
- Tonalidad / Expresión detectada
- Reformulación empática y clara, adecuada para un mail a cliente
`;
const promptImagen = `
Una ilustración minimalista de un correo electrónico profesional,
mostrando empatía y comunicación clara entre una empresa y su cliente.
Colores suaves, estilo corporativo moderno.
`;

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "",
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    },
  });
  console.log(response.text);
}

main(); */

/* generarBtn.addEventListener("click", async () => {
  debugger;
  try {
    generarBtn.disabled = true;
    generarBtn.textContent = "Generando...";
    const modeloTexto = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const resultadoTexto = await modeloTexto.generateContent(promptTexto);
    const respuestaTexto = await resultadoTexto.response.text();
    const datosTexto = JSON.parse(respuestaTexto);
    //generar la imagen

    const modeloImagen = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-image",
    });
    const resultadoImagen = await modeloImagen.generateContent(promptImagen);
    const urlImagen = await resultadoImagen.response.images[0].url;
    titularesSpan.textContent = datosTexto.titulares.join(" | ");
    imagenGenerada.src = urlImagen;
    imagenGenerada.style.display = "block";
  } catch {
    console.error("error al generar el contenido");
    alert("exploto todo al carajo");
  } finally {
    generarBtn.disabled = false;
    generarBtn.textContent = "generar contenido";
  }
}); */

import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBWIK6hjNPDVUUOWBoqXFZ4EUJdm9gmHH0");

// DOM
/* DOM CINEMATICA */
const splash = document.getElementById("splash");
const video = document.getElementById("splash-video");
const skipBtn = document.getElementById("skip-btn");
/* DOM CINEMATICA */
/* DOM APP */
const generarBtn = document.getElementById("generarBtn");
const generarImgBtn = document.createElement("button");
generarImgBtn.textContent = "Generar Imagen";
generarImgBtn.className = "btn secondary";
document.querySelector(".acciones").appendChild(generarImgBtn);
const userInput = document.getElementById("userInput");
const textoReformulado = document.getElementById("textoReformulado");
const introScreen = document.getElementById("intro-screen");
const app = document.getElementById("app");
const startBtn = document.getElementById("startBtn");
const instructivoBtn = document.getElementById("instructivoBtn");
const reutilizablesBtn = document.getElementById("reutilizablesBtn");
const reutilizablesSection = document.getElementById("reutilizables");
const listaReutilizables = document.getElementById("listaReutilizables");
const volverBtn = document.getElementById("volverBtn");
const guardarBtn = document.getElementById("guardarBtn");
const limpiarBtn = document.getElementById("limpiarBtn");
/* DOM APP */
/* FUNCION CINEMATICA */
function logoCinematica() {
  splash.classList.add("fade-out");
  setTimeout(() => {
    splash.remove();
    app.hidden = false;
  }, 800); // coincide con la duración de la animación CSS
}
/* FUNCION CINEMATICA */

let ultimaRespuesta = "";
reutilizablesSection.style.display = "none";
// Generar texto
async function generarTexto(textoUsuario) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Analizá y reformulá este texto para que sea empático, claro y profesional. No debes responder como si te hablaran a vos, sos solo un medium de interpretación y traducción:

"${textoUsuario}"

Devolvé SOLO la reformulación.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const texto = response.text().trim();

    ultimaRespuesta = texto;
    textoReformulado.textContent = texto;
  } catch (error) {
    console.error(error);
    textoReformulado.textContent = "⚠️ Error generando reformulación.";
  }
}

// --- Generar imagen ---
async function generarImagen() {
  if (!ultimaRespuesta) {
    Swal.fire("⚠️ Primero generá una reformulación antes de la imagen.");
    return;
  }

  try {
    const model = aiImage.getGenerativeModel({
      model: "imagen-3.0-generate-002",
    });

    const prompt = `
Crea una representación visual clara, moderna y conceptual que muestre la relación entre:
- Texto original: "${userInput.value}"
- Reformulación: "${ultimaRespuesta}"

Puede ser un cuadro comparativo, mapa conceptual o esquema gráfico atractivo.
    `;

    const result = await model.generateImage(prompt);
    const imgData =
      result.response.candidates[0].content.parts[0].inlineData.data;

    imagenGenerada.innerHTML = `
      <h3>Imagen generada:</h3>
      <img src="data:image/png;base64,${imgData}" alt="Imagen IA" style="max-width:100%; border-radius:12px; margin-top:1rem;"/>
    `;
  } catch (error) {
    console.error(error);
    imagenGenerada.innerHTML = "<p>⚠️ Error generando la imagen.</p>";
  }
}

// Guardar en localStorage
function guardarRespuesta() {
  if (!ultimaRespuesta) return;
  let respuestas = JSON.parse(localStorage.getItem("respuestas")) || [];
  respuestas.push({
    texto: ultimaRespuesta,
    fecha: new Date().toLocaleString(),
  });
  localStorage.setItem("respuestas", JSON.stringify(respuestas));
  Swal.fire("✅ Guardado", "La respuesta se guardó correctamente.", "success");
}
function eliminarRespuesta(index) {
  let respuestas = JSON.parse(localStorage.getItem("respuestas")) || [];
  respuestas.splice(index, 1);
  localStorage.setItem("respuestas", JSON.stringify(respuestas));
  mostrarReutilizables();
  Swal.fire("🗑️ Eliminado", "La respuesta fue eliminada.", "success");
}

// Mostrar respuestas reutilizables
function mostrarReutilizables() {
  listaReutilizables.innerHTML = "";
  const respuestas = JSON.parse(localStorage.getItem("respuestas")) || [];

  if (respuestas.length === 0) {
    listaReutilizables.innerHTML = "<p>No hay respuestas guardadas aún.</p>";
    return;
  }

  respuestas.forEach((r, index) => {
    const card = document.createElement("div");
    card.className = "respuesta-card";
    card.innerHTML = `
      <p>${r.texto}</p>
      <small>${r.fecha}</small>
      <button class="btn danger eliminar-btn" data-index="${index}">Eliminar</button>
    `;
    listaReutilizables.appendChild(card);
  });

  // 🔑 Reasignar eventos a los botones recién creados
  document.querySelectorAll(".eliminar-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");

      Swal.fire({
        title: "¿Eliminar respuesta?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((res) => {
        if (res.isConfirmed) {
          eliminarRespuesta(index);
        }
      });
    });
  });
}

// Eventos
video.addEventListener("ended", logoCinematica);
skipBtn.addEventListener("click", logoCinematica);
generarBtn.addEventListener("click", () => {
  const textoUsuario = userInput.value.trim();
  if (textoUsuario) generarTexto(textoUsuario);
});

guardarBtn.addEventListener("click", guardarRespuesta);

generarImgBtn.addEventListener("click", generarImagen);

limpiarBtn.addEventListener("click", () => {
  if (ultimaRespuesta) {
    Swal.fire({
      title: "¿Guardar antes de limpiar?",
      text: "Si no guardás, perderás esta respuesta.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "No, limpiar",
    }).then((res) => {
      if (res.isConfirmed) {
        guardarRespuesta();
        limpiarCampos();
      } else if (res.dismiss === Swal.DismissReason.cancel) {
        limpiarCampos();
      }
    });
  } else {
    limpiarCampos();
  }
});

function limpiarCampos() {
  userInput.value = "";
  textoReformulado.textContent = "";
  ultimaRespuesta = "";
}

startBtn.addEventListener("click", () => {
  introScreen.style.display = "none";
  app.classList.remove("hidden");
});

instructivoBtn.addEventListener("click", () => {
  app.classList.add("hidden");
  reutilizablesSection.classList.add("hidden");
  introScreen.style.display = "flex";
});

reutilizablesBtn.addEventListener("click", () => {
  app.classList.add("hidden");
  introScreen.style.display = "none";
  reutilizablesSection.style.display = "";
  reutilizablesSection.classList.remove("hidden");
  mostrarReutilizables();
});

volverBtn.addEventListener("click", () => {
  reutilizablesSection.style.display = "none";
  reutilizablesSection.classList.add("hidden");
  app.classList.remove("hidden");
});
