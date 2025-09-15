export interface IdeaWithStats {
  id: number;
  author: string;
  title: string;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  commentsCount: number;
}

export interface Comment {
  id: number;
  ideaId: number;
  author: string;
  text: string;
  createdAt: string;
}

export interface Statistics {
  totalIdeas: number;
  totalComments: number;
  totalVotes: number;
}

export interface VoteRequest {
  ideaId: number;
  username: string;
  voteType: 'up' | 'down';
}

export interface CommentRequest {
  ideaId: number;
  author: string;
  text: string;
}

export interface IdeaRequest {
  author: string;
  title: string;
  content: string;
}
