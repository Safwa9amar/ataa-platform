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
  ReferenceLine,
} from "recharts";

export const locationPerformanceData = [
  { location: "المستشفى المركزي", donors: 1245, target: 1500 },
  { location: "مركز الجامعة الطبي", donors: 980, target: 1200 },
  { location: "عيادة شرق الحي", donors: 845, target: 1000 },
  { location: "مركز صحة غرب المدينة", donors: 730, target: 800 },
  { location: "مستشفى المجتمع الجنوبي", donors: 570, target: 800 },
];

export function LocationPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>أداء المراكز</CardTitle>
        <CardDescription>
          عدد المتبرعين الحالي مقارنة بالهدف في كل مركز
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={locationPerformanceData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="location"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--card-foreground))",
                }}
              />
              <Legend />
              <Bar
                dataKey="donors"
                name="عدد المتبرعين"
                fill="hsl(var(--chart-4))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="target"
                name="الهدف"
                fill="hsl(var(--chart-5))"
                radius={[4, 4, 0, 0]}
              />
              {locationPerformanceData.map((entry, index) => (
                <ReferenceLine
                  key={`ref-${index}`}
                  x={entry.location}
                  y={entry.target}
                  stroke="hsl(var(--foreground))"
                  strokeDasharray="3 3"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
