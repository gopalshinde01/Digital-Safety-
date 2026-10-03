"""
ScamShield AI - Model Training Pipeline
Trains a calibrated TF-IDF + Logistic Regression classifier on augmented SMS/WhatsApp
dataset covering both classical spam and modern high-impact Indian cybercrime threats.
"""

import os
import json
import random
import pickle
from pathlib import Path
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score

# Seed for reproducibility
random.seed(42)
np.random.seed(42)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"

DATA_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)

# Curated high-impact templates for modern cybercrime vectors
SCAM_TEMPLATES = [
    # 1. Electricity Bill Disconnection Scams
    "Dear Consumer your electricity power will be disconnected tonight at {time} PM from electricity office because your previous month bill was not updated. Please immediately contact our electricity officer at {phone} to avoid disconnection.",
    "URGENT: Mahavitaran/BSES alert! Electricity connection No. {acc_num} will be terminated at {time} due to unpaid arrears. Contact power officer immediately on WhatsApp/Call {phone} or pay via {url}",
    "Electricity department notice: Dear user, bill update pending for meter {acc_num}. Power supply cut scheduled for today {time}. Clear immediately call {phone}",

    # 2. Fake Bank KYC / PAN Card Update APK
    "Dear {bank} customer, your NetBanking account has been blocked due to incomplete KYC. Please click here {url} to update your PAN Card immediately within 24 hours.",
    "SBI Alert: Dear customer your SBI YONO account has been suspended today. Download SBI NetBanking Update APK from {url} to restore service.",
    "HDFC Bank Notice: Dear user your savings account {acc_num} KYC document has expired. Update Aadhaar and PAN immediately at {url} to avoid total account freeze.",
    "ICICI Bank: Important alert! Your credit card reward points worth Rs {amount} are expiring today. Redeem cash directly to your bank account by installing {url}",
    "Your Axis Bank account is temporarily deactivated for security reasons. Verify your mobile number and identity by downloading our secure verification app {url}",

    # 3. Fraudulent UPI Refund / Payment Request
    "Received Rs {amount} on Google Pay by mistake. Kindly refund to my UPI ID immediately or click here to approve reversal: {url}",
    "PhonePe Cashback Alert! You have won a scratch card reward of Rs {amount}. Click here to accept cashback into your bank: {url} (Enter UPI PIN to receive money).",
    "Paytm merchant alert: You received a payment of Rs {amount}. Please enter your 6-digit UPI PIN on the link {url} to credit funds to your wallet.",
    "Payment of Rs {amount} from {name} is waiting for your confirmation. Open link {url} and enter your PIN to claim instant payment.",

    # 4. Work-From-Home / Part-Time Telegram Job Scam
    "Part-time online job opportunity! Earn Rs 2500 to Rs 8000 daily from home just by rating hotels on Google Maps and liking YouTube videos. No investment needed. Contact manager on Telegram: {telegram}",
    "Earn daily income of Rs {amount} working 30 minutes a day! Genuine work from home project for students and housewives. Join our VIP investment channel on Telegram: {telegram}",
    "Amazon hiring part-time review assistants! Salary Rs 1500 to 4500 per day deposited instantly via UPI. Apply now on WhatsApp {phone} or Telegram {telegram}",
    "Part time job vacancy: Like YouTube videos and earn Rs 50 per like. Payout daily. Message HR on WhatsApp {phone}",

    # 5. FedEx / Customs / Digital Arrest / Law Enforcement Extortion
    "FedEx Alert: Parcel tracking no. {acc_num} dispatched in your name to Taiwan has been seized by Mumbai Customs. The consignment contains 5 passports and 150g MDMA narcotics. Contact NCB Officer on Skype/WhatsApp {phone} immediately.",
    "Delhi Police Crime Branch: An arrest warrant has been issued against your Aadhaar card for money laundering case. Do not leave your house. Join urgent video verification call on {phone}.",
    "Customs Department: Consignment containing foreign currency and undeclared jewelry held at IGI Airport Delhi. Pay penalty of Rs {amount} immediately to clear criminal charges.",

    # 6. Lottery / KBC WhatsApp Lucky Draw
    "Congratulations! Your mobile number has won Rs 25,00,000 (Twenty Five Lakhs) in KBC Kaun Banega Crorepati WhatsApp Lucky Draw 2026. Contact KBC Manager Rana Pratap Singh on WhatsApp {phone} with lottery code {acc_num}.",
    "Dear winner! You have been selected for Jio 5G Special Cash Prize of Rs 10 Lakhs. Claim your winning certificate immediately by paying registration fee Rs 1,499 via link {url}",

    # 7. Pre-approved Instant Loan & APK Blackmail
    "Instant Loan approved! Rs {amount} credited directly to your bank account without CIBIL score or collateral. Download InstantPaisa APK now: {url}",
    "Urgent loan approval: Your fast cash loan application of Rs {amount} has been sanctioned. Disbursal in 5 minutes, download mobile application at {url}",

    # 8. International Crypto / Ponzi Schemes
    "Guaranteed 300% profit in 24 hours! Automated AI crypto trading bot made $5,400 for members today. Deposit minimum $50 to begin: {url}",
    "Exclusive VIP Bitcoin investment opportunity. Guaranteed daily return of 15% with zero risk. Withdrawal anytime. Sign up now at {url}",

    # 9. Sextortion & Video Call Blackmail Threats
    "We have recorded your private webcam video and browsing history. Send Rs {amount} in Bitcoin to wallet {acc_num} within 12 hours or this video will be broadcasted to all your family and Facebook friends.",

    # 10. Urgent Account Compromise / Password Resets
    "Your Netflix subscription has expired. Payment failed for renewed plan. Update your credit card details immediately at {url} to prevent account cancellation.",
    "Apple ID Security Alert: Your iCloud account has been logged in from an unauthorized device in Russia. Verify your credentials immediately: {url}"
]

HAM_TEMPLATES = [
    # 1. Legitimate Banking Alerts & Transactions
    "Dear Customer, your A/C {acc_num} is credited with Rs {amount} on {date} by UPI ref {ref}. Balance Rs {balance}. - State Bank of India",
    "Alert: Rs {amount} debited from HDFC Bank A/C ending {acc_num} on {date} towards POS transaction. Info: Not you? Call 18002586161.",
    "ICICI Bank: OTP for transaction of Rs {amount} on card ending {acc_num} is {otp}. Do not share this OTP with anyone, including bank staff.",
    "Axis Bank Alert: Dear customer, your monthly e-statement for account {acc_num} for the month of September is generated and sent to registered email.",
    "Your Kotak Bank netbanking password has been changed successfully on {date}. If not done by you, please call our 24x7 customer care immediately.",

    # 2. Legitimate E-Commerce & Deliveries
    "Your Amazon order #{acc_num} has been dispatched and will be delivered by tomorrow. Track your package: https://www.amazon.in/gp/your-account/order-history",
    "Swiggy delivery update: Your food order from {name} Kitchen is on the way! Delivery partner Manoj is arriving in 15 mins.",
    "Zomato: Great news! Your order from Domino's Pizza has been accepted and is being prepared with hygiene protocols.",
    "Flipkart: Your package containing Electronics has been delivered today. Thank you for shopping with us. Please rate your delivery experience.",
    "BlueDart Express: Waybill {acc_num} is out for delivery. Our courier executive will reach your address today.",

    # 3. Legitimate Transport, Travel & Government Services
    "IRCTC: PNR {acc_num}, Train 12952, Date {date}, Class 3A, Status: B4-42 (CNF). Wish you a pleasant journey.",
    "MakeMyTrip: Your flight booking 6E-2415 from DEL to BOM on {date} is confirmed. Web check-in opens 48 hours prior to departure.",
    "Uber: Your trip with driver Ramesh has ended. Total fare: Rs {amount}. Receipt sent to your email.",
    "CoWIN: Dear {name}, your 2nd dose of vaccination has been successfully verified on {date}. Download certificate from cowin.gov.in.",

    # 4. Legitimate Telecom & Utility Service Notifications
    "Dear Airtel customer, your daily high-speed 1.5GB data quota is 50% exhausted. Recharge data pack via Airtel Thanks App or airtel.in.",
    "Jio Notice: Your prepaid plan with unlimited 5G data will expire in 3 days on {date}. Recharge now on jio.com to enjoy non-stop services.",
    "Adani Electricity: Thank you for payment of Rs {amount} received towards Consumer No. {acc_num} on {date}. Transaction successful.",

    # 5. Casual, Personal, and Business Messages
    "Hey {name}, are we still meeting for lunch at 1 PM today? Let me know once you reach the metro station.",
    "Hi team, please find the quarterly performance slides attached for today's review meeting at 4 PM.",
    "Mom called, she said to bring some fresh vegetables on your way back from the office.",
    "Can you please review the pull request on GitHub when you have a moment? All unit tests are passing.",
    "Happy Birthday {name}! Wishing you a wonderful year ahead filled with happiness and great health.",
    "Let me know if you received the files I emailed earlier. Looking forward to our discussion tomorrow.",
    "The doctor appointment has been rescheduled to Friday 11:30 AM. Please arrive 10 minutes early."
]

def generate_augmented_dataset(target_count=3000):
    banks = ["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Canara Bank", "Bank of Baroda", "Kotak Mahindra"]
    times = ["8:30", "9:30", "10:00", "11:15", "12:00"]
    names = ["Rahul", "Priya", "Amit", "Sneha", "Rohan", "Anjali", "Vikram", "Pooja", "Arjun", "Kavita"]
    dates = ["03-Oct-2026", "04-Oct-2026", "28-Sep-2026", "15-Aug-2026"]
    
    scam_domains = [
        "http://sbi-kyc-update.xyz/login.apk",
        "https://hdfc-netbanking-verify.top/pan",
        "http://bit.ly/sbi-pan-link",
        "https://tinyurl.com/power-bill-help",
        "http://paytm-refund-approval.live/upi",
        "http://192.168.1.105/bank/apk/install.apk",
        "http://electricity-officer-helpdesk.buzz/pay",
        "https://icici-rewards-cash.site/claim",
        "http://axis-verify-security.online/auth",
        "https://telegram.me/earn_daily_3000",
        "http://kbc-lucky-winner-2026.tk/prize"
    ]
    
    telegrams = ["@EarnDailyRs5000", "@YouTubeLikeJobsIndia", "@VIPCryptoSignals_2026", "@QuickCashHelper", "@RatingTaskDirect"]
    
    data = []
    
    # Generate Scams
    scam_count = target_count // 2
    for _ in range(scam_count):
        template = random.choice(SCAM_TEMPLATES)
        text = template.format(
            bank=random.choice(banks),
            time=random.choice(times),
            phone=f"+91 {random.randint(7000000000, 9999999999)}",
            acc_num=str(random.randint(1000000, 9999999)),
            amount=f"{random.randint(500, 75000):,}",
            name=random.choice(names),
            url=random.choice(scam_domains),
            telegram=random.choice(telegrams),
            date=random.choice(dates)
        )
        data.append({"text": text, "label": 1})
        
    # Generate Ham
    ham_count = target_count // 2
    for _ in range(ham_count):
        template = random.choice(HAM_TEMPLATES)
        text = template.format(
            bank=random.choice(banks),
            time=random.choice(times),
            phone=f"+91 {random.randint(7000000000, 9999999999)}",
            acc_num=str(random.randint(1000, 9999)),
            amount=f"{random.randint(100, 15000):,}",
            balance=f"{random.randint(5000, 250000):,}",
            name=random.choice(names),
            date=random.choice(dates),
            otp=str(random.randint(100000, 999999)),
            ref=str(random.randint(100000000000, 999999999999))
        )
        data.append({"text": text, "label": 0})
        
    random.shuffle(data)
    return data

def train_and_export():
    print(">>> 1. Generating augmented dataset (Ham & Scam)...")
    dataset = generate_augmented_dataset(target_count=3200)
    
    # Save CSV
    csv_path = DATA_DIR / "sms_scam_dataset.csv"
    with open(csv_path, "w", encoding="utf-8") as f:
        f.write("text,label\n")
        for row in dataset:
            # Escape quotes in CSV
            escaped_text = row["text"].replace('"', '""')
            f.write(f'"{escaped_text}",{row["label"]}\n')
    print(f"    Saved {len(dataset)} samples to {csv_path}")

    texts = [row["text"] for row in dataset]
    labels = [row["label"] for row in dataset]

    print(">>> 2. Splitting train/test data (80/20)...")
    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, random_state=42, stratify=labels
    )

    print(">>> 3. Fitting TF-IDF Vectorizer...")
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        sublinear_tf=True,
        min_df=2,
        max_features=5000,
        token_pattern=r"(?u)\b\w+\b"
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    print(">>> 4. Training Logistic Regression Classifier...")
    classifier = LogisticRegression(C=2.0, max_iter=1000, solver="lbfgs", random_state=42)
    classifier.fit(X_train_vec, y_train)

    print(">>> 5. Evaluating performance on test split...")
    y_pred = classifier.predict(X_test_vec)
    y_prob = classifier.predict_proba(X_test_vec)[:, 1]

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred))
    rec = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    roc_auc = float(roc_auc_score(y_test, y_prob))
    cm = confusion_matrix(y_test, y_pred).tolist()

    metrics = {
        "dataset_size": len(dataset),
        "test_size": len(y_test),
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(roc_auc, 4),
        "confusion_matrix": {
            "true_negative": cm[0][0],
            "false_positive": cm[0][1],
            "false_negative": cm[1][0],
            "true_positive": cm[1][1]
        },
        "classes": ["Ham (Legitimate)", "Scam / Phishing"]
    }

    print("\n--- MODEL PERFORMANCE METRICS ---")
    print(f"Accuracy:  {metrics['accuracy'] * 100:.2f}%")
    print(f"Precision: {metrics['precision'] * 100:.2f}%")
    print(f"Recall:    {metrics['recall'] * 100:.2f}%")
    print(f"F1-Score:  {metrics['f1_score'] * 100:.2f}%")
    print(f"ROC-AUC:   {metrics['roc_auc']:.4f}")
    print(f"Confusion Matrix: TN={cm[0][0]}, FP={cm[0][1]}, FN={cm[1][0]}, TP={cm[1][1]}")

    print("\n>>> 6. Serializing artifacts...")
    with open(MODELS_DIR / "tfidf_vectorizer.pkl", "wb") as f:
        pickle.dump(vectorizer, f)
    with open(MODELS_DIR / "scam_classifier.pkl", "wb") as f:
        pickle.dump(classifier, f)
    with open(MODELS_DIR / "metrics.json", "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    print(f"    Exported vectorizer -> {MODELS_DIR / 'tfidf_vectorizer.pkl'}")
    print(f"    Exported classifier -> {MODELS_DIR / 'scam_classifier.pkl'}")
    print(f"    Exported metrics.json -> {MODELS_DIR / 'metrics.json'}")
    print("Done!")

if __name__ == "__main__":
    train_and_export()
