function convertToINR(price){    
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(price);
    return formattedPrice;
}

export { convertToINR };