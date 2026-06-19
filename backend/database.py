import sqlite3


def get_db_connection():
    conn = sqlite3.connect("rivio.db")
    conn.row_factory = sqlite3.Row
    return conn
def create_tables():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT NOT NULL,
            due_date TEXT,
            category TEXT,
            completed INTEGER DEFAULT 0,

            FOREIGN KEY (user_id)
            REFERENCES users(id)
        )
    """)

    conn.commit()
    conn.close()