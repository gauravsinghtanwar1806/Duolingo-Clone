# Build a Duolingo-Inspired Gamified Language Learning Web App

Design and implement a polished, production-quality language-learning web application inspired by the interaction patterns, information architecture, gamification, and visual energy of modern Duolingo.

Do NOT copy proprietary logos, mascot artwork, illustrations, exact text, or copyrighted assets. Create an original brand identity with a similar playful, friendly, colorful educational aesthetic.

The application should feel like a real consumer product, not a generic quiz dashboard.

---

## 1. PRODUCT CONCEPT

Create a web app called **LinguaQuest**.

LinguaQuest is a gamified language-learning platform where users:

* Follow a visual learning path
* Unlock units and skills progressively
* Complete short interactive lessons
* Earn XP
* Maintain a daily streak
* Manage hearts/lives
* Earn gems
* Complete daily goals
* Track learning progress
* View achievements
* View a leaderboard
* Manage their profile/settings

Use a default logged-in learner named:

**Alex**

Seed the application with one language:

**Spanish**

The user should immediately see a partially completed course when the application loads.

---

# 2. DESIGN DIRECTION

The visual language should be:

* Playful
* Friendly
* Highly polished
* Rounded
* Colorful
* Accessible
* Mobile-first
* Gamified
* Extremely easy to understand
* Visually close to the UX quality of Duolingo while remaining an original design

Avoid:

* Corporate dashboards
* Excessive gradients
* Dense tables
* Generic Bootstrap-looking layouts
* Tiny text
* Excessive shadows
* Overly complex navigation

Use:

* Large rounded cards
* Soft shadows
* Bold headings
* Friendly illustrations
* Large interactive buttons
* Clear progress indicators
* Bright accent colors
* Strong visual hierarchy
* Micro-interactions
* Celebration animations

---

# 3. BRAND SYSTEM

Brand:

**LinguaQuest**

Logo concept:

A simple original speech-bubble/book character icon.

Do not use the Duolingo owl.

Primary visual personality:

Friendly + energetic + educational.

Suggested color system:

* Primary green: #58CC02
* Dark green: #46A302
* Blue: #1CB0F6
* Yellow: #FFC800
* Orange: #FF9600
* Red: #FF4B4B
* Purple: #CE82FF
* Background: #F7F9FA
* Text: #202124
* Muted text: #777777
* White: #FFFFFF

Use colors semantically:

Green → success / completed

Blue → information / active

Yellow → XP / rewards

Red → hearts / mistakes

Purple → achievements

Orange → streak

---

# 4. GLOBAL APPLICATION LAYOUT

Desktop layout:

LEFT SIDEBAR

* LinguaQuest logo
* Home
* Learn
* Practice
* Leaderboard
* Achievements
* Profile
* Settings

Bottom of sidebar:

* User avatar
* Alex
* Current course: Spanish

MAIN CONTENT

Top navigation/status bar:

* Streak
* XP
* Hearts
* Gems
* Profile avatar

Example:

🔥 12     ⭐ 2,450 XP     ❤️ 4/5     💎 850

The top status bar should remain visible while navigating the learning experience.

On mobile:

Use a compact top bar and bottom navigation:

Home | Practice | Leaderboard | Profile

---

# 5. HOME / LEARNING PATH

This is the most important screen.

Create a vertically scrolling learning path.

The path should visually resemble a journey rather than a traditional dashboard.

Structure:

UNIT 1
"Basics"

Description:
"Learn your first Spanish words"

Then display circular skill nodes connected by a curved/vertical path.

Example:

```
    ● Completed
   /
  ● Completed
   \
    ● Current
   /
  🔒 Locked
   \
    🔒 Locked
```

Each skill node should contain:

* Circular icon
* Progress ring
* Skill name
* Crown/level indicator
* Completion percentage

Examples:

Greetings
Food
Family
Numbers
Animals
Travel
Daily Life

---

# 6. SKILL STATES

Every skill must visually support these states:

## Completed

* Green circular node
* Checkmark
* Full progress ring
* Slight celebration effect

## Current

* Larger node
* Bright accent
* Pulsing subtle animation
* "START" or "CONTINUE" button

## Available

* Clearly clickable
* Normal progress ring
* "START" button

## Locked

* Gray node
* Lock icon
* Disabled appearance
* Tooltip explaining what must be completed first

Example:

"Complete Greetings Level 1 to unlock this skill."

---

# 7. UNIT CARDS

Every unit should have a visually distinct header.

Example:

UNIT 1

### Foundations

Learn the basics of Spanish.

Progress:

████████░░ 80%

XP earned:

+240 XP

Button:

CONTINUE

Include a small original illustration for each unit.

---

# 8. DAILY GOAL CARD

Place a daily goal widget near the top of the home page.

Example:

Today's Goal

⭐ 20 / 30 XP

████████████░░░░

"10 XP left!"

Add a small motivational message:

"You're doing great! Keep your streak alive."

---

# 9. STREAK CARD

Create a streak card:

🔥

12 DAY STREAK

Best: 21 days

Show the seven days of the week.

Example:

M  T  W  T  F  S  S
✓  ✓  ✓  ✓  ●  ○  ○

Current day should be highlighted.

---

# 10. LESSON START MODAL

When the user clicks a skill:

Open a modal/card:

### Greetings

Level 2

You'll practice:

* Vocabulary
* Translation
* Sentence construction

Rewards:

⭐ +10–20 XP
🏆 Skill progress

Button:

START LESSON

Secondary:

PRACTICE

---

# 11. LESSON PLAYER

This is the core interaction.

Create a distraction-free lesson interface.

Top:

X / Close

Progress bar:

████████░░░░░░

Heart indicator:

❤️ 4

Main question centered vertically.

Example:

### Translate this sentence:

"Good morning"

Answer area:

[ type answer ]

or

[ Buenos ] [ días ]

Bottom:

CHECK

The CHECK button should be large and fixed near the bottom.

---

# 12. EXERCISE TYPES

Implement visually distinct exercise screens.

## TYPE 1 — MULTIPLE CHOICE

Question:

"What does 'Hola' mean?"

Options:

[ Hello ]

[ Goodbye ]

[ Thank you ]

[ Please ]

Clicking an option selects it.

Selected option gets a highlighted border.

CHECK button becomes active.

After submission:

Correct:

✓ Excellent!

Incorrect:

✕ Not quite

Show correct answer.

---

# 13. TYPE 2 — WORD BANK / TRANSLATION

Question:

"Translate:

I am a student."

Answer area:

[ I ] [ am ] [ a ] [ student ]

Word bank:

[ student ] [ a ] [ I ] [ am ]

Clicking words moves them into the answer.

Allow removal by clicking selected words.

---

# 14. TYPE 3 — MATCH PAIRS

Display two columns.

Spanish:

Hola
Gracias
Adiós
Por favor

English:

Hello
Thank you
Goodbye
Please

User clicks one item from each column.

Correct pair:

Green animation + checkmark

Incorrect pair:

Small shake animation + red feedback

---

# 15. TYPE 4 — FILL IN THE BLANK

Example:

"Yo ___ estudiante."

Options:

[ soy ]

[ eres ]

[ es ]

[ son ]

User selects an answer.

---

# 16. TYPE 5 — TYPE ANSWER

Question:

"Translate:

Good night"

Input:

[________________]

Button:

CHECK

Accept the correct seeded answer.

Show helpful feedback for incorrect answers.

---

# 17. ANSWER FEEDBACK

This is extremely important.

After every submitted answer, show a bottom feedback panel.

CORRECT:

Green feedback panel

✓ Excellent!

"That's correct."

Button:

CONTINUE →

INCORRECT:

Red feedback panel

✕ Almost!

Correct answer:

"Buenos días"

Button:

CONTINUE →

The feedback panel should animate upward smoothly.

Use subtle bounce/shake animations.

---

# 18. HEART SYSTEM

Start every lesson with:

❤️ 5/5

Wrong answer:

❤️ 4/5

Continue decreasing.

At:

❤️ 0/5

Show:

## Out of Hearts

Don't worry — you can practice to restore your hearts.

Buttons:

PRACTICE

REFILL HEARTS

EXIT LESSON

The practice button should be mocked but functional enough to restore hearts.

---

# 19. LESSON COMPLETION

After the final exercise:

Create a large celebratory screen.

Example:

🎉

## Lesson Complete!

+20 XP

🔥 Streak maintained!

Skill progress:

██████████████░░

+1 Crown

Stats:

Correct answers: 8/10

Accuracy: 80%

XP earned: +20

Buttons:

CONTINUE

PRACTICE AGAIN

Include:

* Confetti animation
* Floating XP animation
* Celebration illustration
* Progress animation

---

# 20. XP SYSTEM

XP should persist.

Example lesson:

Base XP:

+10 XP

Perfect bonus:

+5 XP

Streak bonus:

+2 XP

Total:

+17 XP

Show XP gain animation:

+17 XP

with a floating upward animation.

---

# 21. STREAK SYSTEM

Implement daily activity logic.

The UI should show:

🔥 12

When a lesson is completed:

* If user already practiced today → streak unchanged
* If user practiced yesterday → streak +1
* If user missed previous days → reset appropriately

Make the date logic easy to test.

Create mock/testable logic for:

today
yesterday
missed day

---

# 22. HEART REGENERATION

Display:

❤️ 4/5

Show:

"Next heart in 18:32"

Create a countdown UI.

When timer reaches zero:

4/5 → 5/5

Also provide mocked:

Practice to refill

button.

---

# 23. LEADERBOARD

Create a leaderboard page.

Header:

🏆 Weekly Leaderboard

Tabs:

Friends
Global

Leaderboard cards:

1. Sofia       1,240 XP
2. Alex        1,180 XP
3. Mateo       1,020 XP
4. Emma          940 XP
5. Noah          820 XP

Highlight Alex's row.

Use avatars and small rank badges.

---

# 24. PROFILE PAGE

Create:

Alex

Spanish learner

🔥 12 day streak

⭐ 2,450 total XP

🏆 8 skills completed

Statistics:

Lessons completed
Words learned
Perfect lessons
Longest streak

Create achievement cards:

🔥 7 Day Streak
⭐ XP Collector
🎯 Perfect Lesson
📚 First Skill

Locked achievements should appear faded.

---

# 25. ACHIEVEMENTS PAGE

Grid layout.

Achievement examples:

🔥 Streak Starter
Complete 3 consecutive days.

⭐ XP Hunter
Earn 500 XP.

🎯 Perfectionist
Complete a lesson without mistakes.

📚 Knowledge Seeker
Complete 5 skills.

Show:

Unlocked achievements → colorful

Locked achievements → grayscale

---

# 26. PRACTICE PAGE

Create a practice hub.

Cards:

Practice Mistakes

Review words you got wrong.

[START]

Quick Practice

A short 5-question session.

[START]

Heart Practice

Practice to restore hearts.

[START]

---

# 27. SETTINGS PAGE

Create a clean settings screen.

Sections:

Account

* Profile
* Username
* Email placeholder

Learning

* Daily goal
* Course
* Reminder settings

Preferences

* Sound
* Animations
* Dark mode

Application

* Help
* About
* Log out

Settings can be placeholders where functionality is not required.

---

# 28. TOASTS

Implement toast notifications.

Examples:

⭐ +20 XP

🔥 Streak increased!

❤️ Heart restored!

🔓 New skill unlocked!

🏆 Achievement unlocked!

Toasts should appear in the upper-right desktop and appropriately positioned on mobile.

---

# 29. ANIMATIONS

Use tasteful micro-interactions.

Required:

* Button hover
* Button press
* Skill node pulse
* Progress ring animation
* XP floating animation
* Correct answer bounce
* Incorrect answer shake
* Modal entrance
* Bottom feedback slide-up
* Confetti on lesson completion
* Skill unlock animation

Animations should be fast and playful.

Avoid excessive animation that makes the interface feel slow.

---

# 30. RESPONSIVE DESIGN

Desktop:

1440px optimized.

Tablet:

768px.

Mobile:

375px / 390px.

On mobile:

* Hide desktop sidebar
* Use bottom navigation
* Make lesson questions full-screen
* Keep CHECK button accessible
* Make skill path centered
* Use horizontally scrollable stat cards where appropriate

---

# 31. COMPONENT SYSTEM

Create reusable components.

Components should include:

* Sidebar
* MobileBottomNav
* TopStatsBar
* XPBadge
* StreakBadge
* HeartsBadge
* GemsBadge
* DailyGoalCard
* UnitHeader
* SkillNode
* SkillPath
* SkillProgressRing
* LessonHeader
* LessonProgress
* MultipleChoice
* WordBank
* MatchPairs
* FillBlank
* TypeAnswer
* AnswerFeedback
* HeartsModal
* LessonCompleteModal
* XPAnimation
* Toast
* LeaderboardCard
* AchievementCard
* ProfileStats
* SettingsSection

Do not duplicate UI code unnecessarily.

---

# 32. DATA / STATE EXPECTATIONS

Design the UI so it can connect to a REST API.

Expected entities:

User

Course

Unit

Skill

Lesson

Exercise

UserProgress

LessonAttempt

Achievement

UserAchievement

DailyActivity

LeaderboardEntry

HeartState

---

# 33. DATABASE RELATIONSHIP CONCEPT

Use this conceptual relationship:

User
↓
UserProgress
↓
Skill
↓
Unit
↓
Course

Course
↓
Unit
↓
Skill
↓
Lesson
↓
Exercise

User
↓
LessonAttempt

User
↓
DailyActivity

User
↓
UserAchievement
↓
Achievement

Keep the UI/API model clean enough that the backend can use SQLite with SQLAlchemy.

---

# 34. SEEDED COURSE CONTENT

Seed:

Course:

Spanish

Units:

1. Basics
2. Food & Drinks
3. Family
4. Everyday Life

Each unit:

3–4 skills

Each skill:

2 lessons

Each lesson:

8–10 exercises

Exercise types must be mixed.

Example:

Lesson 1:

1. Multiple choice
2. Translation
3. Fill blank
4. Match pairs
5. Type answer
6. Multiple choice
7. Word bank
8. Translation

---

# 35. INITIAL USER STATE

Seed user:

Alex

XP:

2450

Streak:

12

Hearts:

4/5

Gems:

850

Daily XP:

20/30

Completed skills:

Basics → Greetings

Basics → Introductions

Current skill:

Numbers

Locked skills:

Food
Family
Travel

This makes the application immediately interesting when opened.

---

# 36. IMPORTANT UX RULES

The user should always understand:

1. What should I do next?
2. How much progress have I made?
3. What reward will I receive?
4. What happens if I make a mistake?
5. What is currently locked?
6. How close am I to completing the lesson?

Never make the user search for the primary CTA.

Every major screen should have one obvious primary action.

---

# 37. LANDING / APP ENTRY

Do NOT create a traditional marketing landing page.

The user should enter directly into the logged-in learning experience.

Initial route:

/learn

Primary screens:

/learn
/lesson/[id]
/practice
/leaderboard
/achievements
/profile
/settings

---

# 38. VISUAL DETAILS

Use:

* Border radius: 12–20px
* Large rounded buttons
* Thick button borders where appropriate
* Soft shadows
* Strong typography hierarchy
* Generous whitespace
* Large icons
* Friendly illustrations

Buttons should feel tactile.

Primary button:

Large
Rounded
Bold
Clearly elevated

Secondary button:

Outlined
Less visually dominant

Disabled button:

Low contrast
Clearly unavailable

---

# 39. FIGMA DESIGN REQUIREMENTS

Create a complete design system first.

Figma pages:

1. Cover
2. Design System
3. Components
4. Home / Learning Path
5. Lesson Player
6. Lesson States
7. Lesson Complete
8. Practice
9. Leaderboard
10. Achievements
11. Profile
12. Settings
13. Mobile Screens

Create reusable components and variants for:

SkillNode:

* locked
* available
* current
* completed

Button:

* primary
* secondary
* disabled
* success
* danger

Exercise:

* multiple choice
* translation
* word bank
* match
* fill blank
* typing

Feedback:

* correct
* incorrect

---

# 40. ACCESSIBILITY

Ensure:

* Strong color contrast
* Keyboard navigability
* Visible focus states
* Buttons have readable labels
* Icons are not the only source of meaning
* Error feedback is understandable
* Touch targets are large enough on mobile

---

# 41. FINAL PRODUCT FEEL

The finished application should feel like:

"A polished modern language-learning game."

It should NOT feel like:

"A CRUD dashboard with quiz questions."

Prioritize:

1. Learning path experience
2. Lesson interaction
3. Feedback animations
4. Gamification
5. Visual polish
6. Progress persistence
7. Responsive behavior

The learning path and lesson player are the two most important areas.

Build the UI with realistic seeded content rather than placeholder lorem ipsum.

Make every important button and interaction functional or clearly prepared for API integration.

Use original illustrations/icons and branding while following the same high-level UX principles of a modern gamified language-learning product.
