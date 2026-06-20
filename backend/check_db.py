import sqlite3

conn = sqlite3.connect("rivio.db")
cursor = conn.cursor()

print("TASKS")
for row in cursor.execute("SELECT * FROM tasks"):
    print(row)

conn.close()