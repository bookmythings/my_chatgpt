document.getElementById('calculate').addEventListener('click', function () {
    const amount = parseFloat(document.getElementById('amount').value);
    const interest = parseFloat(document.getElementById('interest').value);
    const years = parseFloat(document.getElementById('years').value);

    if (isNaN(amount) || isNaN(interest) || isNaN(years) || amount <= 0 || interest < 0 || years <= 0) {
        alert('Please enter valid values');
        return;
    }

    const monthlyRate = interest / 100 / 12;
    const n = years * 12;
    const monthly = amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -n));
    const total = monthly * n;
    const totalInterest = total - amount;

    document.getElementById('monthly').textContent = monthly.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
    document.getElementById('interest-total').textContent = totalInterest.toFixed(2);
    document.getElementById('results').hidden = false;
});
