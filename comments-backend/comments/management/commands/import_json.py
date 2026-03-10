# import JSON data
from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from django.utils import timezone, dateparse
from comments.models import Comments, CommentImage
from django.db import connection
import json

User = get_user_model()


def reset_pg_sequence(model_cls):
    table = model_cls._meta.db_table
    pk_col = model_cls._meta.pk.column
    with connection.cursor() as cursor:
        cursor.execute(
            f"""
                SELECT setval(
                    pg_get_serial_sequence(%s, %s),
                    COALESCE((SELECT MAX({pk_col}) FROM {table}), 0),
                    true
                );
            """,
            [table, pk_col],
        )


class Command(BaseCommand):
    help = "Import JSON data and insert into database"

    def add_arguments(self, parser):
        parser.add_argument("json_path", type=str)

    @transaction.atomic
    def handle(self, *arg, **options):
        json_path = options["json_path"]
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        usernameSet = set()

        def insert_and_get_user(username):
            if username in usernameSet:
                return User.objects.get(username=username)
            user, _ = User.objects.get_or_create(username=username)
            usernameSet.add(username)
            return user

        commentsList = data["comments"]
        for comment in commentsList:
            cid = int(comment["id"])
            author = str(comment["author"].strip())
            text = str(comment.get("text", ""))
            date_str = comment.get("date")
            likes_cnt = comment.get("likes", 0)
            image = comment.get("image", "")
            parent = comment.get("parent", "")
            if len(parent) == 0:
                parent = None
            remote_urls = []
            if isinstance(image, str):
                remote_urls = [image.strip()] if len(image.strip()) else []
            elif isinstance(image, list):
                remote_urls = [
                    url.strip() for url in image if isinstance(url, str) and url.strip()
                ]

            if len(date_str) == 0:
                date = timezone.now()
            else:
                date = dateparse.parse_datetime(date_str)

            user = insert_and_get_user(author)

            comment_obj, _ = Comments.objects.update_or_create(
                id=cid,
                defaults={
                    "user": user,
                    "text": text,
                    "create_at": date,
                    "update_at": date,
                    "likes_cnt": likes_cnt,
                    "parent": parent,
                },
            )
            # clear the legacy data
            CommentImage.objects.filter(comment=comment_obj).delete()
            objs = [
                CommentImage(comment=comment_obj, remote_url=f, order=i)
                for i, f in enumerate(remote_urls)
            ]

            CommentImage.objects.bulk_create(objs)
        # set comment pk to max id
        reset_pg_sequence(Comments)

        self.stdout.write(
            self.style.SUCCESS(
                f"Imported {len(commentsList)} comments and {len(usernameSet)} users."
            )
        )
