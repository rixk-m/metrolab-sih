import type { Metadata } from "next";
import { DashboardContent } from "./dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "MetroLab laboratory dashboard — evaluations, instruments, compliance overview",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
