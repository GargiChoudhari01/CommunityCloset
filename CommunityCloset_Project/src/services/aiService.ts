import { apiClient } from './apiClient';
import { storage } from './storage';

export const aiService = {
  async matchNeed(userPrompt: string) {
    const items = storage.getItems();
    const res = await apiClient.post('/ai/match-need', {
      prompt: userPrompt,
      availableItems: items
    });

    if (res && res.success) {
      return res.recommendation;
    }

    // Client fallback recommendation engine
    const promptLower = userPrompt.toLowerCase();
    let matched = items.filter(item =>
      promptLower.includes(item.category.toLowerCase()) ||
      promptLower.includes(item.title.toLowerCase()) ||
      item.description.toLowerCase().includes(promptLower)
    );

    if (matched.length === 0) matched = items.slice(0, 2);

    return {
      projectType: 'DIY & Home Improvement',
      summary: `Found ${matched.length} matching resources available in Katraj, Pune for your project: "${userPrompt}"`,
      recommendedItems: matched.map(m => ({
        id: m.id,
        title: m.title,
        reason: `Available nearby in ${m.locationName} (${m.condition})`
      })),
      ecoImpact: {
        co2PreventedKg: matched.length * 8.5,
        estimatedSavingsInr: matched.reduce((acc, curr) => acc + (curr.depositAmount || 300), 400)
      }
    };
  },

  async enhanceDescription(title: string, category: string, initialDescription: string) {
    const res = await apiClient.post('/ai/enhance-description', {
      title,
      category,
      initialDescription
    });

    if (res && res.success) return res.enhancedDescription;

    return `✨ **Community Quality Assured**: Well-maintained ${title} available for neighborhood lending in Katraj, Pune. ${initialDescription || 'Perfect for home maintenance, woodworking, or gardening.'} Please return clean and handle with care!`;
  },

  async estimateImpact(category: string, originalPriceInr: number) {
    const res = await apiClient.post('/ai/estimate-impact', {
      category,
      originalPriceInr
    });

    if (res && res.success) return res;

    const price = Number(originalPriceInr) || 1500;
    const co2Saved = Math.round((price / 100) * 1.2 * 10) / 10;
    return {
      co2SavedKg: co2Saved,
      moneySavedInr: Math.round(price * 0.85),
      treesEquivalent: Math.max(1, Math.round(co2Saved / 5))
    };
  }
};
