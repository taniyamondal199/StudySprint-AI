import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export class AIService {
  /**
   * Helper to query Gemini API via HTTP POST.
   */
  private static async queryGemini(prompt: string, fallbackJson: any): Promise<any> {
    if (!GEMINI_API_KEY) {
      return fallbackJson;
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (responseText) {
        return JSON.parse(responseText);
      }
    } catch (error) {
      console.error("Gemini API call failed, using fallback:", error);
    }
    return fallbackJson;
  }

  /**
   * Generate an optimized study schedule.
   */
  public static async generateStudyPlan(
    subject: string,
    hoursPerDay: number,
    examDateStr: string
  ): Promise<any> {
    const examDate = new Date(examDateStr);
    const today = new Date();
    const diffTime = Math.abs(examDate.getTime() - today.getTime());
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const totalStudyHours = diffDays * hoursPerDay;

    const prompt = `
      You are an elite academic counselor. Generate a structured, gamified study plan.
      Subject: "${subject}"
      Days available: ${diffDays} days
      Hours per day: ${hoursPerDay} hours
      Total study hours: ${totalStudyHours} hours
      
      Respond STRICTLY in JSON format with this structure:
      {
        "planName": "Sprint Plan for ${subject}",
        "summary": "Short 2 sentence overview of the study trajectory.",
        "milestones": [
          {
            "day": 1,
            "title": "Topic Title",
            "hours": 2,
            "tasks": ["Read introduction", "Complete basic exercises"],
            "difficulty": "Easy",
            "xpReward": 100
          }
        ]
      }
    `;

    // Local fallback planning data
    const localFallback = {
      planName: `Sprint Plan for ${subject}`,
      summary: `A high-impact study program designed to build mastery in ${subject} over the next ${diffDays} days with ${hoursPerDay} hours daily.`,
      milestones: Array.from({ length: Math.min(diffDays, 10) }).map((_, index) => {
        const day = index + 1;
        const rewardXp = 50 + hoursPerDay * 20;
        return {
          day,
          title: `Focus Sprint ${day}: Advanced Concepts of ${subject}`,
          hours: hoursPerDay,
          tasks: [
            `Deep dive study of key theoretical structures in ${subject} (Session ${day})`,
            `Solve and submit 3 practice problems to reinforce understanding`,
            `Summarize today's findings in under 5 minutes for your revision bank`,
          ],
          difficulty: index % 3 === 0 ? "Easy" : index % 3 === 1 ? "Medium" : "Hard",
          xpReward: rewardXp,
        };
      }),
    };

    return this.queryGemini(prompt, localFallback);
  }

  /**
   * Generate revision questions.
   */
  public static async generateQuiz(topic: string): Promise<any[]> {
    const prompt = `
      Generate a set of 5 multiple-choice questions on the topic: "${topic}".
      Provide high quality conceptual questions.
      
      Respond STRICTLY in JSON format with the following array structure:
      [
        {
          "question": "Question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIndex": 0,
          "explanation": "Brief explanation of why Option A is correct."
        }
      ]
    `;

    // Local fallback quiz data
    const localFallback = [
      {
        question: `What is the primary architectural goal of ${topic}?`,
        options: [
          "Optimizing hardware utilization and computational speeds",
          "Decentralizing verification networks to protect data ownership",
          "Minimizing memory space overhead to boost response speed",
          "Automating repetitive structural data updates",
        ],
        correctIndex: 1,
        explanation: `${topic} focuses heavily on decentralized schemas to guarantee secure and verified operations.`,
      },
      {
        question: `Which of the following represents a common challenge in ${topic}?`,
        options: [
          "Low clock speeds in physical hardware microchips",
          "High transaction fees and latencies under heavy congestion",
          "Inefficient CSS rendering inside client web screens",
          "Data packet duplication over physical fiber channels",
        ],
        correctIndex: 1,
        explanation: "Congestion and transaction scaling remain pivotal research challenges in decentralized networks.",
      },
      {
        question: `How does ${topic} track historical transitions?`,
        options: [
          "By purging all historical logs after database compaction",
          "By indexing state-tree updates sequentially in an immutable ledger",
          "By polling external REST APIs every 25 seconds",
          "By syncing client-side session storage caches",
        ],
        correctIndex: 1,
        explanation: "State-tree updates are recorded in an immutable ledger, ensuring a clear, transparent historical trace.",
      },
      {
        question: `What role does verification play in ${topic}?`,
        options: [
          "It guarantees that client UI styling meets high-fidelity layouts",
          "It cryptographically signs transactions to validate network consent",
          "It schedules background worker threads on active servers",
          "It compresses assets before transmitting them to IPFS",
        ],
        correctIndex: 1,
        explanation: "Cryptographic signatures prove authenticity and validation across nodes without central authorities.",
      },
      {
        question: `How does ${topic} achieve synchronization?`,
        options: [
          "Through real-time database locks on local nodes",
          "Through consensus protocols like Proof-of-Stake or Proof-of-Work",
          "Through WebSocket polling on browser clients",
          "Through static file uploads to web servers",
        ],
        correctIndex: 1,
        explanation: "Consensus protocols achieve agreement on block state changes across global nodes.",
      },
    ];

    const result = await this.queryGemini(prompt, localFallback);
    return Array.isArray(result) ? result : localFallback;
  }

  /**
   * Summarize notes into revision key points.
   */
  public static async generateRevisionNotes(notesContent: string): Promise<any> {
    const prompt = `
      Summarize the following study notes. Extract key concepts, definitions, and structured key takeaways.
      Notes:
      """
      ${notesContent}
      """
      
      Respond STRICTLY in JSON format with this structure:
      {
        "title": "Revision Summary Title",
        "keyConcepts": [
          { "term": "Term Name", "definition": "Term Definition" }
        ],
        "takeaways": [
          "Takeaway bullet point 1",
          "Takeaway bullet point 2"
        ]
      }
    `;

    // Local fallback notes summary
    const localFallback = {
      title: "Summary of Study Notes",
      keyConcepts: [
        {
          term: "State Transition",
          definition: "A change in the underlying data structure representing a progress step or state alteration.",
        },
        {
          term: "Gamification Loop",
          definition: "The cycle of action, feedback, reward, and progression designed to motivate habits.",
        },
        {
          term: "On-chain proof",
          definition: "A cryptographically verifiable record written to a public blockchain validating an action occurred.",
        },
      ],
      takeaways: [
        "Consistent tracking dramatically improves retention rates and study habits.",
        "Dividing material into discrete milestones (micro-sprints) reduces procrastination.",
        "On-chain transactions provide transparent, decentralized validation of accomplishments.",
      ],
    };

    return this.queryGemini(prompt, localFallback);
  }
}
