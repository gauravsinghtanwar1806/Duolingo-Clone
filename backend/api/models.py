from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    xp = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    hearts = models.IntegerField(default=5)
    max_hearts = models.IntegerField(default=5)
    gems = models.IntegerField(default=500)
    daily_xp = models.IntegerField(default=0)
    daily_goal = models.IntegerField(default=50)
    
    joined_date = models.DateField(auto_now_add=True)
    league = models.CharField(max_length=50, default='Bronze League')
    top_3_finishes = models.IntegerField(default=0)
    unlocked_achievements = models.JSONField(default=list)
    followers = models.ManyToManyField("self", symmetrical=False, related_name='following_users', blank=True)
    last_heart_refill = models.DateTimeField(auto_now_add=True)
    last_active_date = models.DateField(null=True, blank=True)

    def refill_hearts(self):
        from django.utils import timezone
        import math
        
        if self.hearts >= self.max_hearts:
            self.last_heart_refill = timezone.now()
            self.save(update_fields=['last_heart_refill'])
            return
            
        now = timezone.now()
        delta = now - self.last_heart_refill
        minutes_passed = delta.total_seconds() / 60
        
        if minutes_passed >= 15:
            hearts_to_add = math.floor(minutes_passed / 15)
            self.hearts = min(self.max_hearts, self.hearts + hearts_to_add)
            
            # Keep the remainder time for the next heart
            remainder_minutes = minutes_passed % 15
            self.last_heart_refill = now - timezone.timedelta(minutes=remainder_minutes)
            self.save(update_fields=['hearts', 'last_heart_refill'])

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Unit(models.Model):
    number = models.IntegerField(unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    color = models.CharField(max_length=50)
    bg_color = models.CharField(max_length=50)
    border_color = models.CharField(max_length=50)
    emoji = models.CharField(max_length=10)

    class Meta:
        ordering = ['number']

    def __str__(self):
        return f"Unit {self.number}: {self.title}"

class Skill(models.Model):
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=255)
    emoji = models.CharField(max_length=10)
    level = models.IntegerField(default=1)
    total_levels = models.IntegerField(default=3)
    order = models.IntegerField(default=0)
    lessons = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ['unit__number', 'order']

    def __str__(self):
        return f"{self.name} (Unit {self.unit.number})"

class UserSkillProgress(models.Model):
    STATUS_CHOICES = (
        ('locked', 'Locked'),
        ('available', 'Available'),
        ('current', 'Current'),
        ('completed', 'Completed'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skill_progress')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='user_progress')
    state = models.CharField(max_length=20, choices=STATUS_CHOICES, default='locked')
    progress = models.IntegerField(default=0)
    xp_earned = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'skill')

    def __str__(self):
        return f"{self.user.username} - {self.skill.name} - {self.state}"

class UserFeedEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feed_events')
    type = models.CharField(max_length=50) # e.g. 'promotion', 'streak', 'achievement'
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username}: {self.message}"

class FriendRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_friend_requests')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_friend_requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('sender', 'receiver')
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username} ({self.status})"
