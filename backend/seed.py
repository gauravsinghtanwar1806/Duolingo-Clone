import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import UserProfile, Unit, Skill, UserSkillProgress

def seed_data():
    print("Clearing old data...")
    User.objects.all().delete()
    Unit.objects.all().delete()

    print("Creating default user...")
    user = User.objects.create_user(username='alex', password='password123', email='alex@example.com')
    profile = UserProfile.objects.create(
        user=user,
        xp=2450,
        streak=12,
        hearts=4,
        max_hearts=5,
        gems=850,
        daily_xp=20,
        daily_goal=30
    )

    print("Loading data from seed_data.json...")
    with open('../frontend/seed_data.json', 'r', encoding='utf-8') as f:
        units_data = json.load(f)

    print("Creating units and skills...")
    for u_data in units_data:
        unit = Unit.objects.create(
            number=u_data['number'],
            title=u_data['title'],
            description=u_data['description'],
            color=u_data['color'],
            bg_color=u_data.get('bgColor', u_data.get('bg_color', '')),
            border_color=u_data.get('borderColor', u_data.get('border_color', '')),
            emoji=u_data['emoji']
        )
        
        for idx, s_data in enumerate(u_data['skills']):
            skill = Skill.objects.create(
                unit=unit,
                name=s_data['name'],
                emoji=s_data['emoji'],
                level=s_data.get('level', 1),
                order=idx,
                lessons=s_data.get('lessons', [])
            )
            
            # create progress for alex
            UserSkillProgress.objects.create(
                user=user,
                skill=skill,
                state=s_data.get('state', 'locked'),
                progress=s_data.get('progress', 0),
                xp_earned=s_data.get('xpEarned', s_data.get('xp', 0))
            )

    print("Seeding complete! User 'alex' created with password 'password123'")

if __name__ == '__main__':
    seed_data()
