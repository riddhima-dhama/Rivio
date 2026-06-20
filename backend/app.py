from flask import Flask, request,jsonify
from flask_cors import CORS
from database import create_tables
from database import get_db_connection

app = Flask(__name__)
CORS(app)
create_tables()

@app.route("/")
def home():
    return {
        "message": "Rivio API Running 🚀"
    }
@app.route("/signup", methods=["POST"])
def signup():

    data = request.get_json()

    name = data["name"]
    email = data["email"]
    password = data["password"]

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO users
        (name, email, password)
        VALUES (?, ?, ?)
        """,
        (name, email, password)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Signup successful"
    }), 201
@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data["email"]
    password = data["password"]

    conn = get_db_connection()
    cursor = conn.cursor()

    user = cursor.execute(
        """
        SELECT *
        FROM users
        WHERE email = ?
        AND password = ?
        """,
        (email, password)
    ).fetchone()

    conn.close()

    if user:

        return jsonify({
            "message": "Login successful"
        })

    return jsonify({
        "message": "Invalid email or password"
    }), 401
@app.route("/tasks", methods=["GET"])
def get_tasks():

    conn = get_db_connection()
    cursor = conn.cursor()

    tasks = cursor.execute(
        """
        SELECT *
        FROM tasks
        """
    ).fetchall()

    conn.close()

    task_list = []

    for task in tasks:
        task_list.append({
            "id": task["id"],
            "user_id": task["user_id"],
            "title": task["title"],
            "due_date": task["due_date"],
            "category": task["category"],
            "completed": bool(task["completed"])
        })

    return jsonify(task_list)

@app.route("/tasks", methods=["POST"])
def add_task():

    data = request.get_json()

    user_id = data["user_id"]
    title = data["title"]
    due_date = data["due_date"]
    category = data["category"]

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO tasks
        (user_id, title, due_date, category)
        VALUES (?, ?, ?, ?)
        """,
        (
            user_id,
            title,
            due_date,
            category
        )
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Task created"
    }), 201
@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):

    data = request.get_json()

    conn = get_db_connection()
    cursor = conn.cursor()

    if "completed" in data:

        cursor.execute(
            """
            UPDATE tasks
            SET completed = ?
            WHERE id = ?
            """,
            (
                data["completed"],
                task_id
            )
        )

    if "title" in data:

        cursor.execute(
            """
            UPDATE tasks
            SET title = ?
            WHERE id = ?
            """,
            (
                data["title"],
                task_id
            )
        )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Task updated"
    })

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        DELETE FROM tasks
        WHERE id = ?
        """,
        (task_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Task deleted"
    })


if __name__ == "__main__":
    app.run(debug=True)