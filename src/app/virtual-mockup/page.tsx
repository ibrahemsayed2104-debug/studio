import { VirtualMockupTool } from '@/components/virtual-mockup-tool';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default function VirtualMockupPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          جرّبها قبل أن تشتريها
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Use our AI-powered technology to see how curtains will look in your space. Just upload a photo of your room and let us handle the rest!
        </p>
      </div>
      <VirtualMockupTool />
    </div>
  );
}
