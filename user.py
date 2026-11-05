import sqlite3

def login():
    username=input("Enter username:")
    password=input("Enter password:")

    con=sqlite3.connect("ecommerce.db")
    cur=con.cursor()

    cur.execute(
        "SELECT * FROM users WHERE username=? and password=?",(username,password)
    )

    user=cur.fetchone()
    con.close()

    if user:
        print("Login successful!")
        return username
    else:
        print("Invalid Login!")
        return None

