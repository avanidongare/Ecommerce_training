from products import get_products
import numpy as np
import sqlite3
import os

def shopping_cart(username):
    cart={}
    products=get_products()
    while True:
        pid=int(input("Enter Product ID( Press 0 to stop):"))
        if pid==0:
            break
        qty=int(input("Enter Quantity:"))

        if pid not in [p[0] for p in products] or qty <=0:
            print("Invalid Product or quantity")
            continue
        cart[pid]=cart.get(pid,0)+qty
    total=0
    print("Shopping Cart")

    DB_PATH=os.path.join(os.path.dirname(__file__),"ecommerce.db")
    con=sqlite3.connect(DB_PATH)
    cur=con.cursor()

    for pid,qty in cart.items():
        for p in products:
            if p[0]==pid:
                name=p[1]
                price=p[2]

                amount=np.multiply(price,qty)
                total=total+amount

                print("\n Product:", name)
                print("Price:",price)
                print("Quantity, qty")
                print("Final Price:",price,"x",qty,"=",amount)

                cur.execute("""
                INSERT INTO orders VALUES(?,?,?,?)""",(username,name,qty,amount))
    con.commit()
    con.close()

    print("Total cart price:",total)
    return total