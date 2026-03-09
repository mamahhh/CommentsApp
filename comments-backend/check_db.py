import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.db import connection
from django.conf import settings

print("Django settings:")
print(settings.DATABASES['default'])
print()

with connection.cursor() as cursor:
    cursor.execute("""
        SELECT current_database(),
               current_user,
               inet_server_addr(),
               inet_server_port();
    """)
    print("Actual connection:")
    print(cursor.fetchone())

    cursor.execute("SHOW search_path;")
    print("Search path:")
    print(cursor.fetchone())