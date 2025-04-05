import requests
import json
import time

# URL du backend
# Le backend est mappé sur le port 8502 à l'extérieur mais écoute sur le port 8000 à l'intérieur
BACKEND_URL = "http://localhost:8502"

# Essayons les deux ports pour être sûr
def try_both_ports(func):
    def wrapper(*args, **kwargs):
        global BACKEND_URL
        # D'abord essayer avec le port 8502
        result = func(*args, **kwargs)
        if result is None:
            # Si ça échoue, essayer avec le port 8000
            print("⚠️ Tentative avec le port 8000...")
            original_url = BACKEND_URL
            BACKEND_URL = "http://localhost:8000"
            result = func(*args, **kwargs)
            BACKEND_URL = original_url
        return result
    return wrapper

@try_both_ports
def test_start_exam():
    """Tester la route de démarrage d'examen"""
    print("\n=== Test de la route /exam/start ===")
    
    payload = {
        "email": "test@example.com",
        "exam_id": 1,
        "exam_name": "Certification Blockchain Security"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/exam/start", json=payload)
        
        if response.status_code == 200:
            print("✅ Succès! Session d'examen créée:")
            result = response.json()
            print(json.dumps(result, indent=2))
            return result
        else:
            print(f"❌ Erreur: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return None

@try_both_ports
def test_submit_results(email="test@example.com", exam_id=1):
    """Tester la route de soumission des résultats d'examen"""
    print("\n=== Test de la route /exam/results ===")
    
    # Simuler des résultats d'examen
    payload = {
        "email": email,
        "exam_id": exam_id,
        "score": 85,
        "cheat_score": 0.15,
        "passed": True,
        "details": {
            "correct_answers": "17/20",
            "time_spent": "10 minutes",
            "monitoring_events": 2
        }
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/exam/results", json=payload)
        
        if response.status_code == 200:
            print("✅ Succès! Résultats d'examen enregistrés:")
            result = response.json()
            print(json.dumps(result, indent=2))
            return result
        else:
            print(f"❌ Erreur: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return None

@try_both_ports
def test_get_results(email="test@example.com", exam_id=1):
    """Tester la route pour récupérer les résultats d'examen"""
    print("\n=== Test de la route /exam/results/{email} ===")
    
    try:
        response = requests.get(f"{BACKEND_URL}/exam/results/{email}?exam_id={exam_id}")
        
        if response.status_code == 200:
            print("✅ Succès! Résultats récupérés:")
            result = response.json()
            print(json.dumps(result, indent=2))
            return result
        else:
            print(f"❌ Erreur: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return None

@try_both_ports
def test_home_endpoint():
    """Tester l'endpoint de base pour vérifier que le backend fonctionne"""
    print("\n=== Test de la route / (home) ===")
    
    try:
        response = requests.get(f"{BACKEND_URL}/")
        
        if response.status_code == 200:
            print("✅ Backend accessible!")
            print(response.json())
            return True
        else:
            print(f"❌ Erreur: {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return False

def run_full_flow():
    """Exécuter le flux complet de test"""
    print("\n🔄 Démarrage du flux complet de test...")
    
    # 0. Vérifier que le backend est accessible
    if not test_home_endpoint():
        print("❌ Le backend ne semble pas accessible. Vérifiez qu'il est en cours d'exécution.")
        return
    
    # 1. Démarrer une session d'examen
    session = test_start_exam()
    if not session:
        print("❌ Impossible de continuer le test sans session d'examen")
        return
    
    # 2. Soumettre des résultats d'examen
    results = test_submit_results(session["email"], session["exam_id"])
    if not results:
        print("❌ Échec lors de la soumission des résultats")
    
    # 3. Récupérer les résultats
    get_results = test_get_results(session["email"], session["exam_id"])
    if not get_results:
        print("❌ Échec lors de la récupération des résultats")
    
    print("\n✅ Test complet terminé!")

if __name__ == "__main__":
    # Tester les routes individuellement
    # test_start_exam()
    # test_submit_results()
    # test_get_results()
    
    # Ou exécuter le flux complet
    run_full_flow()