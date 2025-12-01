import RiskDashboard from "@/components/RiskDashboard";
import { TrendingUp } from "lucide-react";

export default function GrowthStocksPage() {
    return (
        <RiskDashboard
            productName="Growth Stocks"
            riskLevel="High"
            volatility={25}
            baseReturnRate={15}
            description="High-growth companies with significant appreciation potential but higher volatility"
            icon={<TrendingUp className="h-12 w-12" />}
            color="#ec4899"
        />
    );
}
