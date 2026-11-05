import sqlite3
import os

DB_PATH=os.path.join(os.path.dirname(__file__),"ecommerce.db")
con=sqlite3.connect(DB_PATH)
cur=con.cursor()
cur.execute("""
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS products(
    id INTEGER PRIMARY KEY,
    name TEXT,
    price INTEGER
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS orders(
    username TEXT,
    product TEXT,
    quantity INTEGER,
    total INTEGER
)
""")

users=[
    (1,'user1','password@1'),
    (2,'user2','password@2'),
    (3,'user3','password@3')
]

products=[
    (1,'Laptop',146000),
    (2,'Mouse',1000),
    (3,'Keyboards',2000)
]

cur.executemany(
    "INSERT OR IGNORE INTO users VALUES(?,?,?)",users
)

cur.executemany(
    "INSERT OR IGNORE INTO products VALUES(?,?,?)",products
)

con.commit()
con.close()

print("Database created")
