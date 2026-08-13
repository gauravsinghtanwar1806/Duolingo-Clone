from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth.models import User
from django.db.models import Q
from .models import UserProfile, Unit, Skill, UserSkillProgress, UserFeedEvent, FriendRequest
from .serializers import UserProfileSerializer, UnitSerializer, UserSerializer, UserFeedEventSerializer

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        profile.refill_hearts()
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

class CourseStateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        units = Unit.objects.all().order_by('number')
        serializer = UnitSerializer(units, many=True, context={'request': request})
        return Response(serializer.data)

class CompleteLessonView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        skill_id = request.data.get('skillId')
        xp_earned = request.data.get('xpEarned', 0)
        hearts_remaining = request.data.get('heartsRemaining')
        
        try:
            skill = Skill.objects.get(id=skill_id)
        except Skill.DoesNotExist:
            return Response({'error': 'Skill not found'}, status=status.HTTP_404_NOT_FOUND)

        # Update user profile
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.refill_hearts()
        profile.xp += xp_earned
        profile.daily_xp += xp_earned
        if profile.daily_xp > profile.daily_goal:
            profile.daily_xp = profile.daily_goal
        
        if hearts_remaining is not None:
            profile.hearts = max(0, hearts_remaining)
        profile.save()

        # Update skill progress
        progress, _ = UserSkillProgress.objects.get_or_create(user=request.user, skill=skill)
        
        if xp_earned > 0:
            # Completing a lesson immediately completes the skill
            progress.progress = 100
            progress.xp_earned += xp_earned
            progress.state = 'completed'
            progress.save()

            # Achievement evaluation
            achievements_earned = []
            if profile.xp >= 500 and 'xp-500' not in profile.unlocked_achievements:
                profile.unlocked_achievements.append('xp-500')
                achievements_earned.append('XP Hunter')
            if profile.xp >= 1000 and 'xp-1000' not in profile.unlocked_achievements:
                profile.unlocked_achievements.append('xp-1000')
                achievements_earned.append('XP Collector')
            if profile.streak >= 3 and 'streak-3' not in profile.unlocked_achievements:
                profile.unlocked_achievements.append('streak-3')
                achievements_earned.append('Streak Starter')
            if progress.state == 'completed' and 'first-skill' not in profile.unlocked_achievements:
                profile.unlocked_achievements.append('first-skill')
                achievements_earned.append('Knowledge Seeker')
            
            if achievements_earned:
                profile.save()
                for ach in achievements_earned:
                    UserFeedEvent.objects.create(
                        user=request.user,
                        type='achievement',
                        message=f"Unlocked the '{ach}' achievement!"
                    )
            
            if not achievements_earned and xp_earned >= 20: # generic event
                UserFeedEvent.objects.create(
                    user=request.user,
                    type='lesson',
                    message=f"Earned {xp_earned} XP in a lesson!"
                )

        return Response({'status': 'success'})

class UserFeedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        events = UserFeedEvent.objects.filter(user=request.user)[:10]
        serializer = UserFeedEventSerializer(events, many=True)
        return Response(serializer.data)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')

        if not username or not password:
            return Response({'error': 'Please provide username and password'}, status=status.HTTP_400_BAD_REQUEST)
            
        if len(password) < 8:
            return Response({'error': 'Password must be at least 8 characters long'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        UserProfile.objects.create(user=user)

        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_league = request.user.profile.league
        # Get top 50 users in the same league, ordered by xp
        profiles = UserProfile.objects.select_related('user').filter(league=user_league).order_by('-xp')[:50]
        
        leaderboard_data = []
        for i, profile in enumerate(profiles):
            friend_status = 'none'
            if profile.user == request.user:
                friend_status = 'self'
            else:
                is_friend = FriendRequest.objects.filter(
                    (Q(sender=request.user, receiver=profile.user) | Q(sender=profile.user, receiver=request.user)),
                    status='accepted'
                ).exists()

                if is_friend:
                    friend_status = 'friends'
                else:
                    sent_pending = FriendRequest.objects.filter(sender=request.user, receiver=profile.user, status='pending').exists()
                    if sent_pending:
                        friend_status = 'pending_sent'
                    else:
                        received_pending = FriendRequest.objects.filter(sender=profile.user, receiver=request.user, status='pending').exists()
                        if received_pending:
                            friend_status = 'pending_received'

            leaderboard_data.append({
                'id': profile.user.id,
                'rank': i + 1,
                'username': profile.user.username,
                'xp': profile.xp,
                'avatar': profile.user.username[0].upper() if profile.user.username else 'A',
                'friend_status': friend_status,
                'isInitial': True
            })

        return Response(leaderboard_data)

class SendFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        receiver_id = request.data.get('receiver_id')
        if not receiver_id:
            return Response({'error': 'receiver_id required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if receiver == request.user:
            return Response({'error': 'Cannot send friend request to yourself'}, status=status.HTTP_400_BAD_REQUEST)

        existing = FriendRequest.objects.filter(
            Q(sender=request.user, receiver=receiver) | Q(sender=receiver, receiver=request.user)
        ).first()

        if existing:
            return Response({'error': 'Request already exists or already friends'}, status=status.HTTP_400_BAD_REQUEST)

        FriendRequest.objects.create(sender=request.user, receiver=receiver, status='pending')
        return Response({'status': 'Friend request sent'})

class AcceptFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        sender_id = request.data.get('sender_id')
        if not sender_id:
            return Response({'error': 'sender_id required'}, status=status.HTTP_400_BAD_REQUEST)

        req = FriendRequest.objects.filter(sender_id=sender_id, receiver=request.user, status='pending').first()
        if not req:
            return Response({'error': 'Pending request not found'}, status=status.HTTP_404_NOT_FOUND)

        req.status = 'accepted'
        req.save()

        request.user.profile.followers.add(req.sender.profile)
        req.sender.profile.followers.add(request.user.profile)

        return Response({'status': 'Friend request accepted'})
