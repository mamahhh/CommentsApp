from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from django.db.models import F
from django.db import transaction, IntegrityError
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination

from django.core.files.storage import default_storage
from .models import Comments, Likes, CommentImage
from django.contrib.auth import get_user_model
from .serializer import CommentSerializer, LikesSerializer


User = get_user_model()
DEFAULT_USER_NAME = "admin"
class CommentsPagination(PageNumberPagination):
    page_size = 5

# Create your views here.
class CommentViewSet(ModelViewSet):
    """
    Covers:
    - getCommentsList: GET    /api/comments/?user_id=&parent_id=
    - addComment:      POST   /api/comments/
    - editComment:     PATCH  /api/comments/<id>/
    - deleteComment:   DELETE /api/comments/<id>/
    """

    queryset = (
        Comments.objects.all().order_by("-create_at").prefetch_related("related_images")
    )
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]
    pagination_class = CommentsPagination

    def get_queryset(self):
        qs = super().get_queryset()
        user_id = self.request.query_params.get("user_id")
        parent_id = self.request.query_params.get("parent_id")
        sortBy = self.request.query_params.get("sortBy")
        # sort by id, date
        if sortBy == "smallestId":
            qs = qs.order_by("id")
        elif sortBy == "biggestId":
            qs = qs.order_by("-id")
        elif sortBy == "latest":
            qs = qs.order_by("-create_at")
        elif sortBy == "oldest":
            qs = qs.order_by("create_at")
        

        if user_id:
            qs = qs.filter(user_id=user_id)

        if parent_id is not None:
            if parent_id == "" or str(parent_id).lower() == "null":
                qs = qs.filter(parent__isnull=True)
            else:
                qs = qs.filter(parent_id=parent_id)

        return qs

    @transaction.atomic
    def perform_create(self, serializer):
        default_user, _ = User.objects.get_or_create(username=DEFAULT_USER_NAME)
        comment = serializer.save(user=default_user)

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        comment = Comments.objects.select_for_update().get(pk=kwargs["pk"])
        comment.related_images.all().delete()
        comment.text = ""
        comment.is_deleted = True
        comment.save(update_fields=["text", "is_deleted", "update_at"])
        return Response(status=204)

    @transaction.atomic
    @action(detail=True, methods=["POST"])
    def toggle_likes(self, request, pk=None):
        default_user, _ = User.objects.get_or_create(username=DEFAULT_USER_NAME)
        comment = Comments.objects.get(id=pk)
        # comment = self.get_object()
        like_qs = Likes.objects.filter(user=default_user, comment=comment)
        if like_qs.exists():
            deleted_cnt, _ = like_qs.delete()
            Comments.objects.filter(pk=comment.pk).update(likes_cnt=F("likes_cnt") - 1)
            liked = False
        else:
            Likes.objects.create(user=default_user, comment=comment)
            Comments.objects.filter(pk=comment.pk).update(likes_cnt=F("likes_cnt") + 1)
            liked = True
        comment.refresh_from_db(fields=["likes_cnt"])
        return Response({"liked": liked, "likes_cnt": comment.likes_cnt})


class LikesViewSet(ModelViewSet):
    """
    Covers:
    - getUserLikesComments: GET    /api/likes
    """

    queryset = Likes.objects.all()
    serializer_class = LikesSerializer

    def get_queryset(self):
        # Only return the current user's likes
        default_user, _ = User.objects.get_or_create(username=DEFAULT_USER_NAME)
        qs = super().get_queryset().filter(user=default_user)
        return qs


class UploadImagesView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        print(request)
        files = request.FILES.getlist("files")
        if not files:
            return Response(
                {"detail": "No files uploaded"}, status=status.HTTP_400_BAD_REQUEST
            )

        uploaded = []
        for f in files:
            saved_path = default_storage.save(f"comments/{f.name}", f)
            file_url = request.build_absolute_uri(default_storage.url(saved_path))
            uploaded.append(
                {
                    "name": f.name,
                    "path": saved_path,  # e.g. comments/xxx.png
                    "url": file_url,  # e.g. http://127.0.0.1:8000/static/comments/xxx.png
                    "size": f.size,
                    "content_type": getattr(f, "content_type", None),
                }
            )

        return Response({"files": uploaded}, status=status.HTTP_201_CREATED)
