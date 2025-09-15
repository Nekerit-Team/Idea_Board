import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type IdeaRequest } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface IdeaFormProps {
  currentUser: string;
  onIdeaCreated: () => void;
}

export default function IdeaForm({ currentUser, onIdeaCreated }: IdeaFormProps) {
  const [formData, setFormData] = useState<IdeaRequest>({
    author: currentUser,
    title: "",
    content: "",
  });

  const { toast } = useToast();

  const createIdeaMutation = useMutation({
    mutationFn: async (data: IdeaRequest) => {
      const response = await apiRequest("POST", "/api/ideas", data);
      return response.json();
    },
    onSuccess: () => {
      setFormData({ author: currentUser, title: "", content: "" });
      toast({
        title: "¡Idea publicada exitosamente! 🎉",
        description: "Tu idea ha sido compartida con la comunidad",
      });
      onIdeaCreated();
    },
    onError: (error) => {
      console.error("Error creating idea:", error);
      toast({
        title: "Error al publicar idea",
        description: "Ha ocurrido un error. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    createIdeaMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof IdeaRequest) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="glass-card rounded-[20px] shadow-2xl p-8 mb-10 fade-in">
      <h2 className="text-2xl font-bold mb-6 gradient-text">✨ Comparte tu idea</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="authorName" className="block text-sm font-semibold mb-2 text-foreground">
              👤 Tu nombre
            </Label>
            <Input
              id="authorName"
              type="text"
              placeholder="Escribe tu nombre"
              value={formData.author}
              onChange={handleInputChange("author")}
              className="px-4 py-3 rounded-lg border-2 bg-background/80 focus:-translate-y-0.5 focus:shadow-lg transition-all duration-300"
              required
              data-testid="input-author"
            />
          </div>
          <div>
            <Label htmlFor="ideaTitle" className="block text-sm font-semibold mb-2 text-foreground">
              🎯 Título de tu idea
            </Label>
            <Input
              id="ideaTitle"
              type="text"
              placeholder="Un título llamativo para tu idea"
              value={formData.title}
              onChange={handleInputChange("title")}
              className="px-4 py-3 rounded-lg border-2 bg-background/80 focus:-translate-y-0.5 focus:shadow-lg transition-all duration-300"
              required
              data-testid="input-title"
            />
          </div>
        </div>
        <div className="mb-6">
          <Label htmlFor="ideaContent" className="block text-sm font-semibold mb-2 text-foreground">
            💭 Descripción
          </Label>
          <Textarea
            id="ideaContent"
            rows={4}
            placeholder="Describe tu idea de manera clara y concisa..."
            value={formData.content}
            onChange={handleInputChange("content")}
            className="px-4 py-3 rounded-lg border-2 bg-background/80 focus:-translate-y-0.5 focus:shadow-lg transition-all duration-300 resize-none"
            required
            data-testid="textarea-content"
          />
        </div>
        <Button
          type="submit"
          disabled={createIdeaMutation.isPending}
          className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 uppercase tracking-wide"
          data-testid="button-submit"
        >
          {createIdeaMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publicando...
            </>
          ) : (
            "🚀 Publicar Idea"
          )}
        </Button>
      </form>
    </div>
  );
}
