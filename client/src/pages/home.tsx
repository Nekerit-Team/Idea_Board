import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import IdeaForm from "@/components/idea-form";
import IdeaCard from "@/components/idea-card";
import Statistics from "@/components/statistics";
import { type IdeaWithStats } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

function generateUsername() {
  return `Usuario${Math.floor(Math.random() * 1000)}`;
}

export default function Home() {
  const [currentUser] = useState(() => generateUsername());

  const { data: ideas = [], isLoading, refetch } = useQuery<IdeaWithStats[]>({
    queryKey: ["/api/ideas"],
  });

  // Auto-refresh ideas every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10 text-white">
          <h1 className="text-5xl font-bold mb-3 drop-shadow-lg">💡 Idea Board</h1>
          <p className="text-xl opacity-90">Comparte tus ideas y descubre la creatividad de otros</p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm opacity-75">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Conectado en tiempo real</span>
          </div>
        </header>

        {/* Idea Form */}
        <IdeaForm 
          currentUser={currentUser} 
          onIdeaCreated={() => refetch()} 
          data-testid="idea-form"
        />

        {/* Ideas Grid */}
        <div className="mb-10">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="ideas-loading">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass-card rounded-[20px] p-6">
                  <Skeleton className="h-4 mb-4" />
                  <Skeleton className="h-6 mb-3" />
                  <Skeleton className="h-16 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center text-white py-16" data-testid="ideas-empty">
              <h3 className="text-2xl font-semibold mb-3 opacity-90">🌟 Sé el primero en compartir</h3>
              <p className="opacity-70">¡No hay ideas todavía! Sé el pionero y comparte la primera idea increíble.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="ideas-grid">
              {ideas.map((idea) => (
                <IdeaCard 
                  key={idea.id} 
                  idea={idea} 
                  currentUser={currentUser}
                  onVoteChange={() => refetch()}
                  data-testid={`idea-card-${idea.id}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        <Statistics data-testid="statistics" />

        {/* Footer */}
        <footer className="text-center text-white/70 text-sm py-8">
          <div className="mb-4">
            <p>💡 Idea Board - Powered by React + Express.js + PostgreSQL</p>
          </div>
          <div className="flex justify-center gap-4 text-xs">
            <span className="px-3 py-1 bg-white/10 rounded-full">Real-time Updates</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Glass Morphism UI</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Responsive Design</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
