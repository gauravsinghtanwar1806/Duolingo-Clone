import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import UserProfile

LEAGUES = [
    'Bronze League', 'Silver League', 'Gold League', 
    'Sapphire League', 'Ruby League', 'Emerald League',
    'Amethyst League', 'Pearl League', 'Obsidian League', 'Diamond League'
]

NAMES = [
    'charlie', 'sam', 'alexa', 'jordan', 'taylor',
    'casey', 'riley', 'jamie', 'morgan', 'quinn',
    'skyler', 'reese', 'peyton', 'rowan', 'parker',
    'avery', 'cameron', 'logan', 'hunter', 'blake',
    'hayden', 'dakota', 'finley', 'kendall', 'sage'
]

def seed_users():
    print("Creating 25 dummy users...")
    
    # Ensure current user 'alex' is in Bronze League for testing if not already set
    # actually, alex was already created in seed.py, let's keep it as is.
    
    count = 0
    for name in NAMES:
        # If user exists, skip creation
        if not User.objects.filter(username=name).exists():
            user = User.objects.create_user(username=name, password='password123', email=f"{name}@example.com")
            
            # Randomize stats
            xp = random.randint(100, 5000)
            streak = random.randint(0, 100)
            league = random.choice(LEAGUES)
            
            UserProfile.objects.create(
                user=user,
                xp=xp,
                streak=streak,
                league=league,
                hearts=5,
                max_hearts=5,
                gems=random.randint(100, 1000)
            )
            count += 1
            
    print(f"Created {count} new users!")
    
    # Let's forcefully populate some users into the same league as 'alex' to ensure leaderboard isn't empty.
    # What league is alex? Default in model is Bronze League, but we created him with 2450 xp. Let's make sure he has some competition.
    try:
        alex = User.objects.get(username='alex')
        alex_league = alex.profile.league
        # Grab 10 random dummy users and put them in alex's league
        dummies = UserProfile.objects.exclude(user__username='alex').order_by('?')[:10]
        for dummy in dummies:
            dummy.league = alex_league
            dummy.save()
        print(f"Ensured 10 dummy users are in {alex_league} with alex.")
    except User.DoesNotExist:
        print("User 'alex' not found, skipping competition generation.")

if __name__ == '__main__':
    seed_users()
