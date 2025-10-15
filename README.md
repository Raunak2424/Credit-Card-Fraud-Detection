# Credit-Card-Fraud-Detection

🧩 4. Example of What Model Might Learn (Simplified Intuition)
Transaction Pattern	Example Behavior	Likely Outcome
Amount very high compared to user’s history	User rarely spends ₹10,000+, but suddenly does	Possible fraud
Sudden burst of 5+ transactions in 2 minutes	Normal users rarely do that	Possible fraud
Location changed drastically (Delhi → London) within 10 mins	Impossible physically	Likely fraud
Merchant unusual for the user	e.g., user never bought electronics before	Possible fraud
Common spending pattern	Same city, similar amount	Legitimate

(Note: In the Kaggle dataset, location & merchant details aren’t available, but banks use them in production.)
