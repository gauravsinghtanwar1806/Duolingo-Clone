from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CurrentUserView, CourseStateView, CompleteLessonView, RegisterView, UserFeedView, LeaderboardView, SendFriendRequestView, AcceptFriendRequestView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='auth_login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('user/', CurrentUserView.as_view(), name='user_profile'),
    path('user/feed/', UserFeedView.as_view(), name='user_feed'),
    path('course/', CourseStateView.as_view(), name='course_state'),
    path('lessons/complete/', CompleteLessonView.as_view(), name='complete_lesson'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('friends/request/', SendFriendRequestView.as_view(), name='send_friend_request'),
    path('friends/accept/', AcceptFriendRequestView.as_view(), name='accept_friend_request'),
]
