/**
 * Graded Reader Articles Dataset for MyLala's "Bacaan" Pillar.
 * Carefully curated across CEFR levels: A1 (Explorer) to C1 (Mastermind).
 * Equipped with interactive vocabulary definitions for the tap-to-save flashcard feature.
 */

export const GRADED_ARTICLES = [
  {
    id: 'art-a1-morning-coffee',
    cefr_level: 'A1',
    category: 'Daily Life',
    title: 'A Quiet Morning in the City',
    excerpt: 'Langkah sederhana menikmati pagi, menyeduh kopi, dan menyapa tetangga dengan kosakata dasar.',
    read_time: '2 min',
    words_count: 110,
    content_paragraphs: [
      'Every morning, Leo wakes up at seven o\'clock. The sun shines through his window, and the city is still quiet. He walks to the kitchen and boils clean water.',
      'Leo loves black coffee. He grinds fresh coffee beans and pours hot water slowly. The warm aroma fills the whole room. It is his favorite moment of the day.',
      'He sits near the window with his notebook. Today is a peaceful day. He smiles and gets ready for work with positive energy.',
    ],
    vocabulary: [
      { word: 'quiet', meaning: 'tenang / sunyi', example: 'The city is still quiet in the morning.' },
      { word: 'aroma', meaning: 'aroma / wangi harum', example: 'The warm aroma fills the whole room.' },
      { word: 'peaceful', meaning: 'damai / tentram', example: 'Today is a peaceful day.' },
    ],
  },
  {
    id: 'art-a2-traveling-solo',
    cefr_level: 'A2',
    category: 'Travel & Lifestyle',
    title: 'The Magic of Traveling Alone',
    excerpt: 'Kisah keberanian menjelajahi kota baru sendirian dan menemukan teman baru di perjalanan.',
    read_time: '3 min',
    words_count: 195,
    content_paragraphs: [
      'Traveling alone sounds scary to many people. However, when Maya packed her backpack for Kyoto, she felt more excited than nervous. It was her very first solo adventure.',
      'During her journey, she discovered that being alone does not mean being lonely. Local shop owners were friendly, and other travelers shared interesting stories at the train station. She learned how to order traditional food and navigate subway maps by herself.',
      'Solo travel teaches independence and confidence. When you solve small challenges on the road, you realize that you are stronger and more capable than you ever imagined.',
    ],
    vocabulary: [
      { word: 'adventure', meaning: 'petualangan', example: 'It was her very first solo adventure.' },
      { word: 'lonely', meaning: 'kesepian', example: 'Being alone does not mean being lonely.' },
      { word: 'independence', meaning: 'kemandirian', example: 'Solo travel teaches independence.' },
      { word: 'capable', meaning: 'mampu / cakap', example: 'You realize that you are more capable than you imagined.' },
    ],
  },
  {
    id: 'art-b1-digital-nomads',
    cefr_level: 'B1',
    category: 'Work & Future',
    title: 'How Remote Work Redefined Freedom',
    excerpt: 'Fenomena pekerja jarak jauh yang menjelajahi dunia sambil tetap produktif di laptop.',
    read_time: '3 min',
    words_count: 260,
    content_paragraphs: [
      'A decade ago, the standard career path required employees to sit in an office cubicle from nine to five. Today, high-speed internet and cloud software have completely transformed how professionals collaborate across different continents.',
      'Digital nomads are individuals who leverage telecommunication technologies to perform their jobs while living in different cities or countries. Instead of being tied to a fixed physical desk, a designer or software engineer might work from a beachside cafe in Bali or a quiet library in Tokyo.',
      'Nevertheless, this lifestyle requires tremendous discipline. Without a boss watching over your shoulder, time management becomes paramount. Successful remote workers establish strict daily routines and communicate transparently with their teams to maintain high productivity.',
    ],
    vocabulary: [
      { word: 'collaborate', meaning: 'berkolaborasi / bekerja sama', example: 'Professionals collaborate across different continents.' },
      { word: 'leverage', meaning: 'memanfaatkan secara optimal', example: 'Digital nomads leverage telecommunication technologies.' },
      { word: 'paramount', meaning: 'sangat penting / paling utama', example: 'Time management becomes paramount.' },
      { word: 'transparently', meaning: 'secara transparan & terbuka', example: 'Communicate transparently with team members.' },
    ],
  },
  {
    id: 'art-b2-brain-spaced-repetition',
    cefr_level: 'B2',
    category: 'Cognitive Science',
    title: 'The Forgetting Curve & The Science of Memory Retention',
    excerpt: 'Penjelasan ilmiah mengapa sistem Spaced Repetition (SRS) mampu melipatgandakan daya ingat manusia.',
    read_time: '4 min',
    words_count: 340,
    content_paragraphs: [
      'In the late nineteenth century, German psychologist Hermann Ebbinghaus conducted pioneering research into human memory. He discovered what is now known as the "Forgetting Curve"—a mathematical model illustrating how rapidly newly acquired information deteriorates over time if no active attempt is made to retain it.',
      'According to Ebbinghaus, humans forget roughly fifty percent of newly encountered facts within twenty-four hours. Cramming the night before an exam might produce short-term recall, but the knowledge evaporates almost immediately afterward because neural pathways have not been properly consolidated.',
      'Spaced Repetition Systems (SRS) systematically counteract this decay. By reviewing material at expanding chronological intervals—just as a memory is on the verge of fading—the brain is forced to actively reconstruct neural connections. Consequently, the memory trace transitions from fragile working memory into resilient long-term storage with minimal daily effort.',
    ],
    vocabulary: [
      { word: 'pioneering', meaning: 'pelopor / terobosan awal', example: 'He conducted pioneering research into memory.' },
      { word: 'deteriorates', meaning: 'memburuk / mengalami penurunan', example: 'Information deteriorates over time.' },
      { word: 'consolidated', meaning: 'diperkuat / dikonsolidasikan', example: 'Neural pathways have not been properly consolidated.' },
      { word: 'resilient', meaning: 'tangguh / tahan lama', example: 'Transitions into resilient long-term storage.' },
    ],
  },
  {
    id: 'art-c1-ai-linguistics',
    cefr_level: 'C1',
    category: 'Linguistics & Technology',
    title: 'Neural Networks and the Evolution of Modern Syntax',
    excerpt: 'Analisis mendalam mengenai dampak kecerdasan buatan terhadap evolusi bahasa manusia dan semantik formal.',
    read_time: '4 min',
    words_count: 395,
    content_paragraphs: [
      'The advent of Large Language Models has sparked profound debate regarding the nature of human cognition and language acquisition. For centuries, linguists spearheaded by Noam Chomsky posited that humans possess an innate Universal Grammar—a biologically predetermined cognitive blueprint that facilitates effortless syntactic structuring during childhood.',
      'Conversely, contemporary deep learning architectures demonstrate that nuanced semantic comprehension and grammatical fidelity can emerge purely through statistical correlation across vast textual corpora. By calculating multi-dimensional vector embeddings, neural transformers mirror complex syntactic subtleties without explicit hard-coded pedagogical rules.',
      'This paradigm shift raises pivotal existential inquiries: Is linguistic fluency merely sophisticated probability prediction, or does authentic communication necessitate intrinsic conscious intentionality? As computational linguistics continues to dismantle historical orthodoxy, the boundary between biological intelligence and synthetic cognition grows increasingly porous.',
    ],
    vocabulary: [
      { word: 'spearheaded', meaning: 'dipelopori / dipimpin di garis depan', example: 'Linguists spearheaded by Chomsky posited Universal Grammar.' },
      { word: 'innate', meaning: 'bawaan lahir / alamiah', example: 'Humans possess an innate linguistic capacity.' },
      { word: 'fidelity', meaning: 'akurasi tinggi / ketepatan mutlak', example: 'Grammatical fidelity emerges through statistical models.' },
      { word: 'porous', meaning: 'berpori / batasnya semakin memudar', example: 'The boundary between artificial and biological grows porous.' },
    ],
  },
];
