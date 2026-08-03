import React from "react";

interface SVGBadgeProps {
  badgeId: string;
  className?: string;
  size?: number;
}

export const SVGBadge: React.FC<SVGBadgeProps> = ({ badgeId, className = "", size = 64 }) => {
  const getBadgeSVG = () => {
    switch (badgeId) {
      case "badge_first_challenge":
        return (
          // First Sprint - Shield with Gold Star
          <svg viewBox="0 0 100 100" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shieldGrad" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#6C63FF" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="starGrad" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#FFF275" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Outer Ring */}
            <circle cx="50" cy="50" r="46" stroke="url(#shieldGrad)" strokeWidth="3" strokeDasharray="4 2" />
            {/* Shield Base */}
            <path d="M50 14 C65 14 78 20 78 35 C78 60 50 82 50 82 C50 82 22 60 22 35 C22 20 35 14 50 14 Z" fill="url(#shieldGrad)" />
            {/* Inner Shield Overlay */}
            <path d="M50 20 C62 20 72 25 72 37 C72 58 50 76 50 76 C50 76 28 58 28 37 C28 25 38 20 50 20 Z" fill="#FFFFFF" fillOpacity="0.15" />
            {/* Gold Star */}
            <path d="M50 32 L54 44 L67 44 L56 52 L60 65 L50 57 L40 65 L44 52 L33 44 L46 44 Z" fill="url(#starGrad)" filter="url(#glow)" />
          </svg>
        );

      case "badge_streak_3":
        return (
          // Habit Builder - 3-Day Streak Flame
          <svg viewBox="0 0 100 100" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="flameGrad" x1="0" y1="100" x2="0" y2="0">
                <stop offset="0%" stopColor="#FF416C" />
                <stop offset="50%" stopColor="#FF4B2B" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="44" fill="#FF4B2B" fillOpacity="0.08" stroke="#FF4B2B" strokeWidth="2" />
            {/* Flame Outer */}
            <path d="M50 80 C68 80 74 65 74 48 C74 24 50 14 50 14 C50 14 26 24 26 48 C26 65 32 80 50 80 Z" fill="url(#flameGrad)" />
            {/* Flame Core */}
            <path d="M50 76 C60 76 64 66 64 54 C64 38 50 30 50 30 C50 30 36 38 36 54 C36 66 40 76 50 76 Z" fill="#FFF" fillOpacity="0.3" />
            {/* Number 3 */}
            <text x="50" y="62" fill="#FFFFFF" fontSize="20" fontWeight="bold" textAnchor="middle" fontFamily="Outfit">3</text>
          </svg>
        );

      case "badge_streak_7":
        return (
          // Unstoppable Focus - 7-Day Streak Blue Fire
          <svg viewBox="0 0 100 100" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="blueFire" x1="0" y1="100" x2="0" y2="0">
                <stop offset="0%" stopColor="#00c6ff" />
                <stop offset="100%" stopColor="#0072ff" />
              </linearGradient>
              <linearGradient id="goldBorder" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFA500" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="44" fill="#00c6ff" fillOpacity="0.08" stroke="url(#goldBorder)" strokeWidth="3" />
            {/* Fire */}
            <path d="M50 80 C68 80 74 65 74 48 C74 24 50 14 50 14 C50 14 26 24 26 48 C26 65 32 80 50 80 Z" fill="url(#blueFire)" />
            <path d="M50 75 C60 75 65 65 65 52 C65 36 50 26 50 26 C50 26 35 36 35 52 C35 65 40 75 50 75 Z" fill="#FFFFFF" fillOpacity="0.3" />
            <text x="50" y="60" fill="#FFFFFF" fontSize="18" fontWeight="black" textAnchor="middle" fontFamily="Outfit">7</text>
          </svg>
        );

      case "badge_streak_30":
        return (
          // Scholar Sovereign - 30-Day Streak Crown
          <svg viewBox="0 0 100 100" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="purpleCrown" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#9C27B0" />
                <stop offset="50%" stopColor="#673AB7" />
                <stop offset="100%" stopColor="#3F51B5" />
              </linearGradient>
              <linearGradient id="crownGold" x1="0" y1="0" x2="0" y2="100">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="100%" stopColor="#FFB300" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" stroke="url(#crownGold)" strokeWidth="3" fill="url(#purpleCrown)" />
            {/* Crown */}
            <path d="M22 66 L28 42 L42 54 L50 32 L58 54 L72 42 L78 66 Z" fill="url(#crownGold)" />
            {/* Crown gems */}
            <circle cx="22" cy="40" r="3" fill="#FFF" />
            <circle cx="42" cy="52" r="2.5" fill="#FFF" />
            <circle cx="50" cy="30" r="3.5" fill="#FFF" />
            <circle cx="58" cy="52" r="2.5" fill="#FFF" />
            <circle cx="78" cy="40" r="3" fill="#FFF" />
            {/* Jewels on crown base */}
            <rect x="35" y="60" width="30" height="4" rx="2" fill="#E040FB" />
            <text x="50" y="82" fill="#FFB300" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="Outfit">30 DAYS</text>
          </svg>
        );

      case "badge_challenges_50":
        return (
          // Elite Veteran - 50 Challenges Double Shield & Wings
          <svg viewBox="0 0 100 100" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ironGrad" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#708090" />
                <stop offset="50%" stopColor="#B0C4DE" />
                <stop offset="100%" stopColor="#4682B4" />
              </linearGradient>
              <linearGradient id="goldWings" x1="0" y1="0" x2="100" y2="0">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FF8C00" />
              </linearGradient>
            </defs>
            {/* Wings Background */}
            <path d="M14 45 C5 25 35 30 45 42 M86 45 C95 25 65 30 55 42" stroke="url(#goldWings)" strokeWidth="6" strokeLinecap="round" />
            <path d="M18 52 C10 35 35 40 45 48 M82 52 C90 35 65 40 55 48" stroke="url(#goldWings)" strokeWidth="4" strokeLinecap="round" />
            {/* Shield */}
            <path d="M50 20 C65 20 75 25 75 42 C75 62 50 82 50 82 C50 82 25 62 25 42 C25 25 35 20 50 20 Z" fill="url(#ironGrad)" stroke="#FFF" strokeWidth="2" />
            {/* Inner Shield */}
            <path d="M50 25 C60 25 68 29 68 42 C68 57 50 73 50 73 C50 73 32 57 32 42 C32 29 40 25 50 25 Z" fill="#1E293B" />
            {/* Number 50 */}
            <text x="50" y="52" fill="url(#goldWings)" fontSize="22" fontWeight="black" textAnchor="middle" fontFamily="Outfit">50</text>
          </svg>
        );

      case "badge_challenges_100":
        return (
          // Legendary Sprinter - 100 Challenges Trophy
          <svg viewBox="0 0 100 100" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="legendGold" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#FFF" />
                <stop offset="20%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#CC9900" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" stroke="url(#legendGold)" strokeWidth="3" fill="#0F172A" />
            {/* Trophy outline */}
            {/* Handles */}
            <path d="M30 42 C20 42 22 55 35 55 M70 42 C80 42 78 55 65 55" stroke="url(#legendGold)" strokeWidth="3.5" strokeLinecap="round" />
            {/* Cup */}
            <path d="M32 30 H68 V46 C68 56 60 64 50 64 C40 64 32 56 32 46 Z" fill="url(#legendGold)" />
            {/* Stand */}
            <path d="M48 64 H52 V74 H48 Z M40 74 H60 V78 H40 Z" fill="url(#legendGold)" />
            {/* Star inside cup */}
            <path d="M50 36 L52 41 L57 41 L53 44 L55 49 L50 46 L45 49 L47 44 L43 41 L48 41 Z" fill="#0F172A" />
            {/* Text 100 */}
            <text x="50" y="86" fill="url(#legendGold)" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="Outfit">100 SPRINT</text>
          </svg>
        );

      case "badge_hours_100":
        return (
          // Grand Thinker - Hourglass
          <svg viewBox="0 0 100 100" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hourglassGrad" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#00F2FE" />
                <stop offset="100%" stopColor="#4FACFE" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" stroke="url(#hourglassGrad)" strokeWidth="3" fill="#1E293B" />
            {/* Hourglass Frame */}
            <path d="M35 30 H65 V34 C65 44 55 48 55 50 C55 52 65 56 65 66 V70 H35 V66 C35 56 45 52 45 50 C45 48 35 44 35 34 Z" stroke="url(#hourglassGrad)" strokeWidth="3.5" fill="none" />
            {/* Sand top */}
            <path d="M38 34 H62 C62 42 50 46 50 46 C50 46 38 42 38 34 Z" fill="url(#hourglassGrad)" fillOpacity="0.4" />
            {/* Sand falling stream */}
            <line x1="50" y1="46" x2="50" y2="60" stroke="url(#hourglassGrad)" strokeWidth="2.5" strokeDasharray="3 3" />
            {/* Sand bottom stack */}
            <path d="M42 66 C42 66 50 58 50 58 C50 58 58 66 58 66 H42 Z" fill="url(#hourglassGrad)" />
            {/* Text 100H */}
            <text x="50" y="83" fill="#FFF" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="Outfit">100 HOURS</text>
          </svg>
        );

      case "badge_level_10":
        return (
          // Ascended Mind - Level 10
          <svg viewBox="0 0 100 100" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="neonLight" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#f107a3" />
                <stop offset="100%" stopColor="#7b2ff7" />
              </linearGradient>
            </defs>
            {/* Outer Hexagon */}
            <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" stroke="url(#neonLight)" strokeWidth="4" fill="#0F172A" />
            <path d="M50 16 L79 33 L79 67 L50 84 L21 67 L21 33 Z" fill="url(#neonLight)" fillOpacity="0.1" />
            {/* Roman numeral X */}
            <path d="M38 34 H44 L50 46 L56 34 H62 L53 50 L62 66 H56 L50 54 L44 66 H38 L47 50 Z" fill="url(#neonLight)" />
            <text x="50" y="80" fill="#FFF" fontSize="10" fontWeight="black" textAnchor="middle" fontFamily="Outfit">LVL 10</text>
          </svg>
        );

      default:
        // Generic achievement star badge
        return (
          <svg viewBox="0 0 100 100" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" stroke="#6C63FF" strokeWidth="2" fill="#EEF2FF" />
            <path d="M50 25 L57 41 L75 41 L61 51 L66 68 L50 58 L34 68 L39 51 L25 41 L43 41 Z" fill="#6C63FF" />
          </svg>
        );
    }
  };

  return <div className={`inline-flex items-center justify-center ${className}`}>{getBadgeSVG()}</div>;
};
