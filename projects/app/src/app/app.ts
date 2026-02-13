import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toPng } from 'html-to-image';

type Nutrient = {
  icon: string;
  label: string;
  target: string;
  hint: string;
};

type FoodCard = {
  id: string;
  name: string;
  icon: string;
  protein: number;
  carbs: number;
  fats: number;
  kcal: number;
  perLabel: string;
  dietType: 'veg' | 'non-veg';
  dishIdeas: string[];
};

type DayPlan = {
  day: string;
  foodId: string | null;
};

type ActivityLevel = {
  id: string;
  label: string;
  multiplier: number;
  subtitle: string;
  icon: string;
};

type ChartEntry = {
  day: string;
  food: string;
  dish: string;
  macros: string;
};

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild('chartExportTarget') private chartExportTarget?: ElementRef<HTMLElement>;

  protected weightInput: number | null = null;
  protected weightUnit: 'kg' | 'lbs' = 'kg';
  protected activityId = 'moderate';
  protected sourceFilter: 'all' | 'veg' | 'non-veg' = 'all';

  protected readonly activityLevels: ActivityLevel[] = [
    { id: 'light', label: 'Light', multiplier: .8, subtitle: 'Desk job', icon: '🪑' },
    { id: 'moderate', label: 'Moderate', multiplier: 1, subtitle: '3-4x/week', icon: '🚶' },
    { id: 'active', label: 'Active', multiplier: 1.2, subtitle: 'Daily exercise', icon: '🏃' },
    { id: 'intense', label: 'Intense', multiplier: 1.6, subtitle: 'Heavy training', icon: '🏋️' }
  ];

  protected readonly foodCards: FoodCard[] = [
    {
      id: 'egg',
      name: 'Egg',
      icon: '🥚',
      protein: 13,
      carbs: 1.1,
      fats: 11,
      kcal: 155,
      perLabel: '/100g',
      dietType: 'non-veg',
      dishIdeas: ['Main: Masala omelette | Side: Whole wheat toast', 'Main: Egg bhurji | Side: Cucumber salad']
    },
    {
      id: 'chicken-breast',
      name: 'Chicken Breast',
      icon: '🍗',
      protein: 31,
      carbs: 0,
      fats: 3.6,
      kcal: 165,
      perLabel: '/100g',
      dietType: 'non-veg',
      dishIdeas: ['Main: Lemon grilled chicken | Side: Brown rice', 'Main: Chicken tikka | Side: Quinoa salad']
    },
    {
      id: 'fish-rohu',
      name: 'Fish (Rohu)',
      icon: '🐟',
      protein: 17,
      carbs: 0,
      fats: 4,
      kcal: 97,
      perLabel: '/100g',
      dietType: 'non-veg',
      dishIdeas: ['Main: Grilled rohu fillet | Side: Jeera rice', 'Main: Fish curry | Side: Steamed rice']
    },
    {
      id: 'prawns',
      name: 'Prawns',
      icon: '🍤',
      protein: 24,
      carbs: 0.2,
      fats: 0.3,
      kcal: 99,
      perLabel: '/100g',
      dietType: 'non-veg',
      dishIdeas: ['Main: Garlic prawns | Side: Herbed rice', 'Main: Prawn stir fry | Side: Quinoa']
    },
    {
      id: 'mutton',
      name: 'Mutton',
      icon: '🥩',
      protein: 25,
      carbs: 0,
      fats: 21,
      kcal: 294,
      perLabel: '/100g',
      dietType: 'non-veg',
      dishIdeas: ['Main: Lean mutton curry | Side: Millet roti', 'Main: Mutton stew | Side: Sauteed veggies']
    },
    {
      id: 'paneer',
      name: 'Paneer',
      icon: '🧀',
      protein: 18,
      carbs: 6,
      fats: 20,
      kcal: 265,
      perLabel: '/100g',
      dietType: 'veg',
      dishIdeas: ['Main: Paneer tikka | Side: Mint rice', 'Main: Paneer bhurji | Side: Multigrain roti']
    },
    {
      id: 'tofu',
      name: 'Tofu',
      icon: '🧊',
      protein: 16,
      carbs: 3,
      fats: 9,
      kcal: 144,
      perLabel: '/100g',
      dietType: 'veg',
      dishIdeas: ['Main: Tofu stir fry | Side: Brown rice', 'Main: Smoked tofu | Side: Veg salad']
    },
    {
      id: 'soya-chunks',
      name: 'Soya Chunks',
      icon: '🌰',
      protein: 52,
      carbs: 33,
      fats: 0.5,
      kcal: 345,
      perLabel: '/100g',
      dietType: 'veg',
      dishIdeas: ['Main: Soya keema | Side: Jeera rice', 'Main: Soya pulao | Side: Raita']
    },
    {
      id: 'chickpeas',
      name: 'Chickpeas',
      icon: '🫛',
      protein: 19,
      carbs: 61,
      fats: 6,
      kcal: 364,
      perLabel: '/100g',
      dietType: 'veg',
      dishIdeas: ['Main: Masala chana | Side: Cumin rice', 'Main: Chana salad bowl | Side: Yogurt dip']
    },
    {
      id: 'moong-dal',
      name: 'Moong Dal',
      icon: '🥣',
      protein: 24,
      carbs: 63,
      fats: 1.2,
      kcal: 347,
      perLabel: '/100g',
      dietType: 'veg',
      dishIdeas: ['Main: Moong dal tadka | Side: Steamed rice', 'Main: Moong cheela | Side: Green chutney']
    },
    {
      id: 'greek-yogurt',
      name: 'Greek Yogurt',
      icon: '🥛',
      protein: 10,
      carbs: 4,
      fats: 0.4,
      kcal: 59,
      perLabel: '/100g',
      dietType: 'veg',
      dishIdeas: ['Main: Greek yogurt bowl | Side: Fruit mix', 'Main: Yogurt dip | Side: Grilled veggies']
    },
    {
      id: 'almonds',
      name: 'Almonds',
      icon: '🌰',
      protein: 21,
      carbs: 22,
      fats: 50,
      kcal: 579,
      perLabel: '/100g',
      dietType: 'veg',
      dishIdeas: ['Main: Almond smoothie | Side: Oats bowl', 'Main: Almond snack mix | Side: Fresh fruit']
    },
    {
      id: 'salmon',
      name: 'Salmon',
      icon: '🐠',
      protein: 25,
      carbs: 0,
      fats: 13,
      kcal: 208,
      perLabel: '/100g',
      dietType: 'non-veg',
      dishIdeas: ['Main: Baked salmon | Side: Garlic rice', 'Main: Salmon teriyaki | Side: Sauteed greens']
    },
    {
      id: 'turkey-breast',
      name: 'Turkey Breast',
      icon: '🦃',
      protein: 29,
      carbs: 0,
      fats: 1,
      kcal: 135,
      perLabel: '/100g',
      dietType: 'non-veg',
      dishIdeas: ['Main: Turkey roast | Side: Mashed potatoes', 'Main: Turkey strips | Side: Couscous']
    },
    {
      id: 'lentils',
      name: 'Lentils',
      icon: '🫘',
      protein: 25,
      carbs: 60,
      fats: 1.1,
      kcal: 353,
      perLabel: '/100g',
      dietType: 'veg',
      dishIdeas: ['Main: Lentil curry | Side: Brown rice', 'Main: Lentil soup | Side: Toasted bread']
    },
    {
      id: 'tempeh',
      name: 'Tempeh',
      icon: '🍘',
      protein: 20,
      carbs: 9,
      fats: 11,
      kcal: 193,
      perLabel: '/100g',
      dietType: 'veg',
      dishIdeas: ['Main: Tempeh stir fry | Side: Jasmine rice', 'Main: Grilled tempeh | Side: Quinoa']
    },
    {
      id: 'cottage-cheese-lowfat',
      name: 'Low Fat Cottage Cheese',
      icon: '🧈',
      protein: 12,
      carbs: 3.4,
      fats: 4.3,
      kcal: 98,
      perLabel: '/100g',
      dietType: 'veg',
      dishIdeas: ['Main: Cottage cheese bowl | Side: Fruit salad', 'Main: Herbed cottage cheese | Side: Crackers']
    }
  ];

  protected readonly weeklyPlan: DayPlan[] = [
    { day: 'Monday', foodId: null },
    { day: 'Tuesday', foodId: null },
    { day: 'Wednesday', foodId: null },
    { day: 'Thursday', foodId: null },
    { day: 'Friday', foodId: null },
    { day: 'Saturday', foodId: null },
    { day: 'Sunday', foodId: null }
  ];

  protected selectedFoodIds = new Set<string>();
  protected isChartModalOpen = false;
  protected chartEntries: ChartEntry[] = [];
  protected generatedChartText = '';
  protected chartMessage = '';

  protected get nutrients(): Nutrient[] {
    const protein = this.proteinTarget();
    return [
      {
        icon: '💪',
        label: 'Protein',
        target: protein ? `${protein}g/day` : 'Enter weight',
        hint: protein
          ? `Based on ${this.activeLevel().multiplier}g per kg and your activity`
          : 'Add weight to calculate target'
      },
      { icon: '🍚', label: 'Carbs', target: '180g/day', hint: 'Primary fuel for training and focus' },
      { icon: '🥑', label: 'Fats', target: '55g/day', hint: 'Hormone balance and satiety' },
      { icon: '🥦', label: 'Fiber', target: '30g/day', hint: 'Gut health and smoother digestion' }
    ];
  }

  protected proteinTarget(): number | null {
    const safeWeight = Math.max(30, this.weightKg());
    if (!safeWeight) {
      return null;
    }
    return Math.round(safeWeight * this.activeLevel().multiplier);
  }

  protected activeLevel(): ActivityLevel {
    return this.activityLevels.find((level) => level.id === this.activityId) ?? this.activityLevels[1];
  }

  protected weightKg(): number {
    if (!Number.isFinite(this.weightInput) || !this.weightInput || this.weightInput <= 0) {
      return 0;
    }

    if (this.weightUnit === 'kg') {
      return this.weightInput;
    }
    return this.weightInput * 0.453592;
  }

  protected setWeightUnit(unit: 'kg' | 'lbs'): void {
    if (unit === this.weightUnit) {
      return;
    }

    if (!this.weightInput || !Number.isFinite(this.weightInput)) {
      this.weightUnit = unit;
      return;
    }

    this.weightInput =
      unit === 'kg' ? Math.round(this.weightInput * 0.453592) : Math.round(this.weightInput * 2.20462);
    this.weightUnit = unit;
  }

  protected filteredSourceCards(): FoodCard[] {
    if (this.sourceFilter === 'all') {
      return this.foodCards;
    }

    return this.foodCards.filter((food) => food.dietType === this.sourceFilter);
  }

  protected sourceAmountForProtein(food: FoodCard): number | null {
    const target = this.proteinTarget();
    if (!target) {
      return null;
    }
    return Math.round((target / food.protein) * 100);
  }

  protected openDietChartModal(): void {
    this.chartEntries = this.buildChartEntries();
    this.generatedChartText = this.buildChartText();
    this.chartMessage = '';
    this.isChartModalOpen = true;
  }

  protected closeDietChartModal(): void {
    this.isChartModalOpen = false;
  }

  protected async shareDietChart(): Promise<void> {
    if (!this.generatedChartText) {
      return;
    }

    try {
      const browserNav = window.navigator as Navigator & {
        clipboard?: { writeText: (data: string) => Promise<void> };
      };

      if (typeof browserNav.share === 'function') {
        await browserNav.share({
          title: 'Weekly Diet Chart',
          text: this.generatedChartText
        });
        this.chartMessage = 'Chart shared successfully.';
        return;
      }

      if (browserNav.clipboard?.writeText) {
        await browserNav.clipboard.writeText(this.generatedChartText);
        this.chartMessage = 'Chart copied to clipboard. Ready to share.';
        return;
      }

      this.chartMessage = 'Share is not supported on this browser.';
    } catch {
      this.chartMessage = 'Could not share right now. Try download.';
    }
  }

  protected async downloadDietChart(): Promise<void> {
    if (!this.chartExportTarget?.nativeElement) {
      return;
    }

    try {
      const dataUrl = await toPng(this.chartExportTarget.nativeElement, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#fffefc',
        filter: (node: HTMLElement) => !node.classList?.contains('no-export')
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'weekly-diet-chart.png';
      link.click();
      this.chartMessage = 'Chart downloaded as image.';
    } catch {
      this.chartMessage = 'Could not export image. Try again.';
    }
  }

  protected canGenerateChart(): boolean {
    return this.weeklyPlan.some((day) => !!day.foodId);
  }

  private buildChartEntries(): ChartEntry[] {
    return this.weeklyPlan.map((day) => {
      const food = this.selectedCardById(day.foodId);
      if (!food) {
        return {
          day: day.day,
          food: 'Not selected',
          dish: '-',
          macros: '-'
        };
      }

      return {
        day: day.day,
        food: food.name,
        dish: food.dishIdeas[0],
        macros: `P ${food.protein}g | C ${food.carbs}g | F ${food.fats}g`
      };
    });
  }

  private buildChartText(): string {
    const header = `Weekly Diet Chart\nProtein Target: ${this.proteinTarget() ?? 'N/A'}g/day\n`;
    const rows = this.chartEntries
      .map((entry) => `${entry.day}: ${entry.food} | ${entry.dish} | ${entry.macros}`)
      .join('\n');
    return `${header}\n${rows}\n`;
  }

  protected toggleCard(foodId: string): void {
    if (this.selectedFoodIds.has(foodId)) {
      this.selectedFoodIds.delete(foodId);
      this.weeklyPlan.forEach((day) => {
        if (day.foodId === foodId) {
          day.foodId = null;
        }
      });
      return;
    }

    this.selectedFoodIds.add(foodId);
  }

  protected isSelected(foodId: string): boolean {
    return this.selectedFoodIds.has(foodId);
  }

  protected selectedCards(): FoodCard[] {
    return this.foodCards.filter((food) => this.selectedFoodIds.has(food.id));
  }

  protected selectedCardById(foodId: string | null): FoodCard | undefined {
    return this.foodCards.find((food) => food.id === foodId);
  }
}
