import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import FriendRequest

try:
    alex = User.objects.get(username='alex')
    user2 = User.objects.exclude(username='alex').first()
    
    # Try sending request
    print(f"Sending request from {alex.username} to {user2.username}")
    req, created = FriendRequest.objects.get_or_create(sender=alex, receiver=user2)
    print(f"Request created: {created}, status: {req.status}")
    
    # Try accepting
    req.status = 'accepted'
    req.save()
    print("Accepted request.")
    
    # Update followers
    user2.profile.followers.add(req.sender.profile)
    req.sender.profile.followers.add(user2.profile)
    
    print(f"{alex.username} followers: {alex.profile.followers.count()}")
    print(f"{user2.username} followers: {user2.profile.followers.count()}")
    
except Exception as e:
    import traceback
    traceback.print_exc()
