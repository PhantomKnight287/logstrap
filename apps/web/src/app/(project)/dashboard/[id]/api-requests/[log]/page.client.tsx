'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ApiRequestLogProps {
  id: string;
  method: string;
  url: string;
  statusCode: number;
  timeTaken: number;
  timestamp: string;
  requestHeaders: Record<string, string>;
  requestBody: string;
  responseBody: string;
  responseHeaders: Record<string, string>;
  cookies: Record<string, string>;
//   applicationLogs: string[];
}

export default function ApiRequestLogView({
  id,
  method,
  url,
  statusCode,
  timeTaken,
  timestamp,
  requestHeaders,
  requestBody,
  responseBody,
  responseHeaders,
  cookies,
//   applicationLogs,
}: ApiRequestLogProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderExpandableSection = (title: string, content: React.ReactNode) => (
    <div className="mt-4">
      <Button
        variant="outline"
        onClick={() => toggleSection(title)}
        className="w-full justify-between"
      >
        {title}
        {expandedSections[title] ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
      {expandedSections[title] && (
        <div className="mt-2 p-2 bg-muted rounded-md">{content}</div>
      )}
    </div>
  );

  const renderHeaders = (headers: Record<string, string>) => (
    
    <ul className="list-none p-0">
      {Object.entries(headers??{}).map(([key, value]) => (
        <li key={key} className="mb-1">
          <span className="font-semibold">{key}:</span> {value}
        </li>
      ))}
    </ul>
  );

  const renderJson = (json: string) => {
    try {
      const parsed = JSON.parse(json);
      return (
        <pre className="whitespace-pre-wrap overflow-x-auto">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      return <pre className="whitespace-pre-wrap overflow-x-auto">{json}</pre>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>API Request Log: {id}</span>
          <Badge variant={statusCode < 400 ? 'success' : 'destructive'}>
            {statusCode}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>
              <span className="font-semibold">Method:</span> {method}
            </p>
            <p>
              <span className="font-semibold">URL:</span> {url}
            </p>
            <p>
              <span className="font-semibold">Time Taken:</span> {timeTaken}ms
            </p>
            <p>
              <span className="font-semibold">Timestamp:</span>{' '}
              {new Date(timestamp).toLocaleString()}
            </p>
          </div>
        </div>

        {renderExpandableSection(
          'Request Headers',
          renderHeaders(requestHeaders),
        )}
        {renderExpandableSection('Request Body', renderJson(requestBody))}
        {renderExpandableSection(
          'Response Headers',
          renderHeaders(responseHeaders),
        )}
        {renderExpandableSection('Response Body', renderJson(responseBody))}
        {renderExpandableSection('Cookies', renderHeaders(cookies))}
        {/* {renderExpandableSection(
          'Application Logs',
          <ul className="list-disc pl-5">
            {applicationLogs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>,
        )} */}
      </CardContent>
    </Card>
  );
}
