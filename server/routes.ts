import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertIdeaSchema, insertVoteSchema, insertCommentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all ideas
  app.get("/api/ideas", async (req, res) => {
    try {
      const ideas = await storage.getIdeas();
      res.json(ideas);
    } catch (error) {
      console.error("Error fetching ideas:", error);
      res.status(500).json({ error: "Error al obtener las ideas" });
    }
  });

  // Create a new idea
  app.post("/api/ideas", async (req, res) => {
    try {
      const validatedData = insertIdeaSchema.parse(req.body);
      const newIdea = await storage.createIdea({
        title: validatedData.title,
        content: validatedData.content, // 🔹 usar content
        author: validatedData.author ?? null,
      });
      res.json({ status: "ok", idea: newIdea });
    } catch (error) {
      console.error("Error creating idea:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Datos inválidos", details: error.errors });
      } else {
        res.status(500).json({ error: "Error al crear la idea" });
      }
    }
  });

  // Vote on an idea
  app.post("/api/vote", async (req, res) => {
    try {
      const validatedData = insertVoteSchema.parse(req.body);
      await storage.upsertVote({
        ideaId: validatedData.ideaId,
        username: validatedData.username, // 🔹 usar username
        voteType: validatedData.voteType, // 🔹 usar voteType
      });
      res.json({ status: "ok" });
    } catch (error) {
      console.error("Error voting:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Datos inválidos", details: error.errors });
      } else {
        res.status(500).json({ error: "Error al votar" });
      }
    }
  });

  // Add comment to an idea
  app.post("/api/comments", async (req, res) => {
    try {
      const validatedData = insertCommentSchema.parse(req.body);
      const newComment = await storage.createComment({
        ideaId: validatedData.ideaId,
        text: validatedData.text, // 🔹 usar text
        author: validatedData.author ?? null,
      });
      res.json({ status: "ok", comment: newComment });
    } catch (error) {
      console.error("Error creating comment:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Datos inválidos", details: error.errors });
      } else {
        res.status(500).json({ error: "Error al crear el comentario" });
      }
    }
  });

  // Get comments for a specific idea
  app.get("/api/comments/:ideaId", async (req, res) => {
    try {
      const ideaId = parseInt(req.params.ideaId);
      if (isNaN(ideaId)) {
        return res.status(400).json({ error: "ID de idea inválido" });
      }
      const comments = await storage.getCommentsByIdeaId(ideaId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Error al obtener los comentarios" });
    }
  });

  // Get statistics
  app.get("/api/statistics", async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ error: "Error al obtener las estadísticas" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
