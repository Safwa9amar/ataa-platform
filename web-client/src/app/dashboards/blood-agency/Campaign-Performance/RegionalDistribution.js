"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const regionalDistributionData = [
  { region: "الشمال", donors: 856, percentage: 22 },
  { region: "الجنوب", donors: 1245, percentage: 32 },
  { region: "الشرق", donors: 968, percentage: 25 },
  { region: "الغرب", donors: 778, percentage: 21 },
];

export function RegionalDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>التوزيع الجهوي</CardTitle>
        <CardDescription>نسبة التبرعات حسب الجهة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={regionalDistributionData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="region"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="hsl(var(--chart-2))"
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--chart-3))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--card-foreground))",
                }}
                formatter={(value, name) => {
                  if (name === "percentage") return [`${value}%`, "النسبة"];
                  return [value, "عدد المتبرعين"];
                }}
              />
              <Legend
                formatter={(value) => {
                  if (value === "percentage") return "النسبة";
                  if (value === "donors") return "عدد المتبرعين";
                  return value;
                }}
              />
              <Bar
                yAxisId="left"
                dataKey="percentage"
                fill="hsl(var(--chart-2))"
                radius={[4, 4, 0, 0]}
                name="النسبة"
              />
              <Bar
                yAxisId="right"
                dataKey="donors"
                fill="hsl(var(--chart-3))"
                radius={[4, 4, 0, 0]}
                name="عدد المتبرعين"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
