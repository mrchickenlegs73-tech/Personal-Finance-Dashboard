import RiskDashboard from "@/components/RiskDashboard";
import { PiggyBank } from "lucide-react";

export default function SavingsPage() {
    return (
        <RiskDashboard
            productName="Savings"
            riskLevel="Low"
            volatility={1}
            baseReturnRate={2.5}
            description="Traditional savings accounts offer FDIC insurance and guaranteed returns with minimal risk"
            icon={<PiggyBank className="h-12 w-12" />}
            color="#10b981"
        />
    );
}
