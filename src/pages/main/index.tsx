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
} from "@/components/ui/card"


import { useDogCollarStore } from "@/stores/dog-collar-store";


const MainPage = () => {
  const { data } = useDogCollarStore();

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
        <CardHeader>
          <CardTitle>Data Table</CardTitle>
          <CardDescription>Raw data per person.</CardDescription>
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
