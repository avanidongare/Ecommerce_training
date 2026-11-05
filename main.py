from user import login
from catalog import display_catalog
from cart import shopping_cart
from shipping import shipping
from analytics import analysis

username=login()
if username:
    print("Welcome", username)
    display_catalog()
    total=shopping_cart(username)
    shipping(total)
    print("Thank You for shopping!")

choice=input("View Sales Analytics?(Y/N):")
if choice=='Y':
    analysis()
