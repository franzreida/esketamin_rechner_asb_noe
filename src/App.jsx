
import { useState } from "react";

function roundToNearest(x, step = 0.1) {
  return Math.round(x / step) * step;
}

function getTargetVolume(totalMl) {
  const preferredSteps = [9, 6, 7.5, 4.5, 3]; // alle durch 3 teilbar
  for (let vol of preferredSteps) {
    if (vol >= totalMl) return vol;
  }
  return Math.ceil(totalMl * 10) / 10; // sonst auf volle 0.1 runden
}

export default function App() {
  const [weight, setWeight] = useState("");
  const [ampule, setAmpule] = useState("25mg5ml");
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    const kg = parseFloat(weight);
    if (isNaN(kg) || kg <= 0) return;

    const doseMgPerKg = 0.125;
    const doseMg = roundToNearest(kg * doseMgPerKg, 0.01);
    const totalDoseMg = roundToNearest(doseMg * 3, 0.01);

    let concentration = 5;
    if (ampule === "50mg2ml" || ampule === "250mg10ml") concentration = 25;

    const totalMl = roundToNearest(totalDoseMg / concentration, 0.01);
    const targetVol = getTargetVolume(totalMl);
    const nacl = roundToNearest(targetVol - totalMl, 0.01);
    const volPerDose = roundToNearest(targetVol / 3, 0.01);

    const syringe =
      targetVol <= 5 ? "5 ml Spritze" : targetVol <= 10 ? "10 ml Spritze" : "20 ml Spritze";

    const midazolam = kg < 50 ? "1 mg i.v." : "2 mg i.v.";

    setResults({
      kg,
      doseMg,
      totalDoseMg,
      concentration,
      totalMl,
      targetVol,
      nacl,
      volPerDose,
      syringe,
      midazolam,
    });
  };

  return (
    <div className="max-w-md mx-auto mt-6 px-4 py-6 rounded-2xl shadow-xl bg-white space-y-6 sm:px-6 sm:mt-10 text-sm sm:text-base">
      <h1 className="text-2xl font-bold text-center">sKetamin Berechnung ASB</h1>

      <div>
        <label className="block font-medium mb-1">Körpergewicht (kg)</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <p className="font-medium">Esketamin-Ampulle:</p>
        {["25mg5ml", "50mg2ml", "250mg10ml"].map((val) => (
          <label key={val} className="block">
            <input
              type="radio"
              name="ampule"
              value={val}
              checked={ampule === val}
              onChange={(e) => setAmpule(e.target.value)}
            />{" "}
            {val === "25mg5ml"
              ? "25 mg / 5 ml (5 mg/ml)"
              : val === "50mg2ml"
              ? "50 mg / 2 ml (25 mg/ml)"
              : "250 mg / 10 ml (25 mg/ml)"}
          </label>
        ))}
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Berechnen
      </button>

      {results && (
        <div className="mt-6 space-y-2 text-sm">
          <p><strong>Midazolam-Dosis:</strong> {results.midazolam}</p>
          <hr />
          <p><strong>Gesamtdosis Esketamin:</strong> {results.totalDoseMg} mg</p>
          <p><strong>Benötigtes Ketanest-Volumen:</strong> {results.totalMl} ml (konz. {results.concentration} mg/ml)</p>
          <p><strong>Verdünnen mit NaCl:</strong> + {results.nacl} ml</p>
          <p><strong>Endvolumen:</strong> {results.targetVol} ml → {results.volPerDose} ml je Gabe (3×)</p>
          <p><strong>Geben aus:</strong> {results.syringe}</p>
          <hr />
          <p><strong>Vorgehen:</strong></p>
          <ul className="list-disc pl-6">
            <li>Esketamin exakt mit Feindosierspritze (0,1 ml) aufziehen</li>
            <li>Mehrfaches Aufziehen erlaubt</li>
            <li>In {results.syringe} über Dreiwegehahn + NaCl auf Gesamtvolumen bringen</li>
            <li>Gabe aus dieser Spritze in 3 gleichen Portionen à {results.volPerDose} ml</li>
          </ul>
        </div>
      )}
    
<p className="text-xs text-gray-500 mt-6">
  Diese Berechnung basiert auf dem offiziellen Esketamin-Algorithmus des ASB Österreich <br />
  (<a href="https://sani.samariterbund.net" target="_blank" className="underline">sani.samariterbund.net</a>, Stand: 07.05.2025 – 16:24 Uhr).<br />
  Die Nutzung der App erfolgt ausschließlich auf eigene Verantwortung. Der Autor übernimmt keine Haftung für medizinische Entscheidungen, Dosierungsfehler oder unerwünschte Ereignisse, die durch die Anwendung der bereitgestellten Daten entstehen könnten.
</p>

</div>
  );
}
