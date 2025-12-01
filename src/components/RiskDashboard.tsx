"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, TrendingDown, Activity, Plus, Trash2, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/context/PortfolioContext";

interface RiskDashboardProps {
    productName: string;
    riskLevel: "Low" | "Medium" | "High" | "Very High";
    volatility: number; // percentage
    baseReturnRate: number; // annual percentage (initial default)
    description: string;
    icon: React.ReactNode;
    color: string;
}

export default function RiskDashboard({
    productName,
    riskLevel,
    volatility,
    baseReturnRate,
    description,
    icon,
    color,
}: RiskDashboardProps) {
    const [timeHorizon, setTimeHorizon] = useState([5]); // years

    // Use global portfolio context
    const { investments, returnRates, addEntry, removeEntry, updateEntry, updateReturnRate } = usePortfolio();
    const entries = investments[productName] || [];

    // Use global return rate if available, otherwise fallback to prop (though context should always have it)
    const currentReturnRate = returnRates[productName] ?? baseReturnRate;

    // Calculate totals from all entries
    const totalInitialInvestment = entries.reduce((sum, entry) => sum + entry.initial, 0);
    const totalAnnualInvestment = entries.reduce((sum, entry) => sum + entry.annual, 0);

    const handleAddEntry = () => {
        addEntry(productName);
    };

    const handleRemoveEntry = (id: string) => {
        removeEntry(productName, id);
    };

    const handleUpdateEntry = (id: string, field: "name" | "initial" | "annual", value: string | number) => {
        updateEntry(productName, id, field, value);
    };

    // Calculate projected return based on totals
    const calculateProjectedReturn = (years: number) => {
        const annualReturn = currentReturnRate / 100;

        // Future value of total initial investment
        const fvInitial = totalInitialInvestment * Math.pow(1 + annualReturn, years);

        // Future value of total annual contributions (annuity)
        let fvAnnual = 0;
        if (totalAnnualInvestment > 0 && annualReturn > 0) {
            fvAnnual = totalAnnualInvestment * ((Math.pow(1 + annualReturn, years) - 1) / annualReturn);
        } else if (totalAnnualInvestment > 0 && annualReturn === 0) {
            fvAnnual = totalAnnualInvestment * years;
        }

        const totalFutureValue = fvInitial + fvAnnual;
        return totalFutureValue.toFixed(2);
    };

    const calculateTotalReturn = (years: number) => {
        const totalInvested = totalInitialInvestment + (totalAnnualInvestment * years);
        if (totalInvested === 0) return "0.00";
        const futureValue = parseFloat(calculateProjectedReturn(years));
        const totalReturn = ((futureValue - totalInvested) / totalInvested) * 100;
        return totalReturn.toFixed(2);
    };

    const calculateTotalInvested = (years: number) => {
        return totalInitialInvestment + (totalAnnualInvestment * years);
    };

    const getRiskColor = () => {
        switch (riskLevel) {
            case "Low": return "text-green-600 dark:text-green-400";
            case "Medium": return "text-yellow-600 dark:text-yellow-400";
            case "High": return "text-orange-600 dark:text-orange-400";
            case "Very High": return "text-red-600 dark:text-red-400";
        }
    };

    const getRiskBgColor = () => {
        switch (riskLevel) {
            case "Low": return "bg-green-100 dark:bg-green-900/20";
            case "Medium": return "bg-yellow-100 dark:bg-yellow-900/20";
            case "High": return "bg-orange-100 dark:bg-orange-900/20";
            case "Very High": return "bg-red-100 dark:bg-red-900/20";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <Card className="border-2 shadow-xl" style={{ borderColor: color }}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                className="p-4 rounded-xl shadow-lg"
                                style={{ backgroundColor: color + "20" }}
                            >
                                <div style={{ color }}>{icon}</div>
                            </div>
                            <div>
                                <CardTitle className="text-3xl">{productName}</CardTitle>
                                <CardDescription className="text-base mt-1">{description}</CardDescription>
                            </div>
                        </div>
                        <Link href="/">
                            <Button variant="outline" size="icon" title="Back to Dashboard">
                                <Home className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
            </Card>

            {/* Risk Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Risk Level */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Risk Level
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-3xl font-bold ${getRiskColor()}`}>
                            {riskLevel}
                        </div>
                        <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium inline-block ${getRiskBgColor()} ${getRiskColor()}`}>
                            {riskLevel === "Low" && "Conservative"}
                            {riskLevel === "Medium" && "Moderate"}
                            {riskLevel === "High" && "Aggressive"}
                            {riskLevel === "Very High" && "Speculative"}
                        </div>
                    </CardContent>
                </Card>

                {/* Volatility */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingDown className="h-4 w-4" />
                            Volatility
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{volatility}%</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                            Annual price fluctuation
                        </div>
                    </CardContent>
                </Card>

                {/* Base Return Rate (Editable) */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Expected Return
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                value={currentReturnRate}
                                onChange={(e) => updateReturnRate(productName, parseFloat(e.target.value) || 0)}
                                className="text-3xl font-bold text-green-600 dark:text-green-400 h-12 w-24 px-2"
                                step="0.1"
                            />
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">%</span>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                            Annual average (Editable)
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Projected Returns Calculator */}
            <Card className="shadow-xl border-2">
                <CardHeader>
                    <CardTitle className="text-2xl">Projected Returns Calculator</CardTitle>
                    <CardDescription>
                        Add multiple investment entries to see your total projected returns
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Investment Entries List */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium text-muted-foreground">Investment Entries ({entries.length}/10)</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAddEntry}
                                disabled={entries.length >= 10}
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" /> Add Entry
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {entries.map((entry, index) => (
                                <div key={entry.id} className="grid grid-cols-12 gap-3 items-end p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                                    <div className="col-span-12 md:col-span-4 space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground">Provider / Name</label>
                                        <Input
                                            value={entry.name}
                                            onChange={(e) => handleUpdateEntry(entry.id, 'name', e.target.value)}
                                            placeholder="e.g. Vanguard"
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-3 space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground">Initial ($)</label>
                                        <Input
                                            type="number"
                                            value={entry.initial}
                                            onChange={(e) => handleUpdateEntry(entry.id, 'initial', parseFloat(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-3 space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground">Annual ($)</label>
                                        <Input
                                            type="number"
                                            value={entry.annual}
                                            onChange={(e) => handleUpdateEntry(entry.id, 'annual', parseFloat(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full md:w-auto"
                                            onClick={() => handleRemoveEntry(entry.id)}
                                            disabled={entries.length <= 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Time Horizon Slider */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">Time Horizon</label>
                            <span className="text-2xl font-bold" style={{ color }}>
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

                    {/* Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl">
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Total Invested</div>
                            <div className="text-3xl font-bold">
                                ${calculateTotalInvested(timeHorizon[0]).toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Total Initial: ${totalInitialInvestment.toLocaleString()} <br />
                                Total Annual: ${totalAnnualInvestment.toLocaleString()} / yr
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Projected Value</div>
                            <div className="text-3xl font-bold" style={{ color }}>
                                ${parseFloat(calculateProjectedReturn(timeHorizon[0])).toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                After {timeHorizon[0]} {timeHorizon[0] === 1 ? "year" : "years"}
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <div className="text-sm text-muted-foreground">Total Return</div>
                            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                                +{calculateTotalReturn(timeHorizon[0])}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                                ${(parseFloat(calculateProjectedReturn(timeHorizon[0])) - calculateTotalInvested(timeHorizon[0])).toLocaleString()} gain over {timeHorizon[0]} {timeHorizon[0] === 1 ? "year" : "years"}
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                        <strong>Disclaimer:</strong> These projections are based on historical averages and do not guarantee future performance.
                        Actual returns may vary significantly due to market conditions, fees, and other factors.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
