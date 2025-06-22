// getGrowthStage.jsx
const getGrowthStage = (days) => {
  if (days <= 5.5) return "Initial Stage";
  if (days <= 26.2) return "Rapid Growth Stage";
  return "Senescent Stage (May Harvest)";
};

export default getGrowthStage;
