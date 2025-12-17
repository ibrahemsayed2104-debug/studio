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
import {MediaPart} from 'genkit/model';

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

function dataUriToMediaPart(uri: string): MediaPart {
  const [header, data] = uri.split(',');
  const mimeType = header.match(/:(.*?);/)?.[1];
  if (!mimeType) {
    throw new Error('Invalid data URI: could not extract MIME type.');
  }
  return {media: {url: uri, contentType: mimeType}};
}

const virtualCurtainMockupFlow = ai.defineFlow(
  {
    name: 'virtualCurtainMockupFlow',
    inputSchema: VirtualCurtainMockupInputSchema,
    outputSchema: VirtualCurtainMockupOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      model: 'googleai/gemini-pro-vision',
      prompt: [
        dataUriToMediaPart(input.roomImage),
        {
          text: 'Visualize how these curtains would look in the room, and generate an image of the room with the curtains in place. Use the curtain image as reference for the style, color and material of the curtains. Make sure the lighting and shadows match the room.',
        },
        dataUriToMediaPart(input.curtainImage),
      ],
      config: {
        responseModalities: ['IMAGE'],
      },
    });
    const {media} = output as any;
    return {mockupImage: media.url!};
  }
);
