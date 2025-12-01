"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    PiggyBank,
    TrendingUp,
    LineChart,
    Bitcoin,
    LayoutDashboard,
    TrendingUp as GrowthIcon,
    DollarSign,
    LogIn,
    LogOut,
    User
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { supabase } from "@/lib/supabase";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Savings", href: "/savings", icon: PiggyBank },
    { name: "Bonds", href: "/bonds", icon: TrendingUp },
    { name: "Index Funds", href: "/index-funds", icon: LineChart },
    { name: "Growth Stocks", href: "/growth-stocks", icon: GrowthIcon },
    { name: "Dividend Stocks", href: "/dividend-stocks", icon: DollarSign },
    { name: "Crypto", href: "/crypto", icon: Bitcoin },
];

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = usePortfolio();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-r border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Finance Risk
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Dashboard</p>
                </div>

                <nav className="px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "default" : "ghost"}
                                    className={`w-full justify-start gap-3 transition-all ${isActive
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.name}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                {/* Authentication Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    {user ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <User className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium truncate">{user.email}</span>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full gap-2"
                                onClick={handleSignOut}
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button
                                variant="default"
                                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
                            >
                                <LogIn className="h-4 w-4" />
                                Sign In
                            </Button>
                        </Link>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
