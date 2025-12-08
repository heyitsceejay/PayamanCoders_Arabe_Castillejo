'use client';

import { useEffect, useState } from 'react';

interface ServiceStatus {
  status: string;
  details: any;
}

interface InfrastructureStatus {
  timestamp: string;
  services: {
    nginx: ServiceStatus;
    redis: ServiceStatus;
    rabbitmq: ServiceStatus;
    cache: ServiceStatus;
  };
  overall: string;
}

export default function InfrastructurePage() {
  const [status, setStatus] = useState<InfrastructureStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/infrastructure/status');
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
      case 'partial':
        return 'bg-yellow-500';
      case 'unavailable':
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
      case 'healthy':
        return '✓';
      case 'degraded':
      case 'partial':
        return '⚠';
      case 'unavailable':
      case 'error':
        return '✗';
      default:
        return '?';
    }
  };

  if (loading && !status) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading infrastructure status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchStatus}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                WorkQit Infrastructure Status
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time monitoring of system services
              </p>
            </div>
            <div className="text-right">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full ${getStatusColor(
                  status?.overall || 'unknown'
                )} text-white font-semibold`}
              >
                <span className="mr-2 text-xl">
                  {getStatusIcon(status?.overall || 'unknown')}
                </span>
                {status?.overall.toUpperCase()}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Last updated: {status?.timestamp ? new Date(status.timestamp).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NGINX */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    status?.services.nginx.status || 'unknown'
                  )} mr-3`}
                ></div>
                <h2 className="text-xl font-semibold text-gray-900">NGINX</h2>
              </div>
              <span className="text-2xl">🔄</span>
            </div>
            <p className="text-gray-600 mb-4">
              {status?.services.nginx.details.message}
            </p>
            <div className="bg-gray-50 rounded p-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">Features:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {status?.services.nginx.details.features?.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Redis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    status?.services.redis.status || 'unknown'
                  )} mr-3`}
                ></div>
                <h2 className="text-xl font-semibold text-gray-900">Redis</h2>
              </div>
              <span className="text-2xl">⚡</span>
            </div>
            <p className="text-gray-600 mb-4">
              {status?.services.redis.details.message}
            </p>
            <div className="bg-gray-50 rounded p-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Type</p>
                  <p className="font-semibold text-gray-900">
                    {status?.services.redis.details.type}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Cache Working</p>
                  <p className="font-semibold text-gray-900">
                    {status?.services.redis.details.cacheWorking ? 'Yes' : 'No'}
                  </p>
                </div>
                {status?.services.redis.details.memoryCacheSize !== undefined && (
                  <div>
                    <p className="text-gray-500">Memory Cache Size</p>
                    <p className="font-semibold text-gray-900">
                      {status.services.redis.details.memoryCacheSize} items
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RabbitMQ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    status?.services.rabbitmq.status || 'unknown'
                  )} mr-3`}
                ></div>
                <h2 className="text-xl font-semibold text-gray-900">RabbitMQ</h2>
              </div>
              <span className="text-2xl">📬</span>
            </div>
            <p className="text-gray-600 mb-4">
              {status?.services.rabbitmq.details.message}
            </p>
            <div className="bg-gray-50 rounded p-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Queues ({status?.services.rabbitmq.details.totalQueues}):
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {status?.services.rabbitmq.details.queues?.map((q: any, i: number) => (
                  <div key={i} className="text-sm flex justify-between items-center">
                    <span className="text-gray-600">{q.name}</span>
                    <div className="flex items-center space-x-2">
                      {q.status === 'operational' ? (
                        <>
                          <span className="text-xs text-gray-500">
                            {q.messages} msgs
                          </span>
                          <span className="text-green-500">✓</span>
                        </>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cache System */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    status?.services.cache.status || 'unknown'
                  )} mr-3`}
                ></div>
                <h2 className="text-xl font-semibold text-gray-900">Cache System</h2>
              </div>
              <span className="text-2xl">💾</span>
            </div>
            <p className="text-gray-600 mb-4">
              {status?.services.cache.details.message}
            </p>
            <div className="bg-gray-50 rounded p-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Strategy</span>
                  <span className="font-semibold text-gray-900">
                    {status?.services.cache.details.strategy}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Primary</span>
                  <span className="font-semibold text-gray-900">
                    {status?.services.cache.details.primary}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fallback</span>
                  <span className="font-semibold text-gray-900">
                    {status?.services.cache.details.fallback}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            System Architecture
          </h2>
          <div className="bg-gray-50 rounded p-6">
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`┌─────────────────────────────────────────────────┐
│                   Internet                      │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
            ┌────────────────┐
            │  NGINX (Port 80)│
            │  - Rate Limiting│
            │  - Caching      │
            │  - Security     │
            └────────┬────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Next.js (Port 3000)  │
         │  - API Routes         │
         │  - Server Components  │
         └───┬───────────┬───────┘
             │           │
    ┌────────┴───┐   ┌──┴──────────┐
    │            │   │             │
    ▼            ▼   ▼             ▼
┌────────┐  ┌────────┐  ┌──────────────┐
│ Redis  │  │MongoDB │  │  RabbitMQ    │
│ :6379  │  │External│  │  :5672       │
│        │  │        │  │              │
│-Cache  │  │-Users  │  │-Email Queue  │
│-Rate   │  │-Jobs   │  │-Sync Queue   │
│ Limit  │  │-Data   │  │-Scoring Queue│
└────────┘  └────────┘  └──────┬───────┘
                               │
                               ▼
                        ┌──────────────┐
                        │   Workers    │
                        │              │
                        │ - Email      │
                        │ - Sync       │
                        │ - Assessment │
                        │ - Notification│
                        └──────────────┘`}
            </pre>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={fetchStatus}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              🔄 Refresh Status
            </button>
            <a
              href="http://localhost:15672"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition text-center"
            >
              📊 RabbitMQ Dashboard
            </a>
            <a
              href="/api/infrastructure/status"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition text-center"
            >
              📄 View JSON
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
