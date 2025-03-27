import {
  CheckCircleIcon,
  ClockIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const linkData = [
  {
    name: "active",
    href: "/dashboards/charity/create-donation-oppertunity?status=active",
    label: "البرامج النشطة",
    Icon: CheckCircleIcon,
  },
  {
    name: "pending",
    href: "/dashboards/charity/create-donation-oppertunity?status=pending",
    label: "البرامج المعلقة",
    Icon: ClockIcon,
  },
  {
    name: "rejected",
    href: "/dashboards/charity/create-donation-oppertunity?status=rejected",
    label: "البرامج المرفوضة",
    Icon: XCircleIcon,
  },
  {
    name: "create",
    href: "/dashboards/charity/create-donation-oppertunity/create?status=create",
    label: "إنشاء فرصة",
    Icon: PlusCircleIcon,
  },
];

export default function Tabs() {
  return (
    <div className="flex flex-wrap gap-2 h-fit">
      {linkData.map((link) => (
        <LLink key={link.name} {...link} />
      ))}
    </div>
  );
}

const LLink = ({ href, name, label, Icon }) => {
  const queryParams = useSearchParams();
  const status = queryParams.get("status");
  const isActive = status === name;

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm border transition-transform focus:scale-95 ${
        isActive ? "bg-teal-700 text-white" : "border-teal-700 text-teal-700"
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
};
