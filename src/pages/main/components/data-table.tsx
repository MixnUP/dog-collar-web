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
import { useState } from "react";
import { Download, List } from "lucide-react";

type PersonData = {
  id: string;
  [key: string]: any;
};

export const DataTable = () => {
  const { data: personAData, isLoading: isLoadingA } = useRecentPersonA<PersonData>();
  const { data: personBData, isLoading: isLoadingB } = useRecentPersonB<PersonData>();
  const [isExporting, setIsExporting] = useState(false);

  const data = [...(personAData || []), ...(personBData || [])];

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
                <TableHead className="text-primary-foreground">Visit</TableHead>
                <TableHead className="text-primary-foreground">Proximity</TableHead>
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
                    <TableCell>{row.visit}</TableCell>
                    <TableCell>{row.proximity}</TableCell>
                    <TableCell>{row.near_time_start}</TableCell>
                    <TableCell>{row.near_time_end}</TableCell>
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
