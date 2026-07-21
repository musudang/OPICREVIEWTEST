import type { Question, QuestionType } from '../types'

// 자체 제작 연습 문제은행 (실제 OPIc 기출 문항을 복제하지 않음 — proc/spec/00_ai-guidelines.md 참고)
// 주제 taxonomy는 실제 Background Survey 화면(proc/spec/05_content-data.md Part1~4) 구조를 참고했다.

const STANDARD_DIFFICULTY = [3, 4, 5, 6]

function comboSet(topic: string, parts: [QuestionType, string][]): Question[] {
  return parts.map(([type, promptText], i) => ({
    id: `combo-${topic}-${i + 1}`,
    category: topic,
    type,
    difficulty: STANDARD_DIFFICULTY,
    setGroup: topic,
    order: i + 1,
    promptText,
  }))
}

// --- 콤보셋 주제 (Part1~4 설문 taxonomy 커버) ---
const COMBO_TOPICS: { topic: string; label: string; parts: [QuestionType, string][] }[] = [
  // Part 1 — 종사 분야
  {
    topic: 'home-office', label: '재택근무',
    parts: [
      ['combo-desc', 'Describe the space where you usually work from home. What does it look like?'],
      ['combo-habit', 'What does a typical day working from home look like for you?'],
      ['combo-exp', 'Tell me about a challenge you faced while working remotely and how you dealt with it.'],
    ],
  },
  {
    topic: 'teaching', label: '교육/강의',
    parts: [
      ['combo-desc', 'Describe the place where you usually teach or give lessons.'],
      ['combo-habit', 'What is your typical routine like when you are preparing for or giving a class?'],
      ['combo-exp', 'Tell me about a memorable experience you had with a student or class.'],
    ],
  },
  // Part 2 — 학생
  {
    topic: 'college-major', label: '전공/학업',
    parts: [
      ['combo-desc', 'Describe the subject or major you are currently studying.'],
      ['combo-habit', 'What does your typical school day or study routine look like?'],
      ['combo-exp', 'Tell me about a class or project that was especially memorable for you.'],
    ],
  },
  // Part 3 — 거주형태
  {
    topic: 'housing', label: '거주형태',
    parts: [
      ['combo-desc', 'Describe the place where you currently live.'],
      ['combo-compare', 'How is the place where you live now different from where you lived before?'],
      ['combo-exp', 'Tell me about a memorable experience related to your home, such as moving in or solving a problem there.'],
    ],
  },
  // Part 4-1 — 여가 활동
  {
    topic: 'movie', label: '영화',
    parts: [
      ['combo-desc', 'Describe the movie theater you usually go to. What does it look like inside?'],
      ['combo-habit', 'What do you usually do before, during, and after watching a movie? Describe your typical movie-going habits.'],
      ['combo-exp', 'Tell me about a movie you watched recently that left a strong impression on you. What happened and why did you like it?'],
    ],
  },
  {
    topic: 'cafe', label: '카페',
    parts: [
      ['combo-desc', 'Describe your favorite cafe. What does it look like, and why do you like going there?'],
      ['combo-compare', 'How has your cafe-going habit changed compared to a few years ago?'],
      ['combo-exp', 'Tell me about a memorable experience you had at a cafe.'],
    ],
  },
  {
    topic: 'concert', label: '콘서트',
    parts: [
      ['combo-desc', 'Describe a concert venue you have been to.'],
      ['combo-habit', 'What do you usually do to prepare when you are going to see a concert?'],
      ['combo-exp', 'Tell me about a concert you attended that you especially enjoyed.'],
    ],
  },
  {
    topic: 'park', label: '공원',
    parts: [
      ['combo-desc', 'Describe a park that you like to visit.'],
      ['combo-habit', 'What do you usually do when you go to the park?'],
      ['combo-exp', 'Tell me about a memorable time you spent at a park.'],
    ],
  },
  {
    topic: 'museum', label: '박물관',
    parts: [
      ['combo-desc', 'Describe a museum you have visited.'],
      ['combo-habit', 'What do you usually do when you visit a museum?'],
      ['combo-exp', 'Tell me about a museum exhibit or visit that left a strong impression on you.'],
    ],
  },
  {
    topic: 'camping', label: '캠핑',
    parts: [
      ['combo-desc', 'Describe a place where you usually go camping.'],
      ['combo-habit', 'What do you usually do to prepare for a camping trip?'],
      ['combo-exp', 'Tell me about a memorable camping experience you had.'],
    ],
  },
  {
    topic: 'beach', label: '해변',
    parts: [
      ['combo-desc', 'Describe a beach you like to visit.'],
      ['combo-habit', 'What do you usually do when you spend time at the beach?'],
      ['combo-exp', 'Tell me about a memorable trip you took to the beach.'],
    ],
  },
  {
    topic: 'shopping', label: '쇼핑',
    parts: [
      ['combo-desc', 'Describe a store or shopping area you like to visit.'],
      ['combo-habit', 'What do you usually do when you go shopping?'],
      ['combo-exp', 'Tell me about a memorable shopping experience you had.'],
    ],
  },
  {
    topic: 'dining-out', label: '외식/식당',
    parts: [
      ['combo-desc', 'Describe a restaurant that you often go to.'],
      ['combo-habit', 'What do you usually do when you go out to eat, from choosing a restaurant to ordering?'],
      ['combo-exp', 'Tell me about a memorable experience you had at a restaurant.'],
    ],
  },
  {
    topic: 'furniture', label: '가구/인테리어',
    parts: [
      ['combo-desc', 'Describe the furniture store you usually go to, or the furniture in your home.'],
      ['combo-habit', 'What do you usually consider when buying furniture or decorating your home?'],
      ['combo-exp', 'Tell me about a memorable experience buying or arranging furniture.'],
    ],
  },
  {
    topic: 'festival', label: '축제',
    parts: [
      ['combo-desc', 'Describe a festival that you usually attend or would like to attend.'],
      ['combo-habit', 'What do you usually do when you attend a festival?'],
      ['combo-exp', 'Tell me about a memorable festival you attended.'],
    ],
  },
  {
    topic: 'fashion', label: '패션',
    parts: [
      ['combo-desc', 'Describe the style of clothes you usually wear.'],
      ['combo-compare', 'How has your fashion style changed compared to a few years ago?'],
      ['combo-exp', 'Tell me about a memorable shopping experience buying clothes.'],
    ],
  },
  {
    topic: 'holiday', label: '명절',
    parts: [
      ['combo-desc', 'Describe how your family usually spends a traditional holiday.'],
      ['combo-compare', 'How do you celebrate holidays now compared to when you were a child?'],
      ['combo-exp', 'Tell me about a memorable holiday experience with your family.'],
    ],
  },
  {
    topic: 'library', label: '도서관',
    parts: [
      ['combo-desc', 'Describe a library that you usually go to.'],
      ['combo-habit', 'What do you usually do when you visit the library?'],
      ['combo-exp', 'Tell me about a memorable experience you had at a library.'],
    ],
  },
  {
    topic: 'tv-watching', label: 'TV 시청',
    parts: [
      ['combo-desc', 'Describe a TV show that you enjoy watching.'],
      ['combo-habit', 'What is your typical routine for watching TV?'],
      ['combo-exp', 'Tell me about a TV show or episode that left a strong impression on you.'],
    ],
  },
  {
    topic: 'sns', label: 'SNS',
    parts: [
      ['combo-desc', 'Describe the social media platform you use most often.'],
      ['combo-habit', 'What do you usually post or do on social media?'],
      ['combo-exp', 'Tell me about a memorable post or interaction you had on social media.'],
    ],
  },
  {
    topic: 'phone-communication', label: '전화통화',
    parts: [
      ['combo-desc', 'Describe how you usually stay in touch with friends or family by phone.'],
      ['combo-habit', 'What do you usually talk about when you call friends or family?'],
      ['combo-exp', 'Tell me about a memorable phone conversation you had.'],
    ],
  },
  {
    topic: 'gaming', label: '게임',
    parts: [
      ['combo-desc', 'Describe the type of games you usually play.'],
      ['combo-habit', 'What is your typical routine when you play games?'],
      ['combo-exp', 'Tell me about a memorable experience you had while playing a game.'],
    ],
  },
  {
    topic: 'volunteering', label: '자원봉사',
    parts: [
      ['combo-desc', 'Describe an organization or place where you have volunteered.'],
      ['combo-habit', 'What kind of volunteer work do you usually do?'],
      ['combo-exp', 'Tell me about a memorable volunteering experience you had.'],
    ],
  },
  // Part 4-2 — 취미·관심사
  {
    topic: 'music', label: '음악',
    parts: [
      ['combo-desc', 'Describe the type of music you usually listen to.'],
      ['combo-habit', 'When and how do you usually listen to music in your daily life?'],
      ['combo-exp', 'Tell me about a time music had a strong effect on you or a memory tied to a song.'],
    ],
  },
  {
    topic: 'cooking', label: '요리',
    parts: [
      ['combo-desc', 'Describe your kitchen and the cooking equipment you usually use.'],
      ['combo-compare', 'How has your cooking skill or habit changed since you first started cooking?'],
      ['combo-exp', 'Tell me about a memorable dish you cooked, or a time cooking did not go as planned.'],
    ],
  },
  {
    topic: 'reading', label: '독서',
    parts: [
      ['combo-desc', 'Describe the type of books you usually read.'],
      ['combo-habit', 'What is your typical reading routine like?'],
      ['combo-exp', 'Tell me about a book that left a strong impression on you.'],
    ],
  },
  {
    topic: 'writing', label: '글쓰기',
    parts: [
      ['combo-desc', 'Describe where and when you usually write.'],
      ['combo-habit', 'What do you usually write about?'],
      ['combo-exp', 'Tell me about a piece of writing you are proud of or that was memorable to write.'],
    ],
  },
  {
    topic: 'drawing', label: '그림',
    parts: [
      ['combo-desc', 'Describe the kind of things you like to draw.'],
      ['combo-habit', 'What is your typical routine when you draw?'],
      ['combo-exp', 'Tell me about a drawing or piece of art you made that you are proud of.'],
    ],
  },
  {
    topic: 'photography', label: '사진',
    parts: [
      ['combo-desc', 'Describe the kind of photos you usually take.'],
      ['combo-habit', 'What do you usually do when you go out to take photos?'],
      ['combo-exp', 'Tell me about a memorable photo you took.'],
    ],
  },
  {
    topic: 'pet', label: '반려동물',
    parts: [
      ['combo-desc', 'Describe a pet you have, or a pet you would like to have.'],
      ['combo-habit', 'What does your typical routine of taking care of a pet look like?'],
      ['combo-exp', 'Tell me about a memorable experience you had with a pet.'],
    ],
  },
  // Part 4-3 — 운동
  {
    topic: 'exercise', label: '운동(일반)',
    parts: [
      ['combo-desc', 'Describe the place where you usually exercise.'],
      ['combo-habit', 'What is your typical exercise routine like during a normal week?'],
      ['combo-exp', 'Tell me about a time you tried a new type of exercise or sport for the first time.'],
    ],
  },
  {
    topic: 'jogging', label: '조깅/걷기',
    parts: [
      ['combo-desc', 'Describe the place where you usually go jogging or walking.'],
      ['combo-habit', 'What is your typical jogging or walking routine?'],
      ['combo-exp', 'Tell me about a memorable experience you had while jogging or walking.'],
    ],
  },
  {
    topic: 'gym', label: '헬스',
    parts: [
      ['combo-desc', 'Describe the gym or fitness center you usually go to.'],
      ['combo-habit', 'What is your typical workout routine at the gym?'],
      ['combo-exp', 'Tell me about a time you achieved a fitness goal or faced a challenge at the gym.'],
    ],
  },
  {
    topic: 'yoga', label: '요가',
    parts: [
      ['combo-desc', 'Describe the place where you usually practice yoga.'],
      ['combo-habit', 'What is your typical yoga routine like?'],
      ['combo-exp', 'Tell me about a memorable experience you had practicing yoga.'],
    ],
  },
  {
    topic: 'cycling', label: '자전거',
    parts: [
      ['combo-desc', 'Describe the place where you usually ride your bicycle.'],
      ['combo-habit', 'What is your typical cycling routine?'],
      ['combo-exp', 'Tell me about a memorable cycling trip or experience.'],
    ],
  },
  {
    topic: 'swimming', label: '수영',
    parts: [
      ['combo-desc', 'Describe the place where you usually go swimming.'],
      ['combo-habit', 'What is your typical swimming routine?'],
      ['combo-exp', 'Tell me about a memorable experience you had while swimming.'],
    ],
  },
  {
    topic: 'hiking', label: '하이킹',
    parts: [
      ['combo-desc', 'Describe a hiking trail or mountain you like to visit.'],
      ['combo-habit', 'What do you usually prepare before going hiking?'],
      ['combo-exp', 'Tell me about a memorable hiking experience you had.'],
    ],
  },
  {
    topic: 'health', label: '건강 관리',
    parts: [
      ['combo-desc', 'Describe what you usually do to stay healthy.'],
      ['combo-compare', 'How have your health habits changed compared to a few years ago?'],
      ['combo-exp', 'Tell me about a time you had to change a habit for your health.'],
    ],
  },
  // Part 4-4 — 휴가/출장/여행
  {
    topic: 'travel', label: '여행',
    parts: [
      ['combo-desc', 'Describe a place you have traveled to that you really enjoyed.'],
      ['combo-compare', 'How is traveling domestically different from traveling abroad, in your experience?'],
      ['combo-exp', 'Tell me about a memorable trip you took. What made it special?'],
    ],
  },
  {
    topic: 'business-trip', label: '출장',
    parts: [
      ['combo-desc', 'Describe a place you have visited for a business trip.'],
      ['combo-compare', 'How is traveling for business different from traveling for leisure, in your experience?'],
      ['combo-exp', 'Tell me about a memorable experience you had on a business trip.'],
    ],
  },
]

const COMBO_QUESTIONS: Question[] = COMBO_TOPICS.flatMap((t) => comboSet(t.topic, t.parts))

// --- 롤플레이 ---
const ROLEPLAY_QUESTIONS: Question[] = [
  { id: 'roleplay-hotel', category: 'roleplay', type: 'roleplay', difficulty: [5, 6],
    promptText: 'You have a reservation problem at a hotel. Call the front desk, explain the issue, and ask them to resolve it.' },
  { id: 'roleplay-friend', category: 'roleplay', type: 'roleplay', difficulty: [5, 6],
    promptText: 'Your friend was supposed to meet you this weekend, but something came up. Call your friend, explain the situation, and suggest an alternative plan.' },
  { id: 'roleplay-refund', category: 'roleplay', type: 'roleplay', difficulty: [5, 6],
    promptText: 'You bought a product that turned out to be defective. Go to the store, explain the problem, and ask for a refund or exchange.' },
  { id: 'roleplay-inquiry', category: 'roleplay', type: 'roleplay', difficulty: [5, 6],
    promptText: 'You need more information about a class or gym membership. Call and ask three or four questions to get the details you need.' },
  { id: 'roleplay-borrow', category: 'roleplay', type: 'roleplay', difficulty: [5, 6],
    promptText: 'You need to borrow something from a neighbor or coworker. Call them, explain what you need and why, and ask if you can borrow it.' },
  { id: 'roleplay-reschedule', category: 'roleplay', type: 'roleplay', difficulty: [5, 6],
    promptText: "You have an appointment that you need to reschedule. Call and explain the situation, then arrange a new time." },
  { id: 'roleplay-restaurant-reservation', category: 'roleplay', type: 'roleplay', difficulty: [5, 6],
    promptText: 'You made a restaurant reservation, but you need to change the time or number of people. Call the restaurant, explain the situation, and arrange a new reservation.' },
]

// --- 돌발 질문: 기본 ---
const UNEXPECTED_BASIC: Question[] = [
  { id: 'unexpected-environment', category: 'unexpected-environment', type: 'unexpected', difficulty: [3, 4, 5, 6],
    promptText: 'What are some environmental issues in your country, and how are people dealing with them?' },
  { id: 'unexpected-technology', category: 'unexpected-technology', type: 'unexpected', difficulty: [3, 4, 5, 6],
    promptText: 'How has technology changed the way people work or study in recent years?' },
  { id: 'unexpected-recycling', category: 'unexpected-recycling', type: 'unexpected', difficulty: [3, 4, 5, 6],
    promptText: 'Describe how recycling is typically done in your area.' },
  { id: 'unexpected-transportation', category: 'unexpected-transportation', type: 'unexpected', difficulty: [3, 4, 5, 6],
    promptText: 'What forms of public transportation are common where you live, and what are their pros and cons?' },
  { id: 'unexpected-weather', category: 'unexpected-weather', type: 'unexpected', difficulty: [3, 4, 5, 6],
    promptText: 'Describe the typical weather in your region across the four seasons.' },
  { id: 'unexpected-social-issue', category: 'unexpected-social-issue', type: 'unexpected', difficulty: [3, 4, 5, 6],
    promptText: 'What is a social issue that has been discussed a lot recently in your country?' },
  { id: 'unexpected-tradition', category: 'unexpected-tradition', type: 'unexpected', difficulty: [3, 4, 5, 6],
    promptText: 'How have traditional customs or holidays changed in your country over time?' },
]

// --- 돌발 질문: 고난도 (실제 시험 후반부 스타일 — 시사·의견 중심, 5~6단계 전용) ---
const UNEXPECTED_ADVANCED: Question[] = [
  { id: 'unexpected-economy', category: 'unexpected-economy', type: 'unexpected', difficulty: [5, 6],
    promptText: "How has the cost of living changed in your country recently, and how are people responding to it?" },
  { id: 'unexpected-aging-society', category: 'unexpected-aging-society', type: 'unexpected', difficulty: [5, 6],
    promptText: "Describe how an aging population is affecting your country's economy and society." },
  { id: 'unexpected-remote-work', category: 'unexpected-remote-work', type: 'unexpected', difficulty: [5, 6],
    promptText: 'How has remote work changed the relationship between employers and employees?' },
  { id: 'unexpected-education', category: 'unexpected-education', type: 'unexpected', difficulty: [5, 6],
    promptText: 'What are some recent changes in the education system in your country, and what do you think about them?' },
  { id: 'unexpected-urbanization', category: 'unexpected-urbanization', type: 'unexpected', difficulty: [5, 6],
    promptText: 'Describe how urbanization has changed cities in your country over the past decade.' },
  { id: 'unexpected-renewable-energy', category: 'unexpected-renewable-energy', type: 'unexpected', difficulty: [5, 6],
    promptText: 'What is your country doing to develop renewable energy, and what challenges remain?' },
  { id: 'unexpected-social-media-impact', category: 'unexpected-social-media-impact', type: 'unexpected', difficulty: [5, 6],
    promptText: 'How has social media changed the way people communicate and form relationships?' },
  { id: 'unexpected-generation-gap', category: 'unexpected-generation-gap', type: 'unexpected', difficulty: [5, 6],
    promptText: 'Describe a generational gap issue that exists in your country today.' },
  { id: 'unexpected-inflation', category: 'unexpected-inflation', type: 'unexpected', difficulty: [5, 6],
    promptText: "How has inflation affected people's daily lives in your country recently?" },
  { id: 'unexpected-work-life-balance', category: 'unexpected-work-life-balance', type: 'unexpected', difficulty: [5, 6],
    promptText: 'What is the attitude toward work-life balance in your country, and how has it been changing?' },
  { id: 'unexpected-housing', category: 'unexpected-housing', type: 'unexpected', difficulty: [5, 6],
    promptText: 'Describe the housing situation in your country. Is it easy or difficult for people to find affordable housing?' },
  { id: 'unexpected-immigration', category: 'unexpected-immigration', type: 'unexpected', difficulty: [5, 6],
    promptText: "What is your opinion about immigration policy discussions in your country?" },
  { id: 'unexpected-fashion-trends', category: 'unexpected-fashion-trends', type: 'unexpected', difficulty: [5, 6],
    promptText: 'How have fashion trends changed in your country in recent years?' },
  { id: 'unexpected-food-culture', category: 'unexpected-food-culture', type: 'unexpected', difficulty: [5, 6],
    promptText: 'How has dining or food culture changed in your country recently, for example because of delivery apps?' },
]

// --- 어드밴스 ---
const ADVANCE_QUESTIONS: Question[] = [
  { id: 'advance-law', category: 'advance', type: 'advance', difficulty: [5, 6],
    promptText: 'If you could change one law or policy in your country, what would it be and why?' },
  { id: 'advance-controversy', category: 'advance', type: 'advance', difficulty: [5, 6],
    promptText: 'Discuss a topic that people in your country often disagree about, and explain the different viewpoints.' },
  { id: 'advance-communication', category: 'advance', type: 'advance', difficulty: [5, 6],
    promptText: 'Describe how communication between people has changed over the last decade due to technology.' },
  { id: 'advance-economy', category: 'advance', type: 'advance', difficulty: [5, 6],
    promptText: "Discuss how economic changes such as rising prices have affected people's daily spending habits in your country." },
  { id: 'advance-ai-work', category: 'advance', type: 'advance', difficulty: [5, 6],
    promptText: 'Describe how artificial intelligence might change the way people work over the next ten years.' },
]

// --- 자기소개 ---
const INTRO_QUESTIONS: Question[] = [
  { id: 'intro-self', category: 'intro', type: 'intro', difficulty: [1, 2, 3, 4, 5, 6],
    promptText: "Let's start the interview. Tell me a little about yourself." },
]

export const QUESTIONS: Question[] = [
  ...COMBO_QUESTIONS,
  ...ROLEPLAY_QUESTIONS,
  ...UNEXPECTED_BASIC,
  ...UNEXPECTED_ADVANCED,
  ...ADVANCE_QUESTIONS,
  ...INTRO_QUESTIONS,
]

const UNEXPECTED_LABELS: Record<string, string> = {
  'unexpected-environment': '돌발 · 환경',
  'unexpected-technology': '돌발 · 기술',
  'unexpected-recycling': '돌발 · 재활용',
  'unexpected-transportation': '돌발 · 교통',
  'unexpected-weather': '돌발 · 날씨',
  'unexpected-social-issue': '돌발 · 사회이슈',
  'unexpected-economy': '돌발 · 경제',
  'unexpected-aging-society': '돌발 · 고령화',
  'unexpected-remote-work': '돌발 · 재택근무 트렌드',
  'unexpected-education': '돌발 · 교육',
  'unexpected-urbanization': '돌발 · 도시화',
  'unexpected-renewable-energy': '돌발 · 에너지',
  'unexpected-social-media-impact': '돌발 · SNS 영향',
  'unexpected-generation-gap': '돌발 · 세대차이',
  'unexpected-inflation': '돌발 · 물가',
  'unexpected-work-life-balance': '돌발 · 워라밸',
  'unexpected-housing': '돌발 · 주거',
  'unexpected-immigration': '돌발 · 이민정책',
  'unexpected-tradition': '돌발 · 전통문화',
  'unexpected-fashion-trends': '돌발 · 패션 트렌드',
  'unexpected-food-culture': '돌발 · 음식문화',
}

export const CATEGORY_LABELS: Record<string, string> = {
  ...Object.fromEntries(COMBO_TOPICS.map((t) => [t.topic, t.label])),
  roleplay: '롤플레이',
  intro: '자기소개',
  advance: '어드밴스',
  ...UNEXPECTED_LABELS,
}

export const TYPE_LABELS: Record<Question['type'], string> = {
  intro: '자기소개',
  'combo-desc': '묘사',
  'combo-habit': '습관',
  'combo-compare': '비교',
  'combo-exp': '경험',
  roleplay: '롤플레이',
  unexpected: '돌발',
  advance: '어드밴스',
}
