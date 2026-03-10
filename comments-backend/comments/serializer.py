from rest_framework import serializers
from rest_framework.exceptions import NotFound
from django.contrib.auth import get_user_model
from .models import Comments, Likes, CommentImage
from django.db import transaction

User = get_user_model()


class CommentImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = CommentImage
        fields = ["id", "url", "order"]

    # obj is the model
    def get_url(self, obj):
        request = self.context.get("request")
        if obj.image_path:
            u = obj.image_path.url
            return request.build_absolute_uri(u) if request else u

        return obj.remote_url


class FilesPathSerializer(serializers.Serializer):
    keep_image_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        default=list,
    )
    image_paths = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
    )


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="user.username", read_only=True)
    related_images = CommentImageSerializer(many=True, read_only=True)
    medias = FilesPathSerializer(write_only=True, required=False)

    class Meta:
        model = Comments
        fields = [
            "id",
            "parent",
            "user",
            "author",
            "text",
            "likes_cnt",
            "related_images",
            "create_at",
            "update_at",
            "medias",
            "is_deleted"
        ]
        read_only_fields = [
            "user",
            "author",
            "create_at",
            "update_at",
            "related_images",
            "is_deleted"
        ]

    def create(self, validated_data):
        medias = validated_data.pop("medias", {})
        image_paths = medias.get("image_paths", [])
        with transaction.atomic():
            comment = Comments.objects.create(**validated_data)

            if image_paths:
                objs = [
                    CommentImage(comment=comment, image_path=p, order=i)
                    for i, p in enumerate(image_paths)
                ]
                CommentImage.objects.bulk_create(objs)

            return comment

    def update(self, instance, validated_data):
        medias = validated_data.pop("medias", {})
        keep_ids = set(medias.get("keep_image_ids", []))
        new_paths = medias.get("image_paths", [])
        with transaction.atomic():
            try:
                locked = Comments.objects.select_for_update().get(pk=instance.pk)
            except Comments.DoesNotExist:
                raise NotFound("Comment no longer exists")
            for k, v in validated_data.items():
                setattr(locked, k, v)
            locked.save()
            qs = CommentImage.objects.filter(comment=locked)
            if keep_ids:
                qs.exclude(id__in=keep_ids).delete()
            else:
                qs.delete()

            if new_paths:
                existing_count = CommentImage.objects.filter(comment=locked).count()
                objs = [
                    CommentImage(comment=locked, image_path=p, order=existing_count + i)
                    for i, p in enumerate(new_paths)
                ]
                CommentImage.objects.bulk_create(objs)

            return locked


class LikesSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Likes
        fields = ["user", "author", "comment", "create_at"]
        read_only_fields = ["user", "author", "create_at"]
