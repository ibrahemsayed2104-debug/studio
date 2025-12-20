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
      'A photo of the room, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  curtainImage: z
    .string()
    .describe(
      'A photo of the curtain, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type VirtualCurtainMockupInput = z.infer<typeof VirtualCurtainMockupInputSchema>;

const VirtualCurtainMockupOutputSchema = z.object({
  mockupImage: z
    .string()
    .describe(
      'A photo of the room with the curtain virtually applied, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
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
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: input.roomImage}},
        {
          text: 'You are a virtual interior designer. Your task is to superimpose the curtains from the second image onto the window in the first image (the room). Generate a photorealistic image showing how the curtains would look in that room. The final image should only show the room with the new curtains. Pay close attention to the style, color, pattern, and material of the curtains in the reference image. Match the lighting, shadows, and perspective of the room to create a seamless and believable composition.',
        },
        {media: {url: input.curtainImage}},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    
    if (!media?.url) {
      throw new Error("لم يتمكن الذكاء الاصطناعي من إنشاء الصورة. قد يكون السبب هو أن الصورة المحملة لا تحتوي على نافذة واضحة أو أن هناك مشكلة في الخدمة. حاول مرة أخرى بصورة مختلفة.");
    }
    
    return {mockupImage: media.url};
  }
);
