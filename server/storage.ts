import { 
  ideas, 
  votes, 
  comments, 
  type Idea, 
  type Vote, 
  type Comment, 
  type InsertIdea, 
  type InsertVote, 
  type InsertComment 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getIdeas(): Promise<any[]>;
  createIdea(idea: InsertIdea): Promise<Idea>;
  upsertVote(vote: InsertVote): Promise<Vote>;
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByIdeaId(ideaId: number): Promise<Comment[]>;
  getStatistics(): Promise<{
    totalIdeas: number;
    totalComments: number;
    totalVotes: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getIdeas(): Promise<any[]> {
    const result = await db
      .select({
        id: ideas.id,
        author: ideas.author,
        title: ideas.title,
        content: ideas.content,
        createdAt: ideas.createdAt, // 🔹 camelCase
        upvotes: sql<number>`COALESCE(SUM(CASE WHEN ${votes.voteType} = 'up' THEN 1 ELSE 0 END), 0)`,
        downvotes: sql<number>`COALESCE(SUM(CASE WHEN ${votes.voteType} = 'down' THEN 1 ELSE 0 END), 0)`,
        commentsCount: sql<number>`(SELECT COUNT(*) FROM ${comments} WHERE ${comments.ideaId} = ${ideas.id})`,
      })
      .from(ideas)
      .leftJoin(votes, eq(votes.ideaId, ideas.id))
      .groupBy(ideas.id)
      .orderBy(desc(ideas.createdAt));

    return result;
  }

  async createIdea(idea: InsertIdea): Promise<Idea> {
    const [newIdea] = await db
      .insert(ideas)
      .values({
        title: idea.title,
        content: idea.content,
        author: idea.author
      })
      .returning();
    return newIdea;
  }

  async upsertVote(vote: InsertVote): Promise<Vote> {
    const [result] = await db
      .insert(votes)
      .values({
        ideaId: vote.ideaId,
        username: vote.username,
        voteType: vote.voteType as 'up' | 'down'
      })
      .onConflictDoUpdate({
        target: [votes.ideaId, votes.username],
        set: { voteType: vote.voteType as 'up' | 'down' }
      })
      .returning();
    return result;
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values({
        ideaId: comment.ideaId,
        text: comment.text,
        author: comment.author
      })
      .returning();
    return newComment;
  }

  async getCommentsByIdeaId(ideaId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.ideaId, ideaId))
      .orderBy(comments.createdAt);
  }

  async getStatistics() {
    const [stats] = await db
      .select({
        totalIdeas: sql<number>`COUNT(DISTINCT ${ideas.id})`,
        totalComments: sql<number>`COUNT(DISTINCT ${comments.id})`,
        totalVotes: sql<number>`COUNT(DISTINCT ${votes.id})`,
      })
      .from(ideas)
      .leftJoin(comments, eq(comments.ideaId, ideas.id))
      .leftJoin(votes, eq(votes.ideaId, ideas.id));

    return {
      totalIdeas: Number(stats.totalIdeas),
      totalComments: Number(stats.totalComments),
      totalVotes: Number(stats.totalVotes),
    };
  }
}

export const storage = new DatabaseStorage();
