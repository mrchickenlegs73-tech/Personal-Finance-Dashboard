import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PiggyBank, TrendingUp, LineChart, Bitcoin, ArrowRight, TrendingUp as GrowthIcon, DollarSign } from "lucide-react";
import Layout from "@/components/Layout";
import PortfolioSummary from "@/components/PortfolioSummary";

const products = [
  {
    name: "Savings",
    href: "/savings",
    icon: PiggyBank,
    color: "#10b981",
    risk: "Low",
    return: "2-3%",
    description: "Safe and stable returns with minimal risk",
  },
  {
    name: "Bonds",
    href: "/bonds",
    icon: TrendingUp,
    color: "#f59e0b",
    risk: "Medium",
    return: "4-6%",
    description: "Fixed income with moderate stability",
  },
  {
    name: "Index Funds",
    href: "/index-funds",
    icon: LineChart,
    color: "#3b82f6",
    risk: "Medium-High",
    return: "8-10%",
    description: "Diversified market exposure with growth potential",
  },
  {
    name: "Growth Stocks",
    href: "/growth-stocks",
    icon: GrowthIcon,
    color: "#ec4899",
    risk: "High",
    return: "12-15%",
    description: "High-growth companies with significant appreciation potential",
  },
  {
    name: "Dividend Stocks",
    href: "/dividend-stocks",
    icon: DollarSign,
    color: "#14b8a6",
    risk: "High",
    return: "10-12%",
    description: "Regular dividend income with moderate growth",
  },
  {
    name: "Crypto",
    href: "/crypto",
    icon: Bitcoin,
    color: "#8b5cf6",
    risk: "Very High",
    return: "Variable",
    description: "High volatility with potential for significant gains",
  },
];

export default function Home() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Personal Finance Risk Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Compare risk profiles and projected returns across different investment products
          </p>
        </div>

        {/* Portfolio Summary */}
        <PortfolioSummary />

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const Icon = product.icon;

            return (
              <Card
                key={product.name}
                className="group hover:shadow-2xl transition-all duration-300 border-2 hover:scale-[1.02]"
                style={{ borderColor: product.color + "40" }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="p-3 rounded-xl shadow-lg"
                        style={{ backgroundColor: product.color + "20" }}
                      >
                        <Icon className="h-8 w-8" style={{ color: product.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{product.name}</CardTitle>
                        <CardDescription className="mt-1">{product.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Risk Level</div>
                      <div className="text-lg font-semibold" style={{ color: product.color }}>
                        {product.risk}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Expected Return</div>
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {product.return}
                      </div>
                    </div>
                  </div>

                  <Link href={product.href}>
                    <Button
                      className="w-full group-hover:shadow-lg transition-all"
                      style={{
                        background: `linear-gradient(to right, ${product.color}, ${product.color}dd)`
                      }}
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2">
          <CardHeader>
            <CardTitle>How to Use This Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Select a financial product to view detailed risk analysis and projected returns</p>
            <p>• Use the time horizon slider to see how your investment could grow over time</p>
            <p>• Compare different products to find the right balance of risk and return for your goals</p>
            <p>• All projections are based on historical data and should be used for educational purposes only</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
