// --- État de l'application -------------------------------------------------

/** Liste brute de tous les noms chargés, avec leur source (fichier ou saisie). */
let personnes = []; // [{ nom, source }]
let dernierTirage = [];

// --- Éléments DOM ------------------------------------------------------------

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileListEl = document.getElementById("fileList");
const tallyCount = document.getElementById("tallyCount");
const clearAllBtn = document.getElementById("clearAll");
const allowDuplicates = document.getElementById("allowDuplicates");

const pasteArea = document.getElementById("pasteArea");
const addPastedBtn = document.getElementById("addPasted");

const drawCountInput = document.getElementById("drawCount");
const drawBtn = document.getElementById("drawBtn");
const drawWarning = document.getElementById("drawWarning");

const resultsSection = document.getElementById("resultsSection");
const resultsList = document.getElementById("resultsList");
const downloadBtn = document.getElementById("downloadBtn");
const redrawBtn = document.getElementById("redrawBtn");

// --- Import de fichiers ------------------------------------------------------

dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

["dragenter", "dragover"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  })
);
["dragleave", "drop"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
  })
);

dropzone.addEventListener("drop", (e) => {
  const fichiers = Array.from(e.dataTransfer.files).filter((f) =>
    f.name.toLowerCase().endsWith(".txt")
  );
  traiterFichiers(fichiers);
});

fileInput.addEventListener("change", (e) => {
  traiterFichiers(Array.from(e.target.files));
  fileInput.value = "";
});

function traiterFichiers(fichiers) {
  fichiers.forEach((fichier) => {
    const reader = new FileReader();
    reader.onload = () => {
      const noms = reader.result
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      noms.forEach((nom) => personnes.push({ nom, source: fichier.name }));

      const li = document.createElement("li");
      li.textContent = `${fichier.name} — ${noms.length} nom(s)`;
      fileListEl.appendChild(li);

      rafraichirEtat();
    };
    reader.readAsText(fichier, "utf-8");
  });
}

// --- Saisie manuelle ----------------------------------------------------------

addPastedBtn.addEventListener("click", () => {
  const noms = pasteArea.value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (noms.length === 0) return;

  noms.forEach((nom) => personnes.push({ nom, source: "saisie manuelle" }));

  const li = document.createElement("li");
  li.textContent = `Saisie manuelle — ${noms.length} nom(s)`;
  fileListEl.appendChild(li);

  pasteArea.value = "";
  rafraichirEtat();
});

// --- Effacer tout ---------------------------------------------------------

clearAllBtn.addEventListener("click", () => {
  personnes = [];
  fileListEl.innerHTML = "";
  rafraichirEtat();
  masquerResultats();
});

// --- Mise à jour de l'état / compteur -----------------------------------------

function listeEffective() {
  const noms = personnes.map((p) => p.nom);
  return allowDuplicates.checked ? noms : Array.from(new Set(noms));
}

function rafraichirEtat() {
  const total = listeEffective().length;
  tallyCount.textContent = total;
  clearAllBtn.hidden = personnes.length === 0;
  drawBtn.disabled = total === 0;
  drawWarning.hidden = true;
}

allowDuplicates.addEventListener("change", rafraichirEtat);

// --- Tirage au sort -------------------------------------------------------

drawBtn.addEventListener("click", () => {
  const disponibles = listeEffective();
  let nombre = parseInt(drawCountInput.value, 10) || 0;

  if (nombre <= 0) {
    drawWarning.textContent = "Indiquez un nombre supérieur à 0.";
    drawWarning.hidden = false;
    return;
  }

  if (nombre > disponibles.length) {
    drawWarning.textContent = `Seulement ${disponibles.length} participant(s) disponible(s) : tout le monde sera tiré.`;
    drawWarning.hidden = false;
    nombre = disponibles.length;
  } else {
    drawWarning.hidden = true;
  }

  dernierTirage = tirerAuSort(disponibles, nombre);
  afficherResultats(dernierTirage);
});

function tirerAuSort(liste, nombre) {
  const copie = [...liste];
  const gagnants = [];
  for (let i = 0; i < nombre; i++) {
    const index = Math.floor(Math.random() * copie.length);
    gagnants.push(copie.splice(index, 1)[0]);
  }
  return gagnants;
}

function afficherResultats(gagnants) {
  resultsList.innerHTML = "";
  gagnants.forEach((nom, i) => {
    const li = document.createElement("li");
    li.textContent = nom;
    li.style.animationDelay = `${i * 90}ms`;
    resultsList.appendChild(li);
  });
  resultsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function masquerResultats() {
  resultsSection.hidden = true;
  resultsList.innerHTML = "";
}

redrawBtn.addEventListener("click", masquerResultats);

// --- Export du résultat -----------------------------------------------------

downloadBtn.addEventListener("click", () => {
  const contenu = dernierTirage.join("\n");
  const blob = new Blob([contenu], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resultat_tirage.txt";
  a.click();
  URL.revokeObjectURL(url);
});

rafraichirEtat();

// --- Enregistrement du service worker (PWA hors ligne) -----------------------

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      // L'app fonctionne aussi sans service worker, juste sans mode hors-ligne.
    });
  });
}
