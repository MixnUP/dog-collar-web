import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRecentPersonA, useRecentPersonB } from "@/lib/hooks/useDogCollars";
import { unparse } from "papaparse";
import { useState, useEffect } from "react";
import { Download, List } from "lucide-react";
import { onVisitsUpdate } from "@/lib/services/rtdb";

// Helper function to format timestamp
const formatTimestamp = (timestamp: any) => {
  if (!timestamp) return 'N/A';
  
  // If it's a Firestore timestamp
  if (timestamp.toDate) {
    return new Date(timestamp.toDate()).toLocaleString();
  }
  
  // If it's already a date string or number
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
};

type PersonData = {
  id: string;
  person: string;
  near_time_start?: any;
  near_time_end?: any;
  visits?: number;
  proximity?: number;
  total_time?: number;
  timestamp?: any;
  [key: string]: any;
};

type VisitsData = {
  personA: {
    visits: number;
    proximity: number;
    total_time: number;
  };
  personB: {
    visits: number;
    proximity: number;
    total_time: number;
  };
};

export const DataTable = () => {
  const { data: personAData, isLoading: isLoadingA } = useRecentPersonA<PersonData>();
  const { data: personBData, isLoading: isLoadingB } = useRecentPersonB<PersonData>();
  const [isExporting, setIsExporting] = useState(false);
  const [visitsData, setVisitsData] = useState<VisitsData>({
    personA: { visits: 0, proximity: 0, total_time: 0 },
    personB: { visits: 0, proximity: 0, total_time: 0 }
  });

  // Set up realtime listener for visits data
  useEffect(() => {
    const unsubscribe = onVisitsUpdate((data) => {
      setVisitsData(data);
    });
    
    return () => unsubscribe();
  }, []);

  // Transform the data to include person identifier and format timestamps
  const data = [
    {
      id: 'person-a',
      person: 'Person A',
      visits: visitsData.personA.visits,
      proximity: visitsData.personA.proximity,
      total_time: visitsData.personA.total_time,
      near_time_start: personAData?.[0]?.timestamp || new Date().toISOString(),
      near_time_end: personAData?.[0]?.timestamp || new Date().toISOString(),
    },
    {
      id: 'person-b',
      person: 'Person B',
      visits: visitsData.personB.visits,
      proximity: visitsData.personB.proximity,
      total_time: visitsData.personB.total_time,
      near_time_start: personBData?.[0]?.timestamp || new Date().toISOString(),
      near_time_end: personBData?.[0]?.timestamp || new Date().toISOString(),
    }
  ];

  const handleExport = () => {
    setIsExporting(true);
    const csv = unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "dog-collar-data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsExporting(false), 500);
  };

  const isLoading = isLoadingA || isLoadingB;

  return (
    <Card className="bg-card border-border backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <List className="h-6 w-6" />
            <span>Data Table</span>
          </CardTitle>
          <CardDescription>
            Raw data collected from the sensors.
          </CardDescription>
        </div>
        <Button onClick={handleExport} disabled={isExporting || !data.length}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export to CSV"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow className="border-border/50">
                <TableHead className="text-primary-foreground">Person</TableHead>
                <TableHead className="text-primary-foreground">Visits</TableHead>
                <TableHead className="text-primary-foreground">Proximity</TableHead>
                <TableHead className="text-primary-foreground">Total Time</TableHead>
                <TableHead className="text-primary-foreground">Near Time Start</TableHead>
                <TableHead className="text-primary-foreground">Near Time End</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                data.map((row) => (
                  <TableRow key={row.id} className="border-border/50">
                    <TableCell className="font-medium">
                      {row.person}
                    </TableCell>
                    <TableCell>{row.visits ?? 'N/A'}</TableCell>
                    <TableCell>{row.proximity ?? 'N/A'}</TableCell>
                    <TableCell>{row.total_time ? `${Math.floor(row.total_time / 60)}m ${row.total_time % 60}s` : 'N/A'}</TableCell>
                    <TableCell>{formatTimestamp(row.near_time_start)}</TableCell>
                    <TableCell>{formatTimestamp(row.near_time_end)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
