import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { DataTable } from "./components/data-table";
import { useDogCollars } from "@/lib/hooks/useDogCollars";
import { Timestamp } from "firebase/firestore";

// Helper function to format timestamp
const formatTimestamp = (timestamp: Date | Timestamp | string | number | undefined): string => {
  if (!timestamp) return 'N/A';
  
  let date: Date;
  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    return 'Invalid Date Type';
  }

  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
};

const MainPage = () => {
  const { data: dogCollars, isLoading } = useDogCollars();
  
  // Get the most recent entry for each person
  const personAData = dogCollars?.filter(item => item.person === 'Person A')[0];
  const personBData = dogCollars?.filter(item => item.person === 'Person B')[0];
  
  const visitsData = {
    personA: { 
      visits: personAData?.visits ?? 0, 
      total_time: personAData?.total_time ?? 0 
    },
    personB: { 
      visits: personBData?.visits ?? 0, 
      total_time: personBData?.total_time ?? 0 
    }
  };
  
  const personAStatus = personAData;
  const personBStatus = personBData;

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
            </CardTitle>
            <CardDescription>Current status of Person A's dog collar.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-2">
                <p><strong>Visits:</strong> {visitsData.personA.visits ?? 'N/A'}</p>

                <p><strong>Total Time:</strong> {visitsData.personA.total_time ? `${Math.floor(visitsData.personA.total_time / 60)}m ${visitsData.personA.total_time % 60}s` : 'N/A'}</p>
                <p><strong>Near Time Start:</strong> {formatTimestamp(personAStatus?.near_time_start)}</p>
                <p><strong>Near Time End:</strong> {formatTimestamp(personAStatus?.near_time_end)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>Person B Status</span>
            </CardTitle>
            <CardDescription>Current status of Person B's dog collar.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-2">
                <p><strong>Visits:</strong> {visitsData.personB.visits ?? 'N/A'}</p>

                <p><strong>Total Time:</strong> {visitsData.personB.total_time ? `${Math.floor(visitsData.personB.total_time / 60)}m ${visitsData.personB.total_time % 60}s` : 'N/A'}</p>
                <p><strong>Near Time Start:</strong> {formatTimestamp(personBStatus?.near_time_start)}</p>
                <p><strong>Near Time End:</strong> {formatTimestamp(personBStatus?.near_time_end)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <DataTable />
    </main>
  );
};

export default MainPage;
