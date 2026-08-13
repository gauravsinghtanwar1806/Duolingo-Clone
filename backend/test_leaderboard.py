import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.test import RequestFactory
from django.contrib.auth.models import User
from api.views import LeaderboardView

alex = User.objects.get(username='alex')
factory = RequestFactory()
request = factory.get('/api/leaderboard/')
request.user = alex

view = LeaderboardView.as_view()
response = view(request)
for item in response.data:
    if item['username'] == 'charlie':
        print(f"Charlie friend status: {item['friend_status']}")
