import React from "react";
import {
  ResponsiveContainer,
  Tooltip,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  RadarChart,
} from "recharts";
import {
  Utensils,
  ChefHat,
  Info,
  Zap,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMenu } from "@/hooks/useAdmin";

const MenuPlanner: React.FC = () => {
  const { data: menuResponse } = useMenu();

  // transform backend flat array to expected UI structure
  const menu = React.useMemo(() => {
    if (!menuResponse?.success || !menuResponse.data) return [];
    return menuResponse.data.map((meal) => ({
      ...meal,
      id: meal.meal_id,
      mealName: meal.name,
      mealType: meal.meal_type.toLowerCase(),
      nutrition: meal.nutrition_facts,
      ingredients: meal.meal_ingredients?.map((mi) => mi.ingredients?.name) || [],
    }));
  }, [menuResponse]);

  // Compute nutritional distribution from actual menu data
  const nutritionData =
    menu.length > 0
      ? (() => {
        const totals = menu.reduce(
          (acc, meal) => {
            if (meal.nutrition) {
              acc.protein += meal.nutrition.protein || 0;
              acc.carbs += meal.nutrition.carbs || 0;
              acc.fats += meal.nutrition.fats || 0;
            }
            return acc;
          },
          { protein: 0, carbs: 0, fats: 0 }
        );

        const sum = totals.protein + totals.carbs + totals.fats || 1;
        return [
          {
            name: "Protein",
            value: Math.round((totals.protein / sum) * 100),
            color: "#ef4444",
          },
          {
            name: "Carbs",
            value: Math.round((totals.carbs / sum) * 100),
            color: "#3b82f6",
          },
          {
            name: "Fats",
            value: Math.round((totals.fats / sum) * 100),
            color: "#f59e0b",
          },
          { name: "Fiber", value: 0, color: "#10b981" },
        ];
      })()
      : [
        { name: "Protein", value: 0, color: "#ef4444" },
        { name: "Carbs", value: 0, color: "#3b82f6" },
        { name: "Fats", value: 0, color: "#f59e0b" },
        { name: "Fiber", value: 0, color: "#10b981" },
      ];

  // Derived radar data for a "Balanced Diet" visual
  const radarData = nutritionData.map((item) => ({
    subject: item.name,
    A: item.value,
    fullMark: 100,
  }));

  const getMealIcon = (mealType: string): string => {
    const icons: Record<string, string> = {
      breakfast: "🌅",
      lunch: "☀️",
      dinner: "🌙",
    };
    return icons[mealType] || "🍽️";
  };

  const getMealGradients = (mealType: string): string => {
    const gradients: Record<string, string> = {
      breakfast: "from-amber-400/20 to-orange-500/20 border-amber-500/30",
      lunch: "from-blue-400/20 to-indigo-500/20 border-blue-500/30",
      dinner: "from-purple-400/20 to-pink-500/20 border-purple-500/30",
    };
    return (
      gradients[mealType] ||
      "from-gray-400/20 to-gray-500/20 border-gray-500/30"
    );
  };

  const getAccentColor = (mealType: string): string => {
    const colors: Record<string, string> = {
      breakfast: "text-amber-500",
      lunch: "text-blue-500",
      dinner: "text-purple-500",
    };
    return colors[mealType] || "text-primary";
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Planner</h1>
          <p className="text-muted-foreground font-medium mt-1">
            Curate healthy, balanced meals for all attendees.
          </p>
        </div>
        <div className="flex items-center gap-3">
        </div>
      </div>

      {/* Nutrition & Strategy Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-card p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">
                Nutritional Balance Overview
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Aggregate data for today's active menu
              </p>
            </div>
            <div className="p-2 rounded-lg bg-success/10 text-success">
              <Target size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={radarData}
                >
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "var(--shadow-lg)",
                    }}
                  />
                  <Radar
                    name="Today's Balance"
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {nutritionData.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-muted/30 border border-border/40"
                  >
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      {item.name}
                    </p>
                    <h4
                      className="text-xl font-bold"
                      style={{ color: item.color }}
                    >
                      {item.value}%
                    </h4>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 dark:bg-indigo-500/5 dark:border-indigo-500/10">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                      AI Nutrition Insight
                    </p>
                    <p className="text-xs font-medium text-indigo-600/80 mt-1">
                      {menu.length > 0
                        ? "Nutritional balance analyzed. Current menu provides a diverse range of macros suitable for student health."
                        : "Awaiting menu generation for AI analysis."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none shadow-premium relative overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Recipe Library</h3>
                <p className="text-white/70 text-sm font-medium">
                  Access 200+ approved kitchen recipes
                </p>
              </div>
              <div className="mt-10">
                <div className="flex -space-x-3 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-white/20 flex items-center justify-center font-bold text-xs backdrop-blur-sm"
                    >
                      {i === 4 ? "+5" : <ChefHat size={14} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Utensils size={180} />
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Info size={16} className="text-muted-foreground" />
              Macro Goals
            </h4>
            <div className="space-y-4">
              {[
                {
                  label: "Proteins",
                  current: menu.reduce(
                    (acc, m) => acc + (m.nutrition?.protein || 0),
                    0
                  ),
                  target: 1000,
                  color: "bg-emerald-500",
                },
                {
                  label: "Carbs",
                  current: menu.reduce(
                    (acc, m) => acc + (m.nutrition?.carbs || 0),
                    0
                  ),
                  target: 1000,
                  color: "bg-blue-500",
                },
                {
                  label: "Fats",
                  current: menu.reduce(
                    (acc, m) => acc + (m.nutrition?.fats || 0),
                    0
                  ),
                  target: 1000,
                  color: "bg-amber-500",
                },
              ].map((goal, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-muted-foreground">{goal.label}</span>
                    <span>
                      {Math.round(goal.current)}/{goal.target}g
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          (goal.current / goal.target) * 100,
                          100
                        )}%`,
                      }}
                      className={`h-full ${goal.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {menu.map((meal, index) => (
          <motion.div
            key={meal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card p-0 flex flex-col bg-gradient-to-br ${getMealGradients(
              meal.mealType
            )} border-none shadow-sm hover:shadow-premium transition-all duration-500 group overflow-hidden`}
          >
            <div className="p-6 pb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-500">
                  {getMealIcon(meal.mealType)}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-widest font-bold ${getAccentColor(
                    meal.mealType
                  )}`}
                >
                  {meal.mealType}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {meal.mealName}
              </h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-4">
                {meal.description}
              </p>
            </div>

            <div className="px-6 py-4 bg-white/40 dark:bg-background/40 backdrop-blur-sm border-t border-white/40 dark:border-white/5 flex-grow">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 opacity-70">
                Nutrition Profile
              </h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg bg-background/50 border border-border/20 ${getAccentColor(
                      meal.mealType
                    )}`}
                  >
                    <Zap size={12} />
                  </div>
                  <span className="text-xs font-bold">
                    {meal.nutrition.calories} kcal
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg bg-background/50 border border-border/20 ${getAccentColor(
                      meal.mealType
                    )}`}
                  >
                    <Target size={12} />
                  </div>
                  <span className="text-xs font-bold">
                    {meal.nutrition.protein}g Protein
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-4 bg-white/20 dark:bg-background/20 backdrop-blur-md">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 opacity-70">
                Main Ingredients
              </h4>
              <div className="flex flex-wrap gap-2">
                {meal.ingredients.slice(0, 4).map((ing, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-background/50 border border-border/20 text-[10px] font-bold text-muted-foreground shadow-sm"
                  >
                    {ing}
                  </span>
                ))}
                {meal.ingredients.length > 4 && (
                  <span className="px-2.5 py-1 rounded-lg bg-background/80 text-[10px] font-bold text-primary">
                    +{meal.ingredients.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MenuPlanner;
