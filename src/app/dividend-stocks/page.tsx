import RiskDashboard from "@/components/RiskDashboard";
import { DollarSign } from "lucide-react";

export default function DividendStocksPage() {
    return (
        <RiskDashboard
            productName="Dividend Stocks"
            riskLevel="High"
            volatility={20}
            baseReturnRate={12}
            description="Established companies providing regular dividend income with moderate growth potential"
            icon={<DollarSign className="h-12 w-12" />}
            color="#14b8a6"
        />
    );
}
