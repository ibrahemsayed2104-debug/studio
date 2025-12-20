'use server';

/**
 * @fileOverview An AI agent that uses the device camera to allow users to visualize how selected curtains would look in their own space before purchasing.
 *
 * - virtualCurtainMockup - A function that handles the virtual curtain mockup process.
 * - VirtualCurtainMockupInput - The input type for the virtualCurtainMockup function.
 * - VirtualCurtainMockupOutput - The return type for the virtualCurtainMockup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VirtualCurtainMockupInputSchema = z.object({
  roomImage: z
    .string()
    .describe(
      "A photo of the room, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  curtainImage: z
    .string()
    .describe(
      'A URL of the curtain photo.'
    ),
});
export type VirtualCurtainMockupInput = z.infer<typeof VirtualCurtainMockupInputSchema>;

const VirtualCurtainMockupOutputSchema = z.object({
  mockupImage: z
    .string()
    .describe(
      "A photo of the room with the curtain virtually applied, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VirtualCurtainMockupOutput = z.infer<typeof VirtualCurtainMockupOutputSchema>;

export async function virtualCurtainMockup(input: VirtualCurtainMockupInput): Promise<VirtualCurtainMockupOutput> {
  return virtualCurtainMockupFlow(input);
}

const virtualCurtainMockupFlow = ai.defineFlow(
  {
    name: 'virtualCurtainMockupFlow',
    inputSchema: VirtualCurtainMockupInputSchema,
    outputSchema: VirtualCurtainMockupOutputSchema,
  },
  async input => {

    const prompt = ai.definePrompt({
        name: 'virtualCurtainMockupPrompt',
        prompt: `You are a virtual interior designer. Your task is to superimpose the curtains from the second image onto the window in the first image (the room). 
        
        Room Image:
        {{media url=roomImage}}

        Curtain Image:
        {{media url=curtainImage}}

        Generate a photorealistic image showing how the curtains would look in that room. The final image should only show the room with the new curtains. Pay close attention to the style, color, pattern, and material of the curtains in the reference image. Match the lighting, shadows, and perspective of the room to create a seamless and believable composition. YOU MUST ONLY OUTPUT THE IMAGE, DO NOT ADD ANY TEXT.`,
        output: {
          format: 'media'
        },
        model: 'googleai/gemini-pro-vision',
    });
    
    const {media} = await prompt(input);
    
    if (!media?.url) {
      throw new Error("لم يتمكن الذكاء الاصطناعي من إنشاء الصورة. قد يكون السبب هو أن الصورة المحملة لا تحتوي على نافذة واضحة أو أن هناك مشكلة في الخدمة. حاول مرة أخرى بصورة مختلفة.");
    }
    
    return {mockupImage: media.url};
  }
);
