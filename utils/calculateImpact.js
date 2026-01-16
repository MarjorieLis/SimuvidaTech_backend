// backend/utils/calculateImpact.js
const MATERIAL_IMPACT = {
  // Valores por kg de material (CO₂ kg, Agua L, RAEE kg)
  vidrio: { co2: 0.5, water: 15, raee: 0.1 },
  aluminio: { co2: 8.0, water: 100, raee: 0.5 },
  plastico: { co2: 2.0, water: 50, raee: 0.3 },
  cobre: { co2: 4.0, water: 80, raee: 0.4 },
  hierro: { co2: 1.5, water: 30, raee: 0.2 },
  oro: { co2: 20.0, water: 200, raee: 1.0 },
  plata: { co2: 15.0, water: 150, raee: 0.8 }
};

function calculateImpact(materials, type) {
  const materialsList = materials.toLowerCase().split(',').map(m => m.trim());
  
  let totalCo2 = 0;
  let totalWater = 0;
  let totalRaee = 0;

  // Peso estimado por tipo de dispositivo
  const baseWeight = type === 'telefono' ? 0.2 : 2.0; // kg
  const materialCount = materialsList.length || 1;
  const weightPerMaterial = baseWeight / materialCount;

  materialsList.forEach(material => {
    const impact = MATERIAL_IMPACT[material] || { co2: 1.0, water: 20, raee: 0.1 };
    totalCo2 += impact.co2 * weightPerMaterial;
    totalWater += impact.water * weightPerMaterial;
    totalRaee += impact.raee * weightPerMaterial;
  });

  return {
    co2_impact: parseFloat(totalCo2.toFixed(2)),
    water_impact: parseFloat(totalWater.toFixed(2)),
    raee_impact: parseFloat(totalRaee.toFixed(2))
  };
}

module.exports = { calculateImpact };