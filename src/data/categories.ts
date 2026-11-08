// 15 marketplace categories (spec PROMPT 05).
export interface Category { name: string; slug: string; description: string; icon: string; }
export const CATEGORIES: Category[] = [
  { name: "AI Chatbots", slug: "ai-chatbots", description: "Conversational assistants and chat agents.", icon: "💬" },
  { name: "AI Writing", slug: "ai-writing", description: "Drafting, editing and long-form writing.", icon: "✍️" },
  { name: "AI Image Generation", slug: "ai-image-generation", description: "Generate and edit images from text.", icon: "🖼️" },
  { name: "AI Video Generation", slug: "ai-video-generation", description: "Create video from text, images or clips.", icon: "🎬" },
  { name: "AI Voice Generation", slug: "ai-voice-generation", description: "Text-to-speech and voice cloning.", icon: "🎙️" },
  { name: "AI Music", slug: "ai-music", description: "Compose and produce music with AI.", icon: "🎵" },
  { name: "AI Coding", slug: "ai-coding", description: "Code completion, review and explanation.", icon: "💻" },
  { name: "AI Business", slug: "ai-business", description: "Analytics, automation and operations.", icon: "📊" },
  { name: "AI Marketing", slug: "ai-marketing", description: "Campaigns, SEO and ad copy.", icon: "📣" },
  { name: "AI Education", slug: "ai-education", description: "Tutoring, study help and courses.", icon: "🎓" },
  { name: "AI Productivity", slug: "ai-productivity", description: "Notes, scheduling and workflows.", icon: "⚡" },
  { name: "AI Research", slug: "ai-research", description: "Literature search and summarisation.", icon: "🔬" },
  { name: "AI Data Analysis", slug: "ai-data-analysis", description: "Explore, visualise and explain data.", icon: "📈" },
  { name: "AI Design", slug: "ai-design", description: "UI, logos and creative design.", icon: "🎨" },
  { name: "AI Translation", slug: "ai-translation", description: "Translate text and documents.", icon: "🌐" },
];
