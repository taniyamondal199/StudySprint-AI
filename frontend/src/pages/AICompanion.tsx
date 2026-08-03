import React, { useState } from "react";
import { aiAPI } from "../services/api";
import { 
  Cpu, 
  Calendar, 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  ListTodo, 
  CheckCircle,
  FileText,
  Bookmark,
  ChevronRight,
  Flame,
  AlertCircle
} from "lucide-react";

export const AICompanion: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"planner" | "quiz" | "notes">("planner");
  const [loading, setLoading] = useState<boolean>(false);

  // --- AI Planner State ---
  const [plannerForm, setPlannerForm] = useState({ subject: "Rust Smart Contracts", hours: 2, date: "" });
  const [studyPlan, setStudyPlan] = useState<any | null>(null);

  // --- AI Quiz State ---
  const [quizTopic, setQuizTopic] = useState<string>("Injective Blockchain Consensus");
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  // --- AI Notes State ---
  const [notesInput, setNotesInput] = useState<string>("");
  const [notesSummary, setNotesSummary] = useState<any | null>(null);

  // --- Planner Submit ---
  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plannerForm.subject || !plannerForm.date) {
      alert("Please fill out all fields.");
      return;
    }
    setLoading(true);
    setStudyPlan(null);
    try {
      const res = await aiAPI.generatePlan({
        subject: plannerForm.subject,
        hoursPerDay: plannerForm.hours,
        examDate: plannerForm.date,
      });
      setStudyPlan(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate study plan.");
    } finally {
      setLoading(false);
    }
  };

  // --- Quiz Submit ---
  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTopic) return;
    setLoading(true);
    setQuizQuestions([]);
    setQuizScore(null);
    setSelectedAnswers({});
    setSubmittedQuiz(false);
    try {
      const res = await aiAPI.generateQuiz(quizTopic);
      setQuizQuestions(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: optIndex });
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(selectedAnswers).length < quizQuestions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    let correct = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    setQuizScore(correct);
    setSubmittedQuiz(true);
  };

  // --- Notes Submit ---
  const handleGenerateNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesInput) return;
    setLoading(true);
    setNotesSummary(null);
    try {
      const res = await aiAPI.generateNotesSummary(notesInput);
      setNotesSummary(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to summarize notes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-extrabold text-xl text-slate-800 dark:text-white">AI Sprint Companion</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">Supercharge your revision sessions using artificial intelligence</p>
        </div>
      </div>

      {/* Tab Segment Switcher */}
      <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab("planner")}
          className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "planner"
              ? "bg-primary text-white shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Planner
        </button>
        <button
          onClick={() => setActiveTab("quiz")}
          className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "quiz"
              ? "bg-primary text-white shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" /> Quiz
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "notes"
              ? "bg-primary text-white shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Summarizer
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="glass-card rounded-3xl p-8 space-y-6 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-16 shimmer-skeleton rounded-2xl"></div>
            <div className="h-16 shimmer-skeleton rounded-2xl"></div>
            <div className="h-16 shimmer-skeleton rounded-2xl"></div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: PLANNER --- */}
      {!loading && activeTab === "planner" && (
        <div className="space-y-6">
          {!studyPlan ? (
            <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 max-w-xl">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Generate AI Study Plan</h3>
              <form onSubmit={handleGeneratePlan} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Subject or Topic</label>
                  <input
                    type="text"
                    value={plannerForm.subject}
                    onChange={(e) => setPlannerForm({ ...plannerForm, subject: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
                    placeholder="e.g. Operating Systems / Rust"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Daily Hours</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={plannerForm.hours}
                      onChange={(e) => setPlannerForm({ ...plannerForm, hours: parseInt(e.target.value) })}
                      className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Exam Date</label>
                    <input
                      type="date"
                      value={plannerForm.date}
                      onChange={(e) => setPlannerForm({ ...plannerForm, date: e.target.value })}
                      className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-white rounded-xl text-xs font-black shadow-md shadow-primary/10 hover:opacity-95 transition-all"
                >
                  Generate Plan
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Plan Metadata */}
              <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-extrabold text-base text-slate-950 dark:text-white">{studyPlan.planName}</h3>
                  <button
                    onClick={() => setStudyPlan(null)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Reset Form
                  </button>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">{studyPlan.summary}</p>
              </div>

              {/* Milestones Road */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Roadmap Milestones</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {studyPlan.milestones?.map((milestone: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="glass-card rounded-3xl p-5 border border-slate-200/50 dark:border-slate-800/80 hover:shadow-sm transition-all space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          Day {milestone.day}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                          ⚡ {milestone.hours} Hours Focus
                        </span>
                      </div>

                      <h5 className="font-bold text-sm text-slate-800 dark:text-white">{milestone.title}</h5>
                      
                      <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-900 pt-3">
                        {milestone.tasks?.map((t: string, tIdx: number) => (
                          <div key={tIdx} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-bold text-amber-500 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                        <span className="text-slate-400 dark:text-slate-500 uppercase">Rewards</span>
                        <span>+{milestone.xpReward} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB CONTENT: QUIZ --- */}
      {!loading && activeTab === "quiz" && (
        <div className="space-y-6">
          {quizQuestions.length === 0 ? (
            <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 max-w-xl">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Generate AI Revision Quiz</h3>
              <form onSubmit={handleGenerateQuiz} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Topic to Test</label>
                  <input
                    type="text"
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
                    placeholder="e.g. Injective Web3 SDK / Operating Systems"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-white rounded-xl text-xs font-black shadow-md shadow-primary/10 hover:opacity-95 transition-all"
                >
                  Generate Quiz
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white">Topic: {quizTopic}</h3>
                  <p className="text-[10px] text-slate-400">Answer all questions to check results</p>
                </div>
                <button
                  onClick={() => setQuizQuestions([])}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Reset Quiz
                </button>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {quizQuestions.map((q, idx) => (
                  <div key={idx} className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 space-y-4">
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">
                      {idx + 1}. {q.question}
                    </h4>

                    {/* Options list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options?.map((opt: string, oIdx: number) => {
                        const isSelected = selectedAnswers[idx] === oIdx;
                        const isCorrectAnswer = q.correctIndex === oIdx;
                        
                        let optionStyle = "bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300";
                        
                        if (submittedQuiz) {
                          if (isCorrectAnswer) {
                            optionStyle = "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30";
                          } else if (isSelected) {
                            optionStyle = "bg-rose-500/15 text-rose-500 border border-rose-500/30";
                          } else {
                            optionStyle = "opacity-50 bg-slate-100 dark:bg-slate-900 text-slate-400";
                          }
                        } else if (isSelected) {
                          optionStyle = "bg-primary text-white shadow-md shadow-primary/20";
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectAnswer(idx, oIdx)}
                            className={`p-4 rounded-2xl text-xs font-bold text-left transition-all ${optionStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {submittedQuiz && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl text-[11px] leading-relaxed text-slate-400 border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-500 uppercase block mb-1">Explanation</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit panel */}
              {!submittedQuiz ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="w-full py-4 bg-primary text-white rounded-3xl text-sm font-black shadow-lg shadow-primary/25 hover:opacity-95 transition-all"
                >
                  Submit Quiz Answers
                </button>
              ) : (
                <div className="glass-card rounded-3xl p-6 border border-primary/20 text-center space-y-3 bg-primary/5">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Quiz Score Result</h4>
                  <div className="text-4xl font-black text-primary">{quizScore} / {quizQuestions.length}</div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                    {quizScore === quizQuestions.length 
                      ? "Flawless sprint! You scored 100%. Gained +100 XP!" 
                      : "Good attempt! Revise topics to boost your scores."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- TAB CONTENT: SUMMARIZER --- */}
      {!loading && activeTab === "notes" && (
        <div className="space-y-6">
          {!notesSummary ? (
            <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 max-w-2xl">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Summarize Long Study Notes</h3>
              <form onSubmit={handleGenerateNotes} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Paste Study Notes</label>
                  <textarea
                    rows={8}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl p-4 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Paste textbook definitions, lecture transcripts, or articles here..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-white rounded-xl text-xs font-black shadow-md shadow-primary/10 hover:opacity-95 transition-all"
                >
                  Summarize Notes
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">Summary: {notesSummary.title}</h3>
                <button
                  onClick={() => setNotesSummary(null)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  New Notes
                </button>
              </div>

              {/* Summarized Key takeaways */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Takeaways List */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Key Takeaways</h4>
                  <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 space-y-3">
                    {notesSummary.takeaways?.map((takeaway: string, idx: number) => (
                      <div key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        <Bookmark className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vocabulary definitions */}
                <div className="lg:col-span-1 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Flashcard Terms</h4>
                  <div className="space-y-3">
                    {notesSummary.keyConcepts?.map((c: any, idx: number) => (
                      <div key={idx} className="glass-card rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 hover:-translate-y-0.5 transition-all">
                        <span className="text-[10px] font-black text-primary uppercase block mb-1">{c.term}</span>
                        <p className="text-[11px] text-slate-400 leading-normal">{c.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
