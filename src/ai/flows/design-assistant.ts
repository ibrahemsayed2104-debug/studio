'use server';

/**
 * @fileOverview An AI agent that provides interior design advice for curtains.
 *
 * - getDesignAdvice - A function that provides curtain recommendations based on a room description.
 * - DesignAdviceInput - The input type for the getDesignAdvice function.
 * - DesignAdviceOutput - The return type for the getDesignAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { PRODUCTS } from '@/lib/data';

const DesignAdviceInputSchema = z.object({
  roomDescription: z.string().describe('A description of the user\'s room, including furniture, colors, and style.'),
});
export type DesignAdviceInput = z.infer<typeof DesignAdviceInputSchema>;

const RecommendedProductSchema = z.object({
    id: z.string().describe('The ID of the recommended product.'),
    name: z.string().describe('The name of the recommended product.'),
    reason: z.string().describe('A brief reason why this product is recommended for the user.'),
});

const DesignAdviceOutputSchema = z.object({
  analysis: z.string().describe('A brief analysis of the user\'s room style and needs.'),
  fabricRecommendation: z.string().describe('Recommendation for curtain fabric type (e.g., velvet, linen, sheer) with reasoning.'),
  colorPalette: z.array(z.string()).describe('A list of recommended colors for the curtains that would match the room.'),
  styleTip: z.string().describe('A pro tip about curtain style (e.g., length, mounting height) relevant to the user\'s room.'),
  recommendedProducts: z.array(RecommendedProductSchema).describe('A list of 2-3 specific products from the available list that would be a great fit.'),
});
export type DesignAdviceOutput = z.infer<typeof DesignAdviceOutputSchema>;

export async function getDesignAdvice(input: DesignAdviceInput): Promise<DesignAdviceOutput> {
  return designAdviceFlow(input);
}

const productList = PRODUCTS.map(p => ({ id: p.id, name: p.name, description: p.description })).join('\n');

const designAdviceFlow = ai.defineFlow(
  {
    name: 'designAdviceFlow',
    inputSchema: DesignAdviceInputSchema,
    outputSchema: DesignAdviceOutputSchema,
  },
  async (input) => {
    const prompt = `
      You are an expert interior designer with a specialization in window treatments, specifically curtains. Your brand personality is elegant, helpful, and inspiring. Your goal is to help users find the perfect curtains from our store.

      You will be given a description of a user's room. Your task is to provide a comprehensive recommendation based on their description. All of your output must be in Arabic.

      Here is the user's room description:
      "{{{roomDescription}}}"

      Here is the list of available curtain products you can recommend. Only recommend products from this list:
      ---
      ${productList}
      ---

      Analyze the description and generate a structured response with the following components:
      1.  **Analysis:** Briefly summarize the style of the room (e.g., "modern and minimalist," "cozy and traditional").
      2.  **Fabric Recommendation:** Suggest a suitable fabric (like velvet for luxury, or linen for a natural look) and explain why it fits their room.
      3.  **Color Palette:** Recommend a few specific colors that would complement their existing decor.
      4.  **Style Tip:** Provide a professional interior design tip. For example, "For a taller and more dramatic look, mount the curtain rod 4-6 inches above the window frame."
      5.  **Recommended Products:** Choose 2 or 3 products from the provided list that are a perfect match. For each product, provide its exact 'id', 'name', and a compelling 'reason' for why it's a great choice for them.

      Your response MUST be in the structured JSON format defined by the output schema. Do not add any extra text or explanations outside of the JSON structure.
    `;

    const { output } = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.5-flash',
      output: {
        schema: DesignAdviceOutputSchema,
      },
      context: {
        roomDescription: input.roomDescription,
      }
    });

    if (!output) {
      throw new Error("AI failed to generate design advice.");
    }
    return output;
  }
);
