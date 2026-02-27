from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommentViewSet, LikesViewSet, UploadImagesView

router = DefaultRouter()
router.register(r"comments", CommentViewSet, basename="comments")
router.register(r"likes", LikesViewSet, basename="likes")

urlpatterns = [
    path("", include(router.urls)),
    path("uploads/", UploadImagesView.as_view(), name="upload-images"),
]