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
import { useDogCollars } from "@/lib/hooks/useDogCollars";
import { unparse } from "papaparse";
import { useState } from "react";
import { Download, List } from "lucide-react";

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

// Helper function to format total time in seconds to a human-readable format (e.g., "1m 30s")
const formatTotalTime = (seconds: number | undefined): string => {
  if (seconds === undefined || seconds === null) return 'N/A';
  if (seconds < 0) return 'Invalid';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
  }
  return `${remainingSeconds}s`;
};

type DogCollar = {
  id: string;
  person: string;
  near_time_start?: Timestamp | Date | string;
  near_time_end?: Timestamp | Date | string;
  visits?: number;
  proximity?: number;
  total_time?: number;
  timestamp?: Timestamp | Date | string;
};

export const DataTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const { data: paginatedData, isLoading } = useDogCollars(rowsPerPage, currentPage - 1); // currentPage - 1 for 0-based offset
  const [isExporting, setIsExporting] = useState(false);

  const data: DogCollar[] = paginatedData?.data || [];
  const totalCount = paginatedData?.totalCount || 0;


  const totalPages = Math.ceil(totalCount / rowsPerPage);

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

  // const isLoading = isLoadingA || isLoadingB; // Removed as useDogCollars provides its own isLoading

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
                <TableHead className="text-primary-foreground">Timestamp</TableHead>
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
                    <TableCell className="font-medium">{row.person}</TableCell>
                    <TableCell>{row.visits ?? 'N/A'}</TableCell>
                    <TableCell>{row.proximity?.toFixed(2) ?? 'N/A'}</TableCell>
                    <TableCell>{formatTotalTime(row.total_time)}</TableCell>
                    <TableCell>{formatTimestamp(row.timestamp)}</TableCell>
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
        {totalCount > rowsPerPage && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
