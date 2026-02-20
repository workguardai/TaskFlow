import os
import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager

# Load environment variables from .env file
load_dotenv()

class Database:
    def __init__(self):
        self.db_url = os.getenv("DATABASE_URL")
        if not self.db_url:
            # Fallback for local development if needed, but Supabase URL is expected
            self.db_url = "postgresql://postgres:postgres@localhost:5432/postgres"

    @contextmanager
    def get_cursor(self):
        conn = psycopg2.connect(self.db_url)
        try:
            # Use RealDictCursor to get results as dictionaries
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                yield cur
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

db = Database()

