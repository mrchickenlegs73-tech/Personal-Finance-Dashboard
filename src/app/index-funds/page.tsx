import RiskDashboard from "@/components/RiskDashboard";
import { LineChart } from "lucide-react";

export default function IndexFundsPage() {
    return (
        <RiskDashboard
            productName="Index Funds"
            riskLevel="High"
            volatility={18}
            baseReturnRate={9}
            description="Diversified market index funds tracking major stock indices with long-term growth potential"
            icon={<LineChart className="h-12 w-12" />}
            color="#3b82f6"
        />
    );
}
