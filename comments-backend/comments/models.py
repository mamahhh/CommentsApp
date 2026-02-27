from django.db import models
from django.conf import settings
from django.utils import timezone

# Create your models here.
# Use Django Users table
class Comments(models.Model):
    # id = models.CharField(max_length=30, primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    # When the parent comment is deleted, set parent comment id as Null.
    parent = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, related_name="replies")
    text = models.TextField()
    create_at = models.DateTimeField(default=timezone.now)
    update_at = models.DateTimeField(default=timezone.now)
    likes_cnt = models.BigIntegerField(default=0)
    image_url = models.URLField(max_length=500, default='')

class Likes(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments_likes")
    comment = models.ForeignKey(Comments, on_delete=models.CASCADE, related_name="like")
    create_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "comment"], name="unique_like")
        ]

class CommentImage(models.Model):
    comment = models.ForeignKey(Comments, on_delete=models.CASCADE, related_name="related_images")
    remote_url = models.URLField(max_length=500, null=True)
    image_path = models.ImageField(upload_to="comments/", null=True)
    create_at = models.DateTimeField(default=timezone.now)
    order = models.PositiveIntegerField(default=0)

    
