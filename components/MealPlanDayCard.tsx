'use client';

import { DayPlan, RecipeCard } from '@/types/recipe';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChefHat } from 'lucide-react';

interface MealPlanDayCardProps {
  day: DayPlan;
  onUpdateMeal?: (dayOfWeek: string, mealType: 'breakfast' | 'lunch' | 'dinner', meal: RecipeCard) => void;
}

export function MealPlanDayCard({ day, onUpdateMeal }: MealPlanDayCardProps) {
  const meals = [
    { label: 'Breakfast', meal: day.breakfast, type: 'breakfast' as const },
    { label: 'Lunch', meal: day.lunch, type: 'lunch' as const },
    { label: 'Dinner', meal: day.dinner, type: 'dinner' as const },
  ];

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{day.dayOfWeek}</h3>
      
      <div className="space-y-3">
        {meals.map(({ label, meal, type }) => (
          <div key={type} className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {meal ? (
              <Link href={`/recipe/${meal.id}`}>
                <div className="rounded-lg bg-muted/50 p-3 hover:bg-muted transition-colors cursor-pointer">
                  <p className="font-medium text-foreground text-sm">{meal.name}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{meal.category}</Badge>
                    {meal.cuisine && <Badge variant="outline" className="text-xs">{meal.cuisine}</Badge>}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-3 text-center text-sm text-muted-foreground">
                No meal selected
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
