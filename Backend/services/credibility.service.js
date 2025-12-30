export const calculateCredibility = (evidence) => {
  if (!evidence) return 0.3;
  if (evidence.includes("who.int")) return 0.9;
  if (evidence.includes("wikipedia")) return 0.6;
  return 0.4;
};
