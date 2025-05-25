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
  Cell,
} from "recharts";

export const campaignPerformance = {
  totalDonors: 3847,
  growthRate: 12.5,
  bloodCollected: 3271,
  targetBloodCollection: 5000,
  topLocation: "المستشفى المركزي",
  averageDonationTime: 28, // دقائق
};

const data = [
  {
    name: "المجمّع",
    value: campaignPerformance.bloodCollected,
  },
  {
    name: "المستهدف",
    value: campaignPerformance.targetBloodCollection,
  },
];

export function DonationMetrics() {
  const completionPercentage = Math.round(
    (campaignPerformance.bloodCollected /
      campaignPerformance.targetBloodCollection) *
      100
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>تقدم جمع الدم</CardTitle>
        <CardDescription>الدم المُجمّع مقابل الهدف المطلوب</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">معدل الجمع</p>
            <p className="text-3xl font-bold">{completionPercentage}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">الوحدات المجمّعة</p>
            <p className="text-xl font-semibold">
              {campaignPerformance.bloodCollected} /{" "}
              {campaignPerformance.targetBloodCollection}
            </p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 40,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                opacity={0.2}
              />
              <XAxis
                type="number"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "hsl(var(--foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--card-foreground))",
                }}
                formatter={(value) => [`${value} وحدة`, "وحدات دم"]}
              />
              <Legend />
              <Bar dataKey="value" name="وحدات الدم">
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? "hsl(var(--destructive))"
                        : "hsl(var(--muted))"
                    }
                    radius={[4, 4, 4, 4]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
