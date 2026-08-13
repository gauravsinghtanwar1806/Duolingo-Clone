# Database Schema Overview

The backend uses a SQLite database managed by Django's ORM. The schema is designed to separate global user statistics from specific course progress, while maintaining a flexible structure for lesson content.

## 1. User & Authentication
We use Django's built-in `User` model for authentication (username, password, email).

## 2. UserProfile
A 1-to-1 extension of the `User` model that stores gamification stats and social features.
- `user`: OneToOne relation to `User`.
- `xp`: Total XP earned by the user.
- `streak`: Current daily streak count.
- `hearts`: Current available hearts.
- `max_hearts`: Maximum hearts limit (default 5).
- `gems`: In-game currency.
- `daily_xp`: XP earned today (resets daily).
- `daily_goal`: Target XP for the day.
- `league`: Current leaderboard league (e.g., 'Bronze League').
- `unlocked_achievements`: JSON array storing achievement codes.
- `followers`: ManyToMany relation to other `UserProfile`s for social features.
- `last_heart_refill`: Timestamp tracking when the last heart was regenerated (hearts regenerate every 15 minutes).

## 3. Course Content: Unit
Represents a major section or "World" on the learning path.
- `number`: The sequential order of the unit.
- `title` & `description`: Text content for the unit header.
- `color`, `bg_color`, `border_color`: Hex codes for UI styling on the frontend.
- `emoji`: The mascot or symbol for the unit.

## 4. Course Content: Skill
Represents an individual node (like "Greetings" or "Food") inside a Unit.
- `unit`: ForeignKey linking to the parent `Unit`.
- `name` & `emoji`: Display properties for the skill node.
- `level` & `total_levels`: For tracking crown levels (default 1 to 3).
- `order`: The position of the skill within its unit.
- `lessons`: A **JSONField** that stores an array of lesson objects. Each lesson contains its specific exercises (multiple choice, translation, etc.). Storing this as JSON provides immense flexibility without needing complex relational tables for every single exercise type.

## 5. User Progress: UserSkillProgress
A relational table linking a `User` to a specific `Skill` to track their personalized completion status.
- `user`: ForeignKey to the `User`.
- `skill`: ForeignKey to the `Skill`.
- `state`: String choice (`locked`, `available`, `current`, `completed`) dictating how the node renders on the path.
- `progress`: Integer (0-100) representing lesson completion percentage for the skill.
- `xp_earned`: Total XP the user has earned exclusively from this specific skill.

## 6. Social & Gamification Events
- **UserFeedEvent**: Tracks timeline events (e.g., "Unlocked an achievement", "Earned 50 XP") to display on the user's profile feed.
- **FriendRequest**: Manages pending follow requests between users for the leaderboard.

---

### Why this design?
- **Flexibility in Exercises**: By storing the actual interactive exercises as JSON within the `Skill` model, we avoid creating 5+ different database tables for each exercise type. The frontend easily parses the JSON and renders the correct interactive component.
- **Separation of Concerns**: The course structure (`Unit` and `Skill`) is completely decoupled from player progress (`UserSkillProgress`). This means the course can be updated for everyone without wiping out individual user progress states.
