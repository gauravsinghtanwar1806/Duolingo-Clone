from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Unit, Skill, UserSkillProgress, UserFeedEvent

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    rank = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ('id', 'username', 'xp', 'streak', 'hearts', 'max_hearts', 'gems', 'daily_xp', 'daily_goal', 'joined_date', 'league', 'top_3_finishes', 'unlocked_achievements', 'followers_count', 'following_count', 'last_heart_refill', 'rank')

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following_users.count()

    def get_rank(self, obj):
        return UserProfile.objects.filter(league=obj.league, xp__gt=obj.xp).count() + 1

class SkillSerializer(serializers.ModelSerializer):
    state = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    xpEarned = serializers.SerializerMethodField()

    class Meta:
        model = Skill
        fields = ('id', 'name', 'emoji', 'level', 'total_levels', 'order', 'lessons', 'state', 'progress', 'xpEarned')

    def get_state(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            progress = obj.user_progress.filter(user=request.user).first()
            if progress:
                return progress.state
        return 'locked'

    def get_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            progress = obj.user_progress.filter(user=request.user).first()
            if progress:
                return progress.progress
        return 0

    def get_xpEarned(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            progress = obj.user_progress.filter(user=request.user).first()
            if progress:
                return progress.xp_earned
        return 0

class UnitSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()
    totalXP = serializers.SerializerMethodField()
    bgColor = serializers.CharField(source='bg_color')
    borderColor = serializers.CharField(source='border_color')

    class Meta:
        model = Unit
        fields = ('id', 'number', 'title', 'description', 'color', 'bgColor', 'borderColor', 'emoji', 'skills', 'totalXP')

    def get_skills(self, obj):
        skills = obj.skills.all()
        return SkillSerializer(skills, many=True, context=self.context).data

    def get_totalXP(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # sum up xp_earned for all skills in this unit for the user
            return sum(
                p.xp_earned for skill in obj.skills.all() 
                for p in skill.user_progress.filter(user=request.user)
            )
        return 0

class UserFeedEventSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserFeedEvent
        fields = ('id', 'username', 'type', 'message', 'timestamp')
