"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Droplet, MapPin, TrendingUp, Users } from "lucide-react";

const campaignPerformance = {
  totalDonors: 3847,
  growthRate: 12.5,
  bloodCollected: 3271,
  targetBloodCollection: 5000,
  topLocation: 'المستشفى المركزي',
  averageDonationTime: 28, // بالدقائق
};

export function CampaignOverview() {
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-primary/50 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي المتبرعين</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-3xl font-bold">{campaignPerformance.totalDonors.toLocaleString()}</div>
          <div className="mt-1 flex items-center text-sm text-muted-foreground">
            <span className="ml-1">نسبة نمو</span>
            <span className="text-teal-500 font-medium">{campaignPerformance.growthRate}%</span>
            <TrendingUp className="mr-1 h-4 w-4 text-teal-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-primary/50 pb-2">
          <CardTitle className="text-sm font-medium">الدم المتبرع به</CardTitle>
          <Droplet className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-3xl font-bold">{campaignPerformance.bloodCollected.toLocaleString()} وحدة</div>
          <div className="mt-1 flex items-center text-sm text-muted-foreground">
            <span>الهدف: {campaignPerformance.targetBloodCollection.toLocaleString()} وحدة</span>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-primary/50 pb-2">
          <CardTitle className="text-sm font-medium">أفضل موقع</CardTitle>
          <MapPin className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-xl font-bold line-clamp-1">{campaignPerformance.topLocation}</div>
          <div className="mt-1 text-sm text-muted-foreground">أعلى نسبة حضور للمتبرعين</div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-primary/50 pb-2">
          <CardTitle className="text-sm font-medium">متوسط مدة التبرع</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-3xl font-bold">{campaignPerformance.averageDonationTime} دقيقة</div>
          <div className="mt-1 text-sm text-muted-foreground">من التسجيل حتى الإتمام</div>
        </CardContent>
      </Card>
    </>
  );
}
