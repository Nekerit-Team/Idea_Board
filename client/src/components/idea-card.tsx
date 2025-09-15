import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type IdeaWithStats, type Comment, type VoteRequest, type CommentRequest } from "@/lib/types";
import { cn } from "@/lib/utils";

interface IdeaCardProps {
  idea: IdeaWithStats;
  currentUser: string;
  onVoteChange: () => void;
}

export default function IdeaCard({ idea, currentUser, onVoteChange }: IdeaCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const { toast } = useToast();

  const { data: comments = [], refetch: refetchComments } = useQuery<Comment[]>({
    queryKey: ["/api/comments", idea.id],
    enabled: showComments,
  });

  const voteMutation = useMutation({
    mutationFn: async (voteData: VoteRequest) => {
      const response = await apiRequest("POST", "/api/vote", voteData);
      return response.json();
    },
    onSuccess: () => {
      onVoteChange();
    },
    onError: (error) => {
      console.error("Error voting:", error);
      toast({
        title: "Error al votar",
        description: "Ha ocurrido un error. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (commentData: CommentRequest) => {
      const response = await apiRequest("POST", "/api/comments", commentData);
      return response.json();
    },
    onSuccess: () => {
      setCommentText("");
      refetchComments();
      onVoteChange(); // To update comment count
      toast({
        title: "Comentario añadido",
        description: "Tu comentario ha sido publicado",
      });
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
      toast({
        title: "Error al comentar",
        description: "Ha ocurrido un error. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  const handleVote = (voteType: 'up' | 'down') => {
    voteMutation.mutate({
      ideaId: idea.id,
      username: currentUser,
      voteType,
    });
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      toast({
        title: "Comentario vacío",
        description: "Por favor, escribe un comentario",
        variant: "destructive",
      });
      return;
    }

    commentMutation.mutate({
      ideaId: idea.id,
      author: currentUser,
      text: commentText.trim(),
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  return (
    <div className="glass-card rounded-[20px] shadow-xl p-6 hover-lift transition-all duration-300 relative overflow-hidden fade-in">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground mb-1" data-testid={`text-title-${idea.id}`}>
            {idea.title}
          </h3>
          <p className="text-sm text-muted-foreground italic" data-testid={`text-author-${idea.id}`}>
            por {idea.author}
          </p>
        </div>
        <div className="text-xs text-muted-foreground text-right">
          <span data-testid={`text-time-${idea.id}`}>{getTimeAgo(idea.createdAt)}</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-foreground leading-relaxed" data-testid={`text-content-${idea.id}`}>
          {idea.content}
        </p>
      </div>

      {/* Voting Section */}
      <div className="flex justify-between items-center border-t border-border pt-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="vote-button w-10 h-10 rounded-full border-2 hover:border-green-500 hover:bg-green-500 hover:text-white text-lg p-0"
            onClick={() => handleVote('up')}
            disabled={voteMutation.isPending}
            data-testid={`button-upvote-${idea.id}`}
          >
            👍
          </Button>
          <span className="font-semibold text-foreground" data-testid={`text-score-${idea.id}`}>
            +{idea.upvotes - idea.downvotes}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="vote-button w-10 h-10 rounded-full border-2 hover:border-red-500 hover:bg-red-500 hover:text-white text-lg p-0"
            onClick={() => handleVote('down')}
            disabled={voteMutation.isPending}
            data-testid={`button-downvote-${idea.id}`}
          >
            👎
          </Button>
        </div>
        
        <Button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
          onClick={handleToggleComments}
          data-testid={`button-comments-${idea.id}`}
        >
          💬 {idea.commentsCount}
        </Button>
      </div>

      {/* Comments Section */}
      <div className={cn(
        "mt-4 border-t border-border pt-4 transition-all duration-300",
        showComments ? "comment-form-visible" : "comment-form-hidden"
      )}>
        <div className="space-y-3 mb-4" data-testid={`comments-list-${idea.id}`}>
          {comments.map((comment) => (
            <div key={comment.id} className="bg-muted/30 p-3 rounded-lg border-l-3 border-primary">
              <div className="font-semibold text-sm text-primary mb-1" data-testid={`comment-author-${comment.id}`}>
                {comment.author}
              </div>
              <div className="text-foreground text-sm leading-relaxed" data-testid={`comment-text-${comment.id}`}>
                {comment.text}
              </div>
            </div>
          ))}
        </div>

        {/* Comment Form */}
        <form className="flex gap-2" onSubmit={handleAddComment}>
          <Input
            type="text"
            placeholder="Escribe un comentario..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 px-3 py-2 rounded-full text-sm"
            disabled={commentMutation.isPending}
            data-testid={`input-comment-${idea.id}`}
          />
          <Button
            type="submit"
            size="sm"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-colors"
            disabled={commentMutation.isPending}
            data-testid={`button-add-comment-${idea.id}`}
          >
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );
}
