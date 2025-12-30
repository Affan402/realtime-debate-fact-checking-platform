/**
 * Example Implementation of API Integration
 * Copy and adapt these patterns to your actual components
 */

import { useEffect, useState } from 'react';
import { useDebates, useArguments, useAnalytics } from '@/hooks/use-api';
import { debateAPI } from '@/services/api';
import React from 'react';

/**
 * Example 1: Debates List Component
 * Fetches and displays all debates
 */
export function DebatesListExample() {
  const { debates, loading, error, fetchDebates } = useDebates();

  useEffect(() => {
    fetchDebates(); // API Call: GET /api/debates
  }, [fetchDebates]);

  if (loading) return <div className="text-center p-4">Loading debates...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!debates.length) return <div className="text-gray-500 p-4">No debates found</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Active Debates</h2>
      {debates.map((debate) => (
        <div key={debate._id} className="border p-4 rounded">
          <h3 className="font-bold">{debate.topic}</h3>
          <p className="text-gray-600">{debate.description}</p>
          <small>ID: {debate._id}</small>
        </div>
      ))}
    </div>
  );
}

/**
 * Example 2: Create Debate Form
 * Demonstrates form submission to API
 */
export function CreateDebateExample() {
  const { createDebate, loading, error } = useDebates();
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newDebate = await createDebate(formData); // API Call: POST /api/debates
      console.log('Debate created:', newDebate);
      setFormData({ topic: '', description: '' }); // Reset form
      alert('Debate created successfully!');
    } catch (err) {
      alert('Failed to create debate');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
      <h2 className="text-xl font-bold">Create New Debate</h2>

      <div>
        <label className="block font-semibold mb-2">Topic</label>
        <input
          type="text"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          placeholder="Enter debate topic..."
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter debate description..."
          required
          className="w-full border p-2 rounded"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Debate'}
      </button>

      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
}

/**
 * Example 3: Debate Detail View
 * Displays debate with related arguments and analytics
 */
export function DebateDetailExample({ debateId }: { debateId: string }) {
  const [debate, setDebate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { arguments: args, fetchArguments } = useArguments(debateId);
  const { analytics, fetchAnalytics } = useAnalytics(debateId);

  useEffect(() => {
    // Fetch debate details
    const fetchDebate = async () => {
      try {
        setLoading(true);
        const data = await debateAPI.getDebateById(debateId); // API Call
        setDebate(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDebate();
    fetchArguments(); // Fetch arguments
    fetchAnalytics(); // Fetch analytics
  }, [debateId]);

  if (loading) return <div>Loading debate...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!debate) return <div>Debate not found</div>;

  return (
    <div className="space-y-6">
      {/* Debate Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">{debate.topic}</h1>
        <p className="text-gray-600 mt-2">{debate.description}</p>
        <small className="text-gray-500">ID: {debate._id}</small>
      </div>

      {/* Arguments Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Arguments ({args.length})</h2>
        {args.length === 0 ? (
          <p className="text-gray-500">No arguments yet</p>
        ) : (
          <div className="space-y-2">
            {args.map((arg) => (
              <div key={arg._id} className="border p-3 rounded bg-gray-50">
                <p>{arg.content}</p>
                <small className="text-gray-600">By: {arg.author}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Section */}
      {analytics && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border p-4 rounded">
              <p className="text-gray-600">Total Arguments</p>
              <p className="text-2xl font-bold">{analytics.totalArguments || 0}</p>
            </div>
            <div className="border p-4 rounded">
              <p className="text-gray-600">Fact Checks</p>
              <p className="text-2xl font-bold">{analytics.factChecks || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Example 4: Add Argument to Debate
 * Shows how to submit data to API
 */
export function AddArgumentExample({ debateId }: { debateId: string }) {
  const { createArgument, loading } = useArguments(debateId);
  const [content, setContent] = useState('');

  const handleAddArgument = async () => {
    if (!content.trim()) {
      alert('Please enter an argument');
      return;
    }

    try {
      const newArg = await createArgument({
        debateId,
        content,
        author: 'Current User', // You'd get this from auth context
      }); // API Call: POST /api/arguments
      console.log('Argument added:', newArg);
      setContent(''); // Clear form
      alert('Argument added!');
    } catch (err) {
      alert('Failed to add argument');
    }
  };

  return (
    <div className="border p-4 rounded space-y-4">
      <h3 className="font-bold text-lg">Add Your Argument</h3>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your argument here..."
        rows={4}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={handleAddArgument}
        disabled={loading}
        className="bg-green-500 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Argument'}
      </button>
    </div>
  );
}

/**
 * Example 5: Error Boundary for API Calls
 * Wraps components that make API calls
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class APIErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('API Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="border border-red-500 bg-red-50 p-4 rounded">
          <h2 className="font-bold text-red-700">Something went wrong</h2>
          <p className="text-red-600">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Usage in Page:
 * 
 * import React from 'react';
 * import { APIErrorBoundary, DebatesListExample } from './examples';
 * 
 * export default function Page() {
 *   return (
 *     <APIErrorBoundary>
 *       <DebatesListExample />
 *     </APIErrorBoundary>
 *   );
 * }
 */
