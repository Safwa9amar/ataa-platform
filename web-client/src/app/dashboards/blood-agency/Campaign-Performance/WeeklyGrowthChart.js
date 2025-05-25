"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/UI/card";
import { TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export const weeklyGrowthData = [
  { week: 'الأسبوع 1', donors: 320 },
  { week: 'الأسبوع 2', donors: 380 },
  { week: 'الأسبوع 3', donors: 450 },
  { week: 'الأسبوع 4', donors: 420 },
  { week: 'الأسبوع 5', donors: 520 },
  { week: 'الأسبوع 6', donors: 580 },
  { week: 'الأسبوع 7', donors: 620 },
  { week: 'الأسبوع 8', donors: 750 },
];

export function WeeklyGrowthChart() {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-1">
          <CardTitle className="text-xl">نمو المتبرعين الأسبوعي</CardTitle>
          <CardDescription>
            عدد المتبرعين خلال آخر 8 أسابيع
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
          <TrendingUp className="h-4 w-4" />
          <span>15.8%</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-80 w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={weeklyGrowthData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="colorDonors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="week" 
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
                formatter={(value, name) => {
                  if (name === "donors") return [value, "عدد المتبرعين"];
                  return [value, name];
                }}
              />
              <Legend 
                formatter={(value) => {
                  if (value === "donors") return "عدد المتبرعين";
                  return value;
                }}
              />
              <Line
                type="monotone"
                dataKey="donors"
                name="عدد المتبرعين"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                dot={{ r: 4 }}
                fill="url(#colorDonors)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
