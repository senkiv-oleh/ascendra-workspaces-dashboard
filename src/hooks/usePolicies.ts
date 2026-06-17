import {useEffect, useState} from "react";
import {Policy} from "@/types";
import * as mockApi from "@/services/mockApi";

export const usePolicies = () => {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const data = await mockApi.getPolicies();
                setPolicies(data);
            } catch (err) {
                console.error('Failed to fetch policies', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    return {
        policies,
        loading,
    };
};
