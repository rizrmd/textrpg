export const generateEquipmentImageUrl = (item: string): string => {
  const safeItem = item || "Sword";
  const prompt = `an icon of ${safeItem}, centered, no cropping`;
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://pollinations.ai/p/${encodedPrompt}?width=256&height=256&nologo=true`;
};

export const generateLootImageUrl = (item: string): string => {
  const safeItem = item || "Sword";
  const prompt = `an icon of ${safeItem}, centered, no cropping`;
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://pollinations.ai/p/${encodedPrompt}?width=256&height=256&nologo=true`;
};

export const rarityColor = (rarity: string) => {
  switch (rarity) {
    case "Common":
      return "text-gray-400";
    case "Uncommon":
      return "text-green-400";
    case "Rare":
      return "text-blue-400";
    case "Epic":
      return "text-purple-400";
    default:
      return "text-white";
  }
};

export const getEquipmentDetails = (item?: string) => {
  if (!item) return "No equipment";
  // Equipment items
  if (item.includes("Sword")) return "+2 Attack";
  if (item.includes("Bow")) return "+3 Attack";
  if (item.includes("Dagger")) return "+2 Attack";
  if (item.includes("Shield")) return "+2 Defense";
  if (item.includes("Armor")) return "+20 Max HP";
  if (item.includes("Helmet")) return "+1 Defense";
  if (item.includes("Boots")) return "+1 Defense";
  if (item.includes("Ring")) return "+1 Attack";
  if (item.includes("Amulet")) return "+1 Defense";
  // Consumable items
  if (item.includes("Health Potion")) return "Restores 50 HP when used";
  if (item.includes("Mana Potion")) return "Restores 30 MP when used";
  if (item.includes("Strength Potion")) return "Temporarily increases attack by 3";
  return "Unknown item";
};

export const getEquipmentEmoji = (type?: string) => {
  return {
    weapon: "⚔️",
    armor: "🛡️",
    shield: "🔰",
    helmet: "🪖",
    boots: "👢",
    ring: "💍",
    amulet: "📿",
  }[type || "weapon"] || "❓";
};