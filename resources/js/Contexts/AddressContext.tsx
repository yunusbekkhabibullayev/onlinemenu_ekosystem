import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const STORAGE_KEY = 'delivery_address';
const ONBOARDING_KEY = 'onboarding_completed';
const ADDRESS_CONFIRMED_KEY = 'address_confirmed';

export type AddressType = 'house' | 'apartment';

export interface DeliveryAddress {
    street: string;
    city?: string;
    addressName?: string;
    customAddressName?: string;
    entrance?: string;
    floor?: string;
    apartment?: string;
    note?: string;
    addressType?: AddressType;
}

interface AddressContextType {
    address: DeliveryAddress | null;
    setAddress: (addr: DeliveryAddress | null) => void;
    isAddressConfirmed: boolean;
    confirmAddress: (addr: DeliveryAddress) => void;
    skipAddress: () => void;
    clearAddress: () => void;
    onboardingCompleted: boolean;
    completeOnboarding: () => void;
    isEditingAddress: boolean;
    openAddressForm: () => void;
    closeAddressForm: () => void;
}

const AddressContext = createContext<AddressContextType | null>(null);

export function AddressProvider({ children }: { children: ReactNode }) {
    const [address, setAddressState] = useState<DeliveryAddress | null>(null);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const confirmed = localStorage.getItem(ADDRESS_CONFIRMED_KEY) === 'true';
            const onboarding = localStorage.getItem(ONBOARDING_KEY) === 'true';
            if (saved) {
                setAddressState(JSON.parse(saved));
            }
            setIsAddressConfirmed(confirmed);
            setOnboardingCompleted(onboarding);
        } catch {
            // ignore
        }
    }, []);

    const setAddress = (addr: DeliveryAddress | null) => {
        setAddressState(addr);
        if (addr) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(addr));
        } else {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(ADDRESS_CONFIRMED_KEY);
        }
    };

    const confirmAddress = (addr: DeliveryAddress) => {
        setAddressState(addr);
        setIsAddressConfirmed(true);
        setIsEditingAddress(false);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(addr));
        localStorage.setItem(ADDRESS_CONFIRMED_KEY, 'true');
    };

    const skipAddress = () => {
        setAddressState({ street: '' });
        setIsAddressConfirmed(true);
        setIsEditingAddress(false);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ street: '' }));
        localStorage.setItem(ADDRESS_CONFIRMED_KEY, 'true');
    };

    const clearAddress = () => {
        setAddressState(null);
        setIsAddressConfirmed(false);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ADDRESS_CONFIRMED_KEY);
    };

    const completeOnboarding = () => {
        setOnboardingCompleted(true);
        localStorage.setItem(ONBOARDING_KEY, 'true');
    };

    const openAddressForm = () => setIsEditingAddress(true);
    const closeAddressForm = () => setIsEditingAddress(false);

    return (
        <AddressContext.Provider
            value={{
                address,
                setAddress,
                isAddressConfirmed,
                confirmAddress,
                skipAddress,
                clearAddress,
                onboardingCompleted,
                completeOnboarding,
                isEditingAddress,
                openAddressForm,
                closeAddressForm,
            }}
        >
            {children}
        </AddressContext.Provider>
    );
}

export function useAddress() {
    const ctx = useContext(AddressContext);
    if (!ctx) throw new Error('useAddress must be used within AddressProvider');
    return ctx;
}
