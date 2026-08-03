import confetti from "canvas-confetti";

export const triggerConfetti = () => {
  try {
    // School celebration colors
    const colors = ["#6C63FF", "#3B82F6", "#FFD700", "#FF4B2B", "#00F2FE"];

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
    });

    // Sub-bursts
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
    }, 250);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });
    }, 400);
  } catch (error) {
    console.warn("Confetti animation failed:", error);
  }
};
