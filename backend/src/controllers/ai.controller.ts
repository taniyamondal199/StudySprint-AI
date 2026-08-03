import { Request, Response } from "express";
import { AIService } from "../services/ai.service";

export class AIController {
  /**
   * Post study specifications and receive a customized schedule.
   */
  public static async generatePlan(req: Request, res: Response): Promise<any> {
    const { subject, hoursPerDay, examDate } = req.body;

    if (!subject || !hoursPerDay || !examDate) {
      return res.status(400).json({ error: "subject, hoursPerDay, and examDate are required" });
    }

    try {
      const plan = await AIService.generateStudyPlan(subject, parseFloat(hoursPerDay), examDate);
      return res.json(plan);
    } catch (error) {
      console.error("AI Planner endpoint error:", error);
      return res.status(500).json({ error: "Failed to generate AI study plan" });
    }
  }

  /**
   * Post a subject/topic and receive MCQ quiz cards.
   */
  public static async generateQuiz(req: Request, res: Response): Promise<any> {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "topic is required" });
    }

    try {
      const quiz = await AIService.generateQuiz(topic);
      return res.json(quiz);
    } catch (error) {
      console.error("AI Quiz endpoint error:", error);
      return res.status(500).json({ error: "Failed to generate AI quiz" });
    }
  }

  /**
   * Post long-form notes and receive summarized takeaways.
   */
  public static async generateNotesSummary(req: Request, res: Response): Promise<any> {
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({ error: "notes content is required" });
    }

    try {
      const summary = await AIService.generateRevisionNotes(notes);
      return res.json(summary);
    } catch (error) {
      console.error("AI Notes Summarizer endpoint error:", error);
      return res.status(500).json({ error: "Failed to generate AI notes summary" });
    }
  }
}
