import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SectionCard({
  title,
  children,
  cta,
}: {
  title: string;
  children?: React.ReactNode;
  cta?: string;
}) {
  return (
    <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-lg font-bold text-gray-900">
            {title}
          </CardTitle>
          {cta && (
            <Button
              variant="link"
              className="p-0 h-auto text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
            >
              {cta}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
