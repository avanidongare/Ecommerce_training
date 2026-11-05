def shipping(total):
    if total >=5000:
        charge=0
    else:
        charge=100
    final_price= total +charge

    print("\n Shipping details")
    print("Cart Price:", total)
    print("Shipping Charge:",charge)
    print("Final Price:",final_price)