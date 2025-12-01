"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

interface Product {
    name: string;
    color: string;
    // baseReturnRate removed as we use context now
}

const products: Product[] = [
    { name: "Savings", color: "#10b981" },
    { name: "Bonds", color: "#f59e0b" },
    { name: "Index Funds", color: "#3b82f6" },
    { name: "Growth Stocks", color: "#ec4899" },
    { name: "Dividend Stocks", color: "#14b8a6" },
    { name: "Crypto", color: "#8b5cf6" },
];

export default function PortfolioSummary() {
    const [timeHorizon, setTimeHorizon] = useState([10]); // years
    const { getProductTotals, returnRates, investments } = usePortfolio();

    const calculateProjectedValue = (
        initial: number,
        annual: number,
        returnRate: number,
        years: number
    ) => {
        const r = returnRate / 100;

        // Future value of initial investment
        const fvInitial = initial * Math.pow(1 + r, years);

        // Future value of annual contributions
        let fvAnnual = 0;
        if (annual > 0 && r > 0) {
            fvAnnual = annual * ((Math.pow(1 + r, years) - 1) / r);
        } else if (annual > 0 && r === 0) {
            fvAnnual = annual * years;
        }

        return fvInitial + fvAnnual;
    };

    const getTotalInitial = () => {
        return products.reduce((sum, product) => sum + getProductTotals(product.name).totalInitial, 0);
    };

    const getTotalAnnual = () => {
        return products.reduce((sum, product) => sum + getProductTotals(product.name).totalAnnual, 0);
    };

    const getTotalProjected = () => {
        return products.reduce((sum, product) => {
            const { totalInitial, totalAnnual } = getProductTotals(product.name);
            const rate = returnRates[product.name] || 0;
            return sum + calculateProjectedValue(
                totalInitial,
                totalAnnual,
                rate,
                timeHorizon[0]
            );
        }, 0);
    };

    const getTotalInvested = () => {
        return getTotalInitial() + (getTotalAnnual() * timeHorizon[0]);
    };

    const getTotalReturn = () => {
        const totalInvested = getTotalInvested();
        const totalProjected = getTotalProjected();
        if (totalInvested === 0) return 0;
        return ((totalProjected - totalInvested) / totalInvested) * 100;
    };

    const downloadCSV = (type: 'summary' | 'detailed') => {
        let csvContent = "data:text/csv;charset=utf-8,";

        if (type === 'summary') {
            csvContent += "Product,Total Initial,Total Annual,Return Rate (%),Projected Value (" + timeHorizon[0] + " Years)\n";
            products.forEach(product => {
                const { totalInitial, totalAnnual } = getProductTotals(product.name);
                const rate = returnRates[product.name] || 0;
                const projected = calculateProjectedValue(totalInitial, totalAnnual, rate, timeHorizon[0]);
                csvContent += `${product.name},${totalInitial},${totalAnnual},${rate},${projected.toFixed(2)}\n`;
            });
            // Add Total Row
            csvContent += `TOTAL,${getTotalInitial()},${getTotalAnnual()},,${getTotalProjected().toFixed(2)}\n`;
        } else {
            csvContent += "Product,Provider Name,Initial Investment,Annual Investment\n";
            products.forEach(product => {
                const entries = investments[product.name] || [];
                entries.forEach(entry => {
                    csvContent += `${product.name},${entry.name},${entry.initial},${entry.annual}\n`;
                });
            });
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `portfolio_${type}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className="shadow-xl border-2">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl">Portfolio Summary</CardTitle>
                        <CardDescription>
                            Track your investments across all products and see projected returns.
                            <br />
                            <span className="text-xs text-muted-foreground">
                                * Values are automatically populated from individual product pages.
                            </span>
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => downloadCSV('summary')}>
                            <Download className="h-4 w-4 mr-2" /> Summary CSV
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => downloadCSV('detailed')}>
                            <Download className="h-4 w-4 mr-2" /> Detailed CSV
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Time Horizon Slider */}
                <div className="space-y-4 pb-4 border-b">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Projection Time Horizon</label>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {timeHorizon[0]} {timeHorizon[0] === 1 ? "Year" : "Years"}
                        </span>
                    </div>
                    <Slider
                        value={timeHorizon}
                        onValueChange={setTimeHorizon}
                        min={1}
                        max={30}
                        step={1}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1 year</span>
                        <span>30 years</span>
                    </div>
                </div>

                {/* Investment Table */}
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-bold">Product</TableHead>
                                <TableHead className="font-bold">Total Initial</TableHead>
                                <TableHead className="font-bold">Total Annual</TableHead>
                                <TableHead className="font-bold">Return Rate</TableHead>
                                <TableHead className="font-bold text-right">Projected Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => {
                                const { totalInitial, totalAnnual } = getProductTotals(product.name);
                                const rate = returnRates[product.name] || 0;
                                const projected = calculateProjectedValue(
                                    totalInitial,
                                    totalAnnual,
                                    rate,
                                    timeHorizon[0]
                                );

                                return (
                                    <TableRow key={product.name}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: product.color }}
                                                />
                                                {product.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            ${totalInitial.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            ${totalAnnual.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {rate}%
                                        </TableCell>
                                        <TableCell className="text-right font-semibold" style={{ color: product.color }}>
                                            ${projected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {/* Totals Row */}
                            <TableRow className="bg-muted/50 font-bold">
                                <TableCell>TOTAL</TableCell>
                                <TableCell>
                                    ${getTotalInitial().toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    ${getTotalAnnual().toLocaleString()}
                                </TableCell>
                                <TableCell>-</TableCell>
                                <TableCell className="text-right text-green-600 dark:text-green-400">
                                    ${getTotalProjected().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Total Invested</div>
                        <div className="text-2xl font-bold">
                            ${getTotalInvested().toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Over {timeHorizon[0]} {timeHorizon[0] === 1 ? "year" : "years"}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Portfolio Value</div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            ${getTotalProjected().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            After {timeHorizon[0]} {timeHorizon[0] === 1 ? "year" : "years"}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Total Return</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {getTotalReturn() > 0 ? "+" : ""}{getTotalReturn().toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                            ${(getTotalProjected() - getTotalInvested()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gain
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
