from flask import Flask, request, send_file
from flask_cors import CORS
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import io

app = Flask(__name__)
CORS(app)

@app.route('/process-csv', methods=['POST'])
def process_csv():
    # Read uploaded file directly from memory
    file = request.files['file']
    df = pd.read_csv(file)

    # Clean data
    df_cleaned = df.dropna()

    # Model training
    X = df_cleaned.drop('Class', axis=1)
    y = df_cleaned['Class']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred))

    # Filter non-fraud data
    df_nonfraud = df_cleaned[df_cleaned['Class'] == 0]

    # Send nonfraudulent_transactions.csv as attachment
    output = io.BytesIO()
    df_nonfraud.to_csv(output, index=False)
    output.seek(0)
    return send_file(
        output,
        mimetype='text/csv',
        as_attachment=True,
        download_name='nonfraudulent_transactions.csv'
    )

if __name__ == '__main__':
    app.run(debug=True)
