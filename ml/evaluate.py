"""
ScamShield AI - Model Evaluation & Benchmark Script
Runs independent validation on held-out test scenarios and prints
a detailed evaluation report (Accuracy, Precision, Recall, F1, Confusion Matrix).
"""

import sys
import json
import pickle
from pathlib import Path
from sklearn.metrics import classification_report, confusion_matrix

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
DATA_DIR = BASE_DIR / "data"

BENCHMARK_SAMPLES = [
    {
        "text": "Dear customer, your electricity power will be disconnected tonight at 9:30 PM by electricity officer call 9876543210 immediately.",
        "expected": 1,
        "type": "Electricity Scam"
    },
    {
        "text": "SBI Alert: Dear customer your SBI NetBanking account is blocked. Update your PAN card now: http://sbi-kyc-update.xyz/login.apk",
        "expected": 1,
        "type": "Fake Bank KYC APK"
    },
    {
        "text": "Earn Rs 3000 to 5000 per day by rating hotels and liking videos on YouTube. Contact HR on Telegram @YouTubeLikeJobsIndia",
        "expected": 1,
        "type": "Part-Time Task Scam"
    },
    {
        "text": "Rs 25,000 sent to your GooglePay by mistake. Please click link to approve refund and enter UPI PIN to receive money: http://paytm-refund-approval.live",
        "expected": 1,
        "type": "UPI PIN Trap"
    },
    {
        "text": "Your A/C 4589 is credited with Rs 12,500 on 03-Oct-2026 by UPI ref 428710928371. Balance Rs 48,230. - State Bank of India",
        "expected": 0,
        "type": "Legitimate Bank Credit"
    },
    {
        "text": "Your Amazon order #402-9182371 has been dispatched and will be delivered tomorrow by 8 PM. Track at https://www.amazon.in",
        "expected": 0,
        "type": "Legitimate E-commerce"
    },
    {
        "text": "ICICI Bank: OTP for transaction of Rs 850.00 on card ending 4012 is 849201. Valid for 10 mins. Do NOT share with anyone.",
        "expected": 0,
        "type": "Legitimate OTP"
    },
    {
        "text": "Hey Rahul, let's catch up at the cafe around 5 PM today once you wrap up your meeting.",
        "expected": 0,
        "type": "Casual Ham"
    }
]

def run_evaluation():
    print("=======================================================")
    print("      SCAMSHIELD AI - ML CLASSIFIER EVALUATION         ")
    print("=======================================================")

    metrics_file = MODELS_DIR / "metrics.json"
    vec_file = MODELS_DIR / "tfidf_vectorizer.pkl"
    clf_file = MODELS_DIR / "scam_classifier.pkl"

    if not (metrics_file.exists() and vec_file.exists() and clf_file.exists()):
        print("❌ Trained model artifacts not found! Run train.py first.")
        return

    with open(metrics_file, "r") as f:
        metrics = json.load(f)

    with open(vec_file, "rb") as f:
        vectorizer = pickle.load(f)

    with open(clf_file, "rb") as f:
        classifier = pickle.load(f)

    print("\n📊 OVERALL TEST METRICS (from 80/20 stratified split):")
    print(f"  • Total Dataset Size:  {metrics['dataset_size']} samples")
    print(f"  • Test Split Size:     {metrics['test_size']} samples")
    print(f"  • Accuracy:            {metrics['accuracy'] * 100:.2f}%")
    print(f"  • Precision:           {metrics['precision'] * 100:.2f}%")
    print(f"  • Recall:              {metrics['recall'] * 100:.2f}%")
    print(f"  • F1 Score:            {metrics['f1_score'] * 100:.2f}%")
    print(f"  • ROC-AUC Score:       {metrics['roc_auc']:.4f}")

    cm = metrics["confusion_matrix"]
    print("\n🧩 CONFUSION MATRIX:")
    print(f"                 Predicted Ham   Predicted Scam")
    print(f"  Actual Ham:         {cm['true_negative']:<10}    {cm['false_positive']:<10} (FP)")
    print(f"  Actual Scam:        {cm['false_negative']:<10}    {cm['true_positive']:<10} (TP)")

    print("\n🧪 REAL-WORLD BENCHMARK STRESS TEST:")
    print("-" * 75)
    print(f"{'Category':<24} | {'Predicted':<10} | {'Expected':<10} | {'Conf':<6} | {'Result'}")
    print("-" * 75)

    all_passed = True
    for item in BENCHMARK_SAMPLES:
        vec = vectorizer.transform([item["text"]])
        pred = int(classifier.predict(vec)[0])
        prob = float(classifier.predict_proba(vec)[0][1])
        conf = prob if pred == 1 else (1 - prob)
        
        pred_label = "SCAM" if pred == 1 else "HAM"
        exp_label = "SCAM" if item["expected"] == 1 else "HAM"
        passed = (pred == item["expected"])
        if not passed:
            all_passed = False
            
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{item['type']:<24} | {pred_label:<10} | {exp_label:<10} | {conf*100:>5.1f}% | {status}")

    print("-" * 75)
    if all_passed:
        print("🎯 ALL 8 BENCHMARK CATEGORIES PASSED WITH 100% ACCURACY!")
    else:
        print("⚠️ Some benchmark tests deviated. Review classifier features.")
    print("=======================================================\n")

if __name__ == "__main__":
    run_evaluation()
