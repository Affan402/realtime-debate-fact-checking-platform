import { useState, useCallback } from 'react';
import { debateAPI, argumentAPI, factCheckAPI, analyticsAPI } from '@/services/api';

// Hook for handling debates
export function useDebates() {
  const [debates, setDebates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDebates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await debateAPI.getDebates();
      setDebates(data.debates || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createDebate = useCallback(async (debateData: any) => {
    try {
      setLoading(true);
      setError(null);
      const newDebate = await debateAPI.createDebate(debateData);
      setDebates((prev) => [...prev, newDebate]);
      return newDebate;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { debates, loading, error, fetchDebates, createDebate };
}

// Hook for handling arguments
export function useArguments(debateId?: string) {
  const [arguments_, setArguments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArguments = useCallback(async () => {
    if (!debateId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await argumentAPI.getArgumentsByDebate(debateId);
      setArguments(data.arguments || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debateId]);

  const createArgument = useCallback(async (argumentData: any) => {
    try {
      setLoading(true);
      setError(null);
      const newArgument = await argumentAPI.createArgument(argumentData);
      setArguments((prev) => [...prev, newArgument]);
      return newArgument;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { arguments: arguments_, loading, error, fetchArguments, createArgument };
}

// Hook for handling fact checks
export function useFactChecks(debateId?: string) {
  const [factChecks, setFactChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFactChecks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await factCheckAPI.getFactChecks(debateId);
      setFactChecks(data.factChecks || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debateId]);

  const createFactCheck = useCallback(async (factCheckData: any) => {
    try {
      setLoading(true);
      setError(null);
      const newFactCheck = await factCheckAPI.createFactCheck(factCheckData);
      setFactChecks((prev) => [...prev, newFactCheck]);
      return newFactCheck;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { factChecks, loading, error, fetchFactChecks, createFactCheck };
}

// Hook for handling analytics
export function useAnalytics(debateId?: string) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!debateId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsAPI.getAnalytics(debateId);
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debateId]);

  return { analytics, loading, error, fetchAnalytics };
}
