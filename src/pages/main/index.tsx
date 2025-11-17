import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDogCollarStore } from "@/stores/dog-collar-store";
import { unparse } from "papaparse";
import { useState } from "react";

const MainPage = () => {
  const { data } = useDogCollarStore();
  const [isExporting, setIsExporting] = useState(false);

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
    setIsExporting(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Main Graph</CardTitle>
          <CardDescription>A visual representation of the data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="h-64 border rounded-lg flex items-center justify-center">
                <p>Graph Placeholder</p>
              </div>
            </div>
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-2">Graph Legend</h3>
              <p>Legend items will go here.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Data Table</CardTitle>
            <CardDescription>Raw data per person.</CardDescription>
          </div>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? "Exporting..." : "Export to CSV"}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Person</TableHead>
                <TableHead>Visit</TableHead>
                <TableHead>Proximity</TableHead>
                <TableHead>Near Time Start</TableHead>
                <TableHead>Near Time End</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.person}</TableCell>
                  <TableCell>{row.visit}</TableCell>
                  <TableCell>{row.proximity}</TableCell>
                  <TableCell>{row.near_time_start}</TableCell>
                  <TableCell>{row.near_time_end}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainPage;
