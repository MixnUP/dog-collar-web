import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { DataTable } from "./components/data-table";
import { useDogCollarStore } from "@/stores/dog-collar-store";

// Helper function to format time in seconds to a readable format
const formatTime = (seconds: number | undefined): string => {
  if (seconds === undefined || seconds === 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
};

const MainPage = () => {
  const { 
    personA, 
    personB, 
    isLoading, 
    error, 
    subscribe 
  } = useDogCollarStore();
  
  // Subscribe to data updates when component mounts
  useEffect(() => {
    const unsubscribe = subscribe();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribe]);
  
  // Show loading state
  if (isLoading) {
    return (
      <main className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </main>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <main className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading data: {error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Insights from the dog collar proximity data.
        </p>
      </header>

      <Card className="mb-8 bg-card border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span>Main Graph</span>
          </CardTitle>
          <CardDescription>
            A visual representation of the data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="h-80 rounded-lg flex items-center justify-center bg-background/40 border-2 border-dashed border-primary">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                  <p>Graph Placeholder</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Graph Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="h-4 w-4 rounded-full bg-primary mr-2"></span>
                  <span>Proximity Group A</span>
                </div>
                <div className="flex items-center">
                  <span className="h-4 w-4 rounded-full bg-accent mr-2"></span>
                  <span>Proximity Group B</span>
                </div>
                <div className="flex items-center">
                  <span className="h-4 w-4 rounded-full bg-secondary mr-2"></span>
                  <span>Proximity Group C</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-card border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>Person A Status</span>
              {personA?.last_updated && (
                <span className="text-xs text-muted-foreground ml-auto">
                  Updated: {new Date(personA.last_updated).toLocaleTimeString()}
                </span>
              )}
            </CardTitle>
            <CardDescription>Current status of Person A's dog collar.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Visits:</strong> {personA?.visits ?? 'N/A'}</p>
              <p><strong>Proximity:</strong> {personA?.proximity ?? 'N/A'}</p>
              <p><strong>Total Time:</strong> {personA?.total_time !== undefined ? formatTime(personA.total_time) : 'N/A'}</p>
              <p><strong>Near Time Start:</strong> {personA?.near_time_start ?? 'N/A'}</p>
              <p><strong>Near Time End:</strong> {personA?.near_time_end ?? 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>Person B Status</span>
              {personB?.last_updated && (
                <span className="text-xs text-muted-foreground ml-auto">
                  Updated: {new Date(personB.last_updated).toLocaleTimeString()}
                </span>
              )}
            </CardTitle>
            <CardDescription>Current status of Person B's dog collar.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Visits:</strong> {personB?.visits ?? 'N/A'}</p>
              <p><strong>Proximity:</strong> {personB?.proximity ?? 'N/A'}</p>
              <p><strong>Total Time:</strong> {personB?.total_time !== undefined ? formatTime(personB.total_time) : 'N/A'}</p>
              <p><strong>Near Time Start:</strong> {personB?.near_time_start ?? 'N/A'}</p>
              <p><strong>Near Time End:</strong> {personB?.near_time_end ?? 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable />
    </main>
  );
};

export default MainPage;
