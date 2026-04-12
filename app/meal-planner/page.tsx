'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Plus, Trash2, ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMealPlan } from '@/hooks/useMealPlan';
import { useRecipeStore } from '@/lib/store';
import { RecipeCard as RecipeCardComponent } from '@/components/RecipeCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { RecipeCard, MealPlanDay } from '@/types/recipe';

export default function MealPlannerPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState<'omad' | 'high-protein' | 'all'>('all');
  const { plan, isLoading, generateMealPlan, updateMealInPlan } = useMealPlan();
  const { mealPlans, removeMealPlan, setActiveMealPlan } = useRecipeStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleGeneratePlan = async () => {
    await generateMealPlan(selectedDiet);
  };

  const handleDownloadPlan = () => {
    if (!plan) return;

    const planText = generatePlanText(plan);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(planText));
    element.setAttribute('download', `meal-plan-${plan.id}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const activePlan = plan || (mealPlans.length > 0 ? mealPlans[0] : null);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <h1 className="text-xl font-bold text-foreground">Meal Planner</h1>

          <div className="w-[40px]" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Generator Section */}
        <section className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl font-bold text-foreground">Generate Your Weekly Plan</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Diet Preference</label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedDiet === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedDiet('all')}
                >
                  All Meals
                </Button>
                <Button
                  variant={selectedDiet === 'omad' ? 'default' : 'outline'}
                  onClick={() => setSelectedDiet('omad')}
                >
                  OMAD (One Meal a Day)
                </Button>
                <Button
                  variant={selectedDiet === 'high-protein' ? 'default' : 'outline'}
                  onClick={() => setSelectedDiet('high-protein')}
                >
                  High Protein
                </Button>
              </div>
            </div>

            <Button
              onClick={handleGeneratePlan}
              disabled={isLoading}
              className="w-full gap-2 text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Generate Meal Plan
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Active Plan */}
        {activePlan && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{activePlan.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {activePlan.diet === 'all' ? 'All Meals' : activePlan.diet === 'omad' ? 'OMAD (One Meal a Day)' : 'High Protein'} recipes
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleDownloadPlan}
                  variant="outline"
                  className="gap-2"
                >
                  <Download size={18} />
                  Download
                </Button>

                {mealPlans.length > 1 && (
                  <Button
                    onClick={() => removeMealPlan(activePlan.id)}
                    variant="destructive"
                    className="gap-2"
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {activePlan.week.map((day) => (
                <MealPlanDayCard
                  key={day.dayOfWeek}
                  day={day}
                  onUpdateMeal={updateMealInPlan}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!activePlan && (
          <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center space-y-4">
            <p className="text-lg font-medium text-foreground">No meal plan yet</p>
            <p className="text-muted-foreground">Generate a weekly meal plan using the options above to get started</p>
          </div>
        )}

        {/* Previous Plans */}
        {mealPlans.length > 1 && (
          <section className="space-y-4 border-t border-border pt-8">
            <h2 className="text-2xl font-bold text-foreground">Previous Plans</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {mealPlans.slice(1).map((savedPlan) => (
                <div
                  key={savedPlan.id}
                  className="rounded-lg border border-border bg-card p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-foreground">{savedPlan.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {savedPlan.createdAt ? new Date(savedPlan.createdAt).toLocaleDateString() : 'No date'}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setActiveMealPlan(savedPlan.id)}
                      size="sm"
                      variant="outline"
                    >
                      View
                    </Button>

                    <Button
                      onClick={() => removeMealPlan(savedPlan.id)}
                      size="sm"
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

interface MealPlanDayCardProps {
  day: MealPlanDay;
  onUpdateMeal: (day: MealPlanDay['dayOfWeek'], type: 'breakfast' | 'lunch' | 'dinner', recipe: RecipeCard | null) => void;
}

function MealPlanDayCard({ day, onUpdateMeal }: MealPlanDayCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{day.dayOfWeek}</h3>

      <Tabs defaultValue="breakfast" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breakfast">
            <span className="text-xs sm:text-sm">Breakfast</span>
          </TabsTrigger>
          <TabsTrigger value="lunch">
            <span className="text-xs sm:text-sm">Lunch</span>
          </TabsTrigger>
          <TabsTrigger value="dinner">
            <span className="text-xs sm:text-sm">Dinner</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breakfast" className="mt-4 space-y-3">
          {day.breakfast ? (
            <div className="space-y-2">
              <Link href={`/recipe/${day.breakfast.id}`}>
                <div className="group rounded-lg border border-border bg-background p-3 cursor-pointer hover:border-primary/30 transition-colors">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {day.breakfast.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{day.breakfast.calories} cal</p>
                </div>
              </Link>

              <Button
                onClick={() => onUpdateMeal(day.dayOfWeek, 'breakfast', null)}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Change Recipe
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No meal planned</p>
          )}
        </TabsContent>

        <TabsContent value="lunch" className="mt-4 space-y-3">
          {day.lunch ? (
            <div className="space-y-2">
              <Link href={`/recipe/${day.lunch.id}`}>
                <div className="group rounded-lg border border-border bg-background p-3 cursor-pointer hover:border-primary/30 transition-colors">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {day.lunch.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{day.lunch.calories} cal</p>
                </div>
              </Link>

              <Button
                onClick={() => onUpdateMeal(day.dayOfWeek, 'lunch', null)}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Change Recipe
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No meal planned</p>
          )}
        </TabsContent>

        <TabsContent value="dinner" className="mt-4 space-y-3">
          {day.dinner ? (
            <div className="space-y-2">
              <Link href={`/recipe/${day.dinner.id}`}>
                <div className="group rounded-lg border border-border bg-background p-3 cursor-pointer hover:border-primary/30 transition-colors">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {day.dinner.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{day.dinner.calories} cal</p>
                </div>
              </Link>

              <Button
                onClick={() => onUpdateMeal(day.dayOfWeek, 'dinner', null)}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Change Recipe
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No meal planned</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function generatePlanText(plan: any): string {
  let text = `Weekly Meal Plan: ${plan.name}\n`;
  text += `Diet: ${plan.diet}\n`;
  text += `Generated: ${new Date().toLocaleDateString()}\n\n`;

  for (const day of plan.week) {
    text += `${day.dayOfWeek}:\n`;
    text += `  Breakfast: ${day.breakfast?.name || 'Not planned'} (${day.breakfast?.calories || 0} cal)\n`;
    text += `  Lunch: ${day.lunch?.name || 'Not planned'} (${day.lunch?.calories || 0} cal)\n`;
    text += `  Dinner: ${day.dinner?.name || 'Not planned'} (${day.dinner?.calories || 0} cal)\n\n`;
  }

  return text;
}
