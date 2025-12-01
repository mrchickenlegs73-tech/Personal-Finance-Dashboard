"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface InvestmentEntry {
    id: string;
    name: string;
    initial: number;
    annual: number;
}

interface PortfolioContextType {
    investments: { [productName: string]: InvestmentEntry[] };
    returnRates: { [productName: string]: number };
    user: any | null;
    addEntry: (productName: string) => void;
    removeEntry: (productName: string, id: string) => void;
    updateEntry: (productName: string, id: string, field: keyof InvestmentEntry, value: string | number) => void;
    updateReturnRate: (productName: string, rate: number) => void;
    getProductTotals: (productName: string) => { totalInitial: number; totalAnnual: number };
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);

    // Initialize with deterministic default data to avoid hydration mismatch
    const [investments, setInvestments] = useState<{ [productName: string]: InvestmentEntry[] }>({
        "Savings": [{ id: '1', name: 'Primary Savings', initial: 10000, annual: 0 }],
        "Bonds": [{ id: '1', name: 'Government Bonds', initial: 0, annual: 0 }],
        "Index Funds": [{ id: '1', name: 'S&P 500', initial: 0, annual: 0 }],
        "Growth Stocks": [{ id: '1', name: 'Tech ETF', initial: 0, annual: 0 }],
        "Dividend Stocks": [{ id: '1', name: 'Dividend Aristocrats', initial: 0, annual: 0 }],
        "Crypto": [{ id: '1', name: 'Bitcoin', initial: 0, annual: 0 }],
    });

    const [returnRates, setReturnRates] = useState<{ [productName: string]: number }>({
        "Savings": 2.5,
        "Bonds": 5,
        "Index Funds": 9,
        "Growth Stocks": 15,
        "Dividend Stocks": 12,
        "Crypto": 15,
    });

    // Auth Listener and Data Fetching
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);

            if (session?.user) {
                try {
                    const { data, error } = await supabase
                        .from('portfolios')
                        .select('investments, return_rates')
                        .eq('user_id', session.user.id)
                        .single();

                    if (data) {
                        if (data.investments) setInvestments(data.investments);
                        if (data.return_rates) setReturnRates(data.return_rates);
                    } else if (error && error.code !== 'PGRST116') {
                        // PGRST116 is "Row not found", which is fine for new users
                        console.error('Error fetching portfolio:', error);
                    }
                } catch (err) {
                    console.error('Unexpected error fetching portfolio:', err);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Sync to Supabase
    useEffect(() => {
        const saveData = async () => {
            if (!user) return;

            try {
                const { error } = await supabase
                    .from('portfolios')
                    .upsert({
                        user_id: user.id,
                        investments,
                        return_rates: returnRates,
                        updated_at: new Date().toISOString()
                    });

                if (error) {
                    console.error('Error saving portfolio:', error);
                }
            } catch (err) {
                console.error('Unexpected error saving portfolio:', err);
            }
        };

        // Debounce save to avoid too many requests
        const timeoutId = setTimeout(saveData, 1000);
        return () => clearTimeout(timeoutId);
    }, [investments, returnRates, user]);

    const addEntry = (productName: string) => {
        // Initialize array if it doesn't exist (safety check)
        const currentEntries = investments[productName] || [];
        if (currentEntries.length >= 10) return;

        const newId = Math.random().toString(36).substr(2, 9);
        const newEntry: InvestmentEntry = {
            id: newId,
            name: `Investment ${currentEntries.length + 1}`,
            initial: 0,
            annual: 0
        };

        setInvestments(prev => ({
            ...prev,
            [productName]: [...(prev[productName] || []), newEntry]
        }));
    };

    const removeEntry = (productName: string, id: string) => {
        if (!investments[productName] || investments[productName].length <= 1) return;
        setInvestments(prev => ({
            ...prev,
            [productName]: prev[productName].filter(entry => entry.id !== id)
        }));
    };

    const updateEntry = (productName: string, id: string, field: keyof InvestmentEntry, value: string | number) => {
        setInvestments(prev => ({
            ...prev,
            [productName]: (prev[productName] || []).map(entry => {
                if (entry.id === id) {
                    return { ...entry, [field]: value };
                }
                return entry;
            })
        }));
    };

    const updateReturnRate = (productName: string, rate: number) => {
        setReturnRates(prev => ({
            ...prev,
            [productName]: rate
        }));
    };

    const getProductTotals = (productName: string) => {
        const productEntries = investments[productName] || [];
        const totalInitial = productEntries.reduce((sum, entry) => sum + entry.initial, 0);
        const totalAnnual = productEntries.reduce((sum, entry) => sum + entry.annual, 0);
        return { totalInitial, totalAnnual };
    };

    return (
        <PortfolioContext.Provider value={{ investments, returnRates, user, addEntry, removeEntry, updateEntry, updateReturnRate, getProductTotals }}>
            {children}
        </PortfolioContext.Provider>
    );
}

export function usePortfolio() {
    const context = useContext(PortfolioContext);
    if (context === undefined) {
        throw new Error("usePortfolio must be used within a PortfolioProvider");
    }
    return context;
}
