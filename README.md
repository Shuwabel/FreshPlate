# FreshPlate: Recipe Discovery & Meal Planning Platform

A modern, intuitive web application that brings the world of cooking to your kitchen. FreshPlate empowers users to discover thousands of international recipes, plan their weekly meals, and build their personal recipe collection—all powered by TheMealDB's free, curated database.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Features in Detail](#features-in-detail)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Recipe Discovery
- **Search by Name**: Real-time recipe search with instant results as you type
- **Browse by Category**: Browse 14+ meal categories including Breakfast, Beef, Chicken, Seafood, Vegetarian, Vegan, and more
- **View All Meals**: Display all available recipes with pagination ("Load More" functionality)
- **Random Recipe Generator**: Get a random meal suggestion with one click for culinary inspiration

### Smart Navigation
- **Dynamic Back Buttons**: Context-aware navigation that shows "Back to Home" or "Back to Category" depending on where you navigated from
- **Category Pages**: Dedicated pages for each category with 20 recipes per load and pagination support
- **Breadcrumb-Style Navigation**: Track your browsing journey through categories and recipes

### Recipe Details
- **Complete Recipe Information**: 
  - High-quality meal images with fallback handling
  - Full ingredient lists with measurements
  - Step-by-step cooking instructions
  - Cuisine and category information
  - Estimated cooking time and calories
  - Dietary classification (vegan, vegetarian, etc.)
- **YouTube Integration**: Link to video tutorials for visual cooking guidance
- **Similar Recipes Section**: Discover related recipes in the same category at the bottom of each recipe page
- **Share Functionality**: Share recipes on social media

### Personal Recipe Management
- **Favorites System**: Save your favorite recipes for quick access
- **Routine Meals**: Mark recipes as routine meals for frequent cooking
- **Persistent Storage**: All favorites and routine meals are saved locally using browser storage
- **Favorites Dashboard**: View all saved recipes with quick stats on your Favorites page

### Meal Planning
- **Weekly Meal Planner**: Auto-generate 7-day meal plans with breakfast, lunch, and dinner
- **Diet Filtering**: Plan meals with different dietary preferences:
  - All Meals (diverse options)
  - OMAD (One Meal a Day)
  - High Protein meals
- **Flexible Meal Swapping**: Update individual meals in your plan to match your preferences
- **Download Plans**: Export your meal plan as a text file for printing or offline access
- **Multiple Plans**: Create and manage multiple meal plans for different weeks or dietary goals

### Responsive Design
- **Mobile-First Approach**: Fully optimized for smartphones, tablets, and desktops
- **Fixed Sidebar Navigation** (Desktop): "Back to Recipes" button stays visible while scrolling recipe details
- **Touch-Friendly Interface**: Optimized buttons and spacing for mobile devices
- **Adaptive Layouts**: Grid layouts adjust from 1 column on mobile to 4 columns on desktop

## Architecture

FreshPlate follows a modular, scalable architecture with clear separation of concerns:

### Component Hierarchy
```
App
├── Layout (Header with Navigation)
├── Home Page
│   ├── Hero Section (Search + CTA)
│   ├── Random Recipe Section
│   ├── Category Browser
│   └── Recipe Grid / Search Results
├── Recipe Detail Page
│   ├── Fixed Sidebar (Desktop)
│   ├── Recipe Content
│   └── Similar Recipes Section
├── Category Page (/recipes/[category])
│   ├── Category Header
│   ├── Paginated Recipe Grid
│   └── Load More Button
├── Meal Planner Page
│   ├── Diet Filter Selector
│   ├── Generate Plan Button
│   └── Weekly Plan Display
└── Favorites Page
    ├── Favorites Grid
    └── Routine Meals Grid
```

### State Management
- **Zustand Store**: Global state management for:
  - Search results
  - Favorites list
  - Routine meals
  - Meal plans
  - Recently viewed recipes
- **Local Storage**: Persistent storage for user preferences and saved data
- **React Hooks**: Local component state for UI interactions (modals, loading states, etc.)

### Data Flow
```
User Input → Hook (useMealSearch, useMealDetails, etc.)
→ API Client (mealdbClient)
→ Recipe Adapter (Normalize to RecipeCard format)
→ Zustand Store (Update global state)
→ Components (Re-render with new data)
```

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
  - App Router for file-based routing
  - Server-side rendering capabilities
  - Automatic code splitting and optimization
- **Styling**: Tailwind CSS 4
  - Utility-first CSS with semantic design tokens
  - Dark mode support
  - Responsive design utilities
- **UI Components**: Custom shadcn/ui components
  - Buttons, Badges, Tabs, Input fields
  - Accessible form controls
- **Icons**: Lucide React
  - Lightweight SVG icons
  - 500+ icon library

### State Management
- **Zustand**: Lightweight state management library
  - Simple store creation with hooks
  - Minimal boilerplate
  - Built-in localStorage persistence

### Data Fetching & Caching
- **Custom Hooks**: React hooks for API calls
  - `useMealSearch`: Search, filter, and browse recipes
  - `useMealDetails`: Fetch individual recipe details
  - `useRandomMeal`: Get random meal suggestions
  - `useMealPlan`: Generate and manage meal plans

### API Integration
- **TheMealDB API**: Free, no-key-required recipe database
  - 300+ curated international meals
  - Multiple search filters (name, category, cuisine, ingredients)
  - Reliable JSON responses

### Database
- **Browser LocalStorage**: For persistence of user data
  - No backend database required
  - Automatic serialization of favorites and routine meals

### Utilities
- **clsx/cn**: Conditional class name utility
- **uuid**: Unique identifier generation for meal plans

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm/bun
- Git for version control

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/Shuwabel/FreshPlate.git
cd FreshPlate
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Set Up Environment Variables**
Create a `.env.local` file in the root directory:
```env
# No API keys required for TheMealDB!
# The application works out of the box
NEXT_PUBLIC_APP_NAME=FreshPlate
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production
```bash
npm run build
npm start
```

## Project Structure

```
FreshPlate/
├── app/
│   ├── layout.tsx                    # Root layout with metadata
│   ├── page.tsx                      # Homepage with search and categories
│   ├── recipe/
│   │   └── [id]/
│   │       └── page.tsx              # Recipe detail page with dynamic routing
│   ├── recipes/
│   │   └── [category]/
│   │       └── page.tsx              # Category browsing with pagination
│   ├── meal-planner/
│   │   └── page.tsx                  # Weekly meal planning interface
│   ├── favorites/
│   │   └── page.tsx                  # Saved recipes and routine meals
│   └── globals.css                   # Design tokens and global styles
│
├── components/
│   ├── SearchBar.tsx                 # Real-time search input
│   ├── CategoryBrowser.tsx            # Category selection interface
│   ├── RecipeCard.tsx                # Individual recipe card component
│   ├── RecipeGrid.tsx                # Grid layout for multiple recipes
│   ├── MealPlanDayCard.tsx           # Daily meal plan display
│   └── ui/                           # shadcn/ui component library
│       ├── button.tsx
│       ├── badge.tsx
│       ├── tabs.tsx
│       ├── input.tsx
│       └── ...
│
├── hooks/
│   ├── useMealSearch.ts              # Recipe search and filtering
│   ├── useMealDetails.ts             # Fetch single recipe details
│   ├── useRandomMeal.ts              # Random meal generation
│   └── useMealPlan.ts                # Meal plan creation and management
│
├── lib/
│   ├── store.ts                      # Zustand store configuration
│   ├── utils.ts                      # Utility functions (cn for classnames)
│   ├── estimates.ts                  # Hardcoded calorie/time estimates
│   ├── api/
│   │   ├── mealdb.ts                 # TheMealDB API client
│   │   ├── recipeAdapter.ts          # Normalize API responses to RecipeCard type
│   │   └── spoonacular.ts            # Legacy API (not currently used)
│   └── constants.ts                  # App constants and configuration
│
├── types/
│   └── recipe.ts                     # TypeScript type definitions
│       ├── RecipeCard                # Recipe card display type
│       ├── RecipeDetails             # Full recipe information
│       ├── MealPlan                  # Meal plan structure
│       ├── DayPlan                   # Single day meal plan
│       └── SearchFilters             # Search query options
│
├── public/
│   ├── icon.svg                      # Favicon
│   └── apple-icon.png                # Apple touch icon
│
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
└── README.md                         # This file
```

## Features in Detail

### Search Functionality

**Real-Time Search**
- Type in the search bar to see results instantly
- No need to press enter or click a search button
- Results update as you type

**Search Display**
- When searching, results are centered on the page with "Search Results" heading
- When browsing normally, recipes are left-aligned with "Recipes" heading
- Visual distinction helps users understand their current context

**No Results Handling**
- If a search yields no results, users see "This recipe is not available at the moment"
- This clear messaging prevents confusion about whether a search failed

### Category Browser

**All Meals View**
- Loads a diverse mix of recipes from multiple categories
- Shows up to 20 recipes on the homepage
- Gives users a quick overview without overwhelming with options

**Category Selection**
- Click any category to navigate to the dedicated category page
- Each category has its own browsing experience with pagination
- Emoji indicators make categories visually distinct and memorable

### Recipe Detail Page

**Information Layout**
- Hero image at the top with fallback for missing images
- Title, category, cuisine, and dietary info prominently displayed
- Ingredients listed with measurements for easy cooking
- Step-by-step instructions for clarity

**Interactive Features**
- Heart button to add/remove from favorites
- Star button to mark as routine meal
- YouTube link to video tutorial (if available)
- Share button for social media integration

**Similar Recipes**
- Section at bottom showing 4 recipes from the same category
- Helps users discover related meals they might enjoy
- Improves engagement and exploration

**Navigation**
- Fixed sidebar on desktop keeps "Back" button visible while scrolling
- Mobile users see back button at the bottom
- Dynamic text: "Back to Category" vs "Back to Home" based on navigation source

### Meal Planner

**Plan Generation**
- Select diet preference (All Meals, OMAD, High Protein)
- Click "Generate Meal Plan" to create 7-day plan
- Algorithm picks diverse meals from appropriate categories

**Plan Management**
- View breakfast, lunch, dinner for each day
- Swap individual meals by clicking "Change Recipe"
- Download plan as text file for kitchen reference

**Multiple Plans**
- Save multiple plans for different weeks
- Manage saved plans with delete option
- View plan creation date and dietary preference

### Favorites & Routine

**Favorites Page**
- Dedicated page showing all saved recipes
- Tab-based interface:
  - Favorites: Recipes you love
  - Routine Meals: Recipes you cook regularly
- Quick stats on total saved recipes

**Local Persistence**
- All favorites automatically saved to browser
- Persist across sessions and devices (same browser/device)
- No account or login required

## API Integration

### TheMealDB API

FreshPlate uses **TheMealDB**, a free API requiring no authentication or API keys.

**Endpoints Used**
```
GET /search.php?s={meal}              # Search by meal name
GET /filter.php?c={category}          # Filter by category
GET /filter.php?a={cuisine}           # Filter by cuisine/area
GET /filter.php?i={ingredient}        # Filter by ingredient
GET /lookup.php?i={id}                # Get meal details by ID
GET /random.php                       # Get random meal
GET /categories.php                   # List all categories
GET /list.php?c=list                  # List all cuisines
GET /list.php?i=list                  # List all ingredients
```

**Response Format**
```json
{
  "meals": [
    {
      "idMeal": "52771",
      "strMeal": "Beef and Mustard Pie",
      "strCategory": "Beef",
      "strArea": "British",
      "strMealThumb": "https://www.themealdb.com/images/media/meals/123.jpg",
      "strTags": "pie,savory",
      "strInstructions": "Preheat oven...",
      "strYoutube": "https://www.youtube.com/watch?v=1234",
      "strIngredient1": "Beef",
      "strMeasure1": "500g",
      ...
    }
  ]
}
```

**Data Normalization**
The `recipeAdapter.ts` file normalizes API responses to our internal `RecipeCard` type:
- Extracts ingredients and measurements
- Detects dietary preferences (vegan, vegetarian)
- Estimates cooking time based on category
- Provides calorie estimates based on cuisine

## Deployment

### Deploy to Vercel (Recommended)

**Step 1: Connect GitHub**
1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Authorize Vercel to access your repository

**Step 2: Configure Project**
1. Framework: Next.js (auto-detected)
2. Root Directory: ./ (or FreshPlate if in a monorepo)
3. Build Command: `npm run build` (auto-filled)
4. Output Directory: `.next` (auto-filled)

**Step 3: Environment Variables**
No environment variables are required for FreshPlate! TheMealDB is completely free and doesn't require API keys.

**Step 4: Deploy**
1. Click "Deploy"
2. Wait for build to complete
3. Your site is live at `[project-name].vercel.app`

**Auto-Deployment**
- Every push to your main branch automatically triggers a new deployment
- Previous deployments remain accessible for rollback
- No manual deployment steps needed

### Alternative: Self-Hosted Deployment

**Using Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Using Railway, Heroku, or AWS**
- Build command: `npm run build`
- Start command: `npm start`
- Node version: 18+
- No environment variables required

### Troubleshooting Deployment Issues

**"Page couldn't load"**
- Clear browser cache and refresh
- Check browser console for errors (F12 → Console tab)
- Verify all routes exist in your app directory

**Missing recipes/search not working**
- TheMealDB might be temporarily slow
- Check browser Network tab to see API response
- Verify internet connection is active

**Build fails with module errors**
- Delete `node_modules` and `.next` directories
- Run `npm install` again
- Check for import typos in component files

**Styles not loading**
- Restart development server with `npm run dev`
- Clear Next.js cache: `rm -rf .next`
- Verify tailwind.config.js is properly configured

## Contributing

We welcome contributions! Here's how to help:

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Changes**: Follow existing code style and patterns
4. **Test Thoroughly**: Verify all features work as expected
5. **Commit Changes**: `git commit -m 'Add amazing feature'`
6. **Push to Branch**: `git push origin feature/amazing-feature`
7. **Open Pull Request**: Describe your changes in detail

### Code Standards
- Use TypeScript for type safety
- Follow existing component structure and naming
- Add comments for complex logic
- Test responsive design on mobile and desktop
- Ensure accessibility (keyboard navigation, ARIA labels)

## License

This project is open source and available under the MIT License. See LICENSE file for details.

---

**Built with passion for food lovers everywhere.**

Questions? Issues? Feature requests? Open an issue on GitHub!

**Last Updated**: April 2026
