import RiskDashboard from "@/components/RiskDashboard";
import { Bitcoin } from "lucide-react";

export default function CryptoPage() {
    return (
        <RiskDashboard
            productName="Crypto"
            riskLevel="Very High"
            volatility={65}
            baseReturnRate={15}
            description="Digital assets with extreme volatility and potential for significant gains or losses"
            icon={<Bitcoin className="h-12 w-12" />}
            color="#8b5cf6"
        />
    );
}
