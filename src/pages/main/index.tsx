import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { DataTable } from "./components/data-table";

const MainPage = () => {
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

      <DataTable />
    </main>
  );
};

export default MainPage;
