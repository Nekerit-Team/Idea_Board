import { useQuery } from "@tanstack/react-query";
import { type Statistics } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Statistics() {
  const { data: stats, isLoading } = useQuery<Statistics>({
    queryKey: ["/api/statistics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="glass-card rounded-[20px] shadow-2xl p-8 mb-10 fade-in">
        <h3 className="text-2xl font-bold text-center mb-8 gradient-text">📊 Estadísticas de la comunidad</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="group cursor-pointer">
              <Skeleton className="h-12 w-16 mx-auto mb-2" />
              <Skeleton className="h-5 w-32 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="glass-card rounded-[20px] shadow-2xl p-8 mb-10 fade-in">
        <h3 className="text-2xl font-bold text-center mb-8 gradient-text">📊 Estadísticas de la comunidad</h3>
        <div className="text-center text-muted-foreground">
          No se pudieron cargar las estadísticas
        </div>
      </div>
    );
  }

  const averageVotesPerIdea = stats.totalIdeas > 0 ? (stats.totalVotes / stats.totalIdeas).toFixed(1) : '0.0';

  return (
    <div className="glass-card rounded-[20px] shadow-2xl p-8 mb-10 fade-in">
      <h3 className="text-2xl font-bold text-center mb-8 gradient-text">📊 Estadísticas de la comunidad</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="group cursor-pointer">
          <div 
            className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform"
            data-testid="stat-total-ideas"
          >
            {stats.totalIdeas}
          </div>
          <div className="text-muted-foreground font-medium">Ideas Compartidas</div>
        </div>
        <div className="group cursor-pointer">
          <div 
            className="text-4xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform"
            data-testid="stat-total-comments"
          >
            {stats.totalComments}
          </div>
          <div className="text-muted-foreground font-medium">Comentarios</div>
        </div>
        <div className="group cursor-pointer">
          <div 
            className="text-4xl font-bold text-chart-3 mb-2 group-hover:scale-110 transition-transform"
            data-testid="stat-total-votes"
          >
            {stats.totalVotes}
          </div>
          <div className="text-muted-foreground font-medium">Votos Totales</div>
        </div>
      </div>
      
      {/* Additional stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center mt-8 pt-8 border-t border-border">
        <div className="group cursor-pointer">
          <div 
            className="text-2xl font-semibold text-primary mb-2 group-hover:scale-105 transition-transform"
            data-testid="stat-average-votes"
          >
            {averageVotesPerIdea}
          </div>
          <div className="text-muted-foreground font-medium">Promedio de Votos por Idea</div>
        </div>
        <div className="group cursor-pointer">
          <div 
            className="text-2xl font-semibold text-accent mb-2 group-hover:scale-105 transition-transform"
            data-testid="stat-active-users"
          >
            {Math.ceil(stats.totalIdeas * 0.8)}
          </div>
          <div className="text-muted-foreground font-medium">Usuarios Activos Estimados</div>
        </div>
      </div>
    </div>
  );
}
