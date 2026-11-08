// SAMPLE TOOL DATA — clearly labelled SAMPLE everywhere it is shown.
// These are placeholder listings so the marketplace UI can be exercised
// before real creator tools are onboarded. Ratings, reviews and usage
// figures here are SAMPLE, not real user data.
export type PricingType = "Free" | "Paid" | "Freemium";
export interface SampleTool {
  name: string; slug: string; description: string; category: string;
  pricing: PricingType; ratingSample: number; features: string[];
  languages: string[]; demoAvailable: boolean; demoKey?: string; priceMonthly?: number;
}
export const SAMPLE_TOOLS: SampleTool[] = [
  { name: "LoraChat", slug: "lorachat", description: "SAMPLE: friendly conversational assistant for everyday questions.", category: "AI Chatbots", pricing: "Freemium", ratingSample: 4.5, features: ["Chat", "Memory", "Multilingual"], languages: ["English", "Spanish"], demoAvailable: true, demoKey: "chat-assistant", priceMonthly: 9 },
  { name: "InkPilot", slug: "inkpilot", description: "SAMPLE: long-form writing assistant for blogs and docs.", category: "AI Writing", pricing: "Freemium", ratingSample: 4.6, features: ["Drafts", "Tone control", "Grammar"], languages: ["English"], demoAvailable: true, demoKey: "text-writer", priceMonthly: 12 },
  { name: "PixelForge", slug: "pixelforge", description: "SAMPLE: text-to-image generation with style presets.", category: "AI Image Generation", pricing: "Paid", ratingSample: 4.4, features: ["Text-to-image", "Styles", "Upscale"], languages: ["English"], demoAvailable: false, priceMonthly: 15 },
  { name: "MotionMint", slug: "motionmint", description: "SAMPLE: short video clips generated from a prompt.", category: "AI Video Generation", pricing: "Paid", ratingSample: 4.2, features: ["Text-to-video", "Templates"], languages: ["English"], demoAvailable: false, priceMonthly: 19 },
  { name: "VoxCraft", slug: "voxcraft", description: "SAMPLE: natural text-to-speech voices.", category: "AI Voice Generation", pricing: "Freemium", ratingSample: 4.7, features: ["TTS", "Voice library"], languages: ["English", "French"], demoAvailable: false, priceMonthly: 8 },
  { name: "MelodyMind", slug: "melodymind", description: "SAMPLE: royalty-free music composition.", category: "AI Music", pricing: "Paid", ratingSample: 4.3, features: ["Compose", "Stems"], languages: ["English"], demoAvailable: false, priceMonthly: 14 },
  { name: "CodeSage", slug: "codesage", description: "SAMPLE: explains code in plain language.", category: "AI Coding", pricing: "Free", ratingSample: 4.8, features: ["Explain code", "Snippets"], languages: ["English"], demoAvailable: true, demoKey: "code-explainer" },
  { name: "BizLens", slug: "bizlens", description: "SAMPLE: business dashboards and summaries.", category: "AI Business", pricing: "Paid", ratingSample: 4.1, features: ["Dashboards", "Reports"], languages: ["English"], demoAvailable: false, priceMonthly: 29 },
  { name: "MarketMaven", slug: "marketmaven", description: "SAMPLE: ad copy and campaign ideas.", category: "AI Marketing", pricing: "Freemium", ratingSample: 4.5, features: ["Ad copy", "SEO titles"], languages: ["English"], demoAvailable: true, demoKey: "title-generator", priceMonthly: 11 },
  { name: "StudyBuddy AI", slug: "studybuddy-ai", description: "SAMPLE: tutoring and quiz generation.", category: "AI Education", pricing: "Freemium", ratingSample: 4.6, features: ["Quizzes", "Flashcards"], languages: ["English", "Spanish"], demoAvailable: true, demoKey: "summarizer" },
  { name: "FlowState", slug: "flowstate", description: "SAMPLE: meeting notes and task capture.", category: "AI Productivity", pricing: "Free", ratingSample: 4.4, features: ["Notes", "Tasks"], languages: ["English"], demoAvailable: true, demoKey: "summarizer" },
  { name: "ResearchRadar", slug: "researchradar", description: "SAMPLE: paper search and summarisation.", category: "AI Research", pricing: "Paid", ratingSample: 4.3, features: ["Paper search", "Summaries"], languages: ["English"], demoAvailable: true, demoKey: "summarizer", priceMonthly: 18 },
  { name: "DataDive", slug: "datadive", description: "SAMPLE: plain-language data explanations.", category: "AI Data Analysis", pricing: "Paid", ratingSample: 4.2, features: ["Charts", "Insights"], languages: ["English"], demoAvailable: false, priceMonthly: 24 },
  { name: "DesignDeck", slug: "designdeck", description: "SAMPLE: logos and UI mockups.", category: "AI Design", pricing: "Freemium", ratingSample: 4.5, features: ["Logos", "Mockups"], languages: ["English"], demoAvailable: false, priceMonthly: 10 },
  { name: "LinguaBridge", slug: "linguabridge", description: "SAMPLE: fast text translation.", category: "AI Translation", pricing: "Free", ratingSample: 4.6, features: ["Translate", "40+ languages"], languages: ["English", "Spanish", "French", "Bengali"], demoAvailable: true, demoKey: "translator" },
  { name: "ChatForge Pro", slug: "chatforge-pro", description: "SAMPLE: custom chatbot builder for teams.", category: "AI Chatbots", pricing: "Paid", ratingSample: 4.4, features: ["Custom bots", "Embed"], languages: ["English"], demoAvailable: false, priceMonthly: 39 },
  { name: "ScriptSmith", slug: "scriptsmith", description: "SAMPLE: scripts and story outlines.", category: "AI Writing", pricing: "Freemium", ratingSample: 4.5, features: ["Scripts", "Outlines"], languages: ["English"], demoAvailable: true, demoKey: "text-writer", priceMonthly: 7 },
  { name: "VoiceVerse", slug: "voiceverse", description: "SAMPLE: narration voices for video.", category: "AI Voice Generation", pricing: "Paid", ratingSample: 4.3, features: ["Narration", "Accents"], languages: ["English"], demoAvailable: false, priceMonthly: 16 },
];
export const PLANS = [
  { tier: "FREE", name: "Free", monthly: 0, yearly: 0, credits: 20, features: ["Limited AI demo access", "20 daily credits", "Basic tools", "Standard usage limits"] },
  { tier: "STARTER", name: "Starter", monthly: 9, yearly: 90, credits: 500, features: ["Higher usage limits", "More AI tools", "500 monthly credits", "Basic history"] },
  { tier: "PRO", name: "Pro", monthly: 19, yearly: 190, credits: 2000, features: ["Advanced AI tools", "2,000 monthly credits", "Priority processing where supported", "Extended usage history"] },
  { tier: "PREMIUM", name: "Premium", monthly: 39, yearly: 390, credits: 10000, features: ["Highest usage limits", "Premium tools", "Advanced features", "Priority support"] },
];
