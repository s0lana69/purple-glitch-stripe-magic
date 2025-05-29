import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const FinalCta: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-darkLight text-foreground">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <Zap className={cn("h-12 w-12 mx-auto mb-6 gradient-blue-violet")} />
        {/* Applied lighter text color */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-300">
          Ready to Go Viral?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of creators and businesses using TrueViral.ai to amplify their reach and achieve unprecedented engagement.
        </p>
        {/* Updated Get Started button style */}
        <Button asChild size="lg" className="btn-transparent-violet">
          <Link href="/auth?initialMode=signup">Get Started Free</Link>
        </Button>
      </div>
    </section>
  );
};

export default FinalCta;
