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
import { BarChart3, Download, List } from "lucide-react";

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
    setTimeout(() => setIsExporting(false), 500);
  };

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
          <Button onClick={handleExport} disabled={isExporting}>
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
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <TableRow key={index} className="border-border/50">
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
    </main>
  );
};

export default MainPage;
