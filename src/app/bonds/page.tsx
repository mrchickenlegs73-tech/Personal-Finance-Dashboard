import RiskDashboard from "@/components/RiskDashboard";
import { TrendingUp } from "lucide-react";

export default function BondsPage() {
    return (
        <RiskDashboard
            productName="Bonds"
            riskLevel="Medium"
            volatility={8}
            baseReturnRate={5}
            description="Fixed-income securities that provide regular interest payments with moderate risk"
            icon={<TrendingUp className="h-12 w-12" />}
            color="#f59e0b"
        />
    );
}
