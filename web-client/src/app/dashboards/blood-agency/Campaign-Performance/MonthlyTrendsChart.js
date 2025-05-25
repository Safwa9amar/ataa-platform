"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/UI/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

export const monthlyGrowthData = [
  { month: 'يناير', donors: 1200 },
  { month: 'فبراير', donors: 1350 },
  { month: 'مارس', donors: 1500 },
  { month: 'أبريل', donors: 1650 },
  { month: 'ماي', donors: 1800 },
  { month: 'يونيو', donors: 2100 },
];

export function MonthlyTrendsChart() {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-1">
          <CardTitle className="text-xl">معدلات النمو الشهرية</CardTitle>
          <CardDescription>
            تطور عدد المتبرعين شهريًا في جميع المناطق
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
          <TrendingUp className="h-4 w-4" />
          <span>٪18.2</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-80 w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyGrowthData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  color: 'hsl(var(--card-foreground))'
                }} 
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="donors"
                name="عدد المتبرعين"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                fill="url(#colorTrend)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
