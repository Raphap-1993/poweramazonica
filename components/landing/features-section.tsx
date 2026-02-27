import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FeatureItem } from "@/lib/content/types";

type FeaturesSectionProps = {
  items: FeatureItem[];
};

export function FeaturesSection({ items }: FeaturesSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold tracking-tight">Características</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Card key={`${item.title}-${index}`} className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{item.description}</p>
              {item.iconKey ? <p className="text-xs">icon: {item.iconKey}</p> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
