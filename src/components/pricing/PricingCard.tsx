
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  features: PricingFeature[];
  onSelect: () => void;
  popular?: boolean;
}

export const PricingCard = ({
  title,
  description,
  price,
  features,
  onSelect,
  popular = false,
}: PricingCardProps) => {
  return (
    <Card className={`p-6 ${popular ? 'border-primary shadow-lg' : ''}`}>
      {popular && (
        <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
          Popular
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
      <div className="mb-6">
        <div className="flex flex-col gap-2">
          <span className="text-3xl font-bold">{price}</span>
        </div>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className={`w-5 h-5 ${feature.included ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={feature.included ? '' : 'text-muted-foreground'}>{feature.text}</span>
          </li>
        ))}
      </ul>
      <Button onClick={onSelect} className="w-full" variant={popular ? "default" : "outline"}>
        Contact Sales
      </Button>
    </Card>
  );
};
