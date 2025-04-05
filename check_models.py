"""
Script pour vérifier si les modèles et les routes sont correctement définis
"""
try:
    from backend.app.models import ExamRequest, ExamResultRequest
    print("✅ Import des modèles réussi!")
    
    # Créer une instance de test
    test_exam_request = ExamRequest(
        email="test@example.com",
        exam_id=1,
        exam_name="Test Exam"
    )
    print("✅ Création d'une instance de ExamRequest réussie!")
    print(f"Test ExamRequest: {test_exam_request}")
    
    test_result_request = ExamResultRequest(
        email="test@example.com",
        exam_id=1,
        score=85,
        cheat_score=0.1,
        passed=True
    )
    print("✅ Création d'une instance de ExamResultRequest réussie!")
    print(f"Test ExamResultRequest: {test_result_request}")
    
except ImportError as e:
    print(f"❌ Erreur d'importation: {e}")
except Exception as e:
    print(f"❌ Erreur lors de la création des instances: {e}")

# Essayer d'importer les routes
try:
    from backend.app.routes import router
    print("\n✅ Import du router réussi!")
    
    # Vérifier les routes définies
    routes = [f"{route.path} [{route.methods}]" for route in router.routes]
    print(f"Routes définies ({len(routes)}):")
    for route in routes:
        print(f"  - {route}")
    
    # Vérifier spécifiquement les nouvelles routes
    exam_routes = [route for route in routes if "exam" in route.lower()]
    if exam_routes:
        print("\n✅ Routes d'examen trouvées:")
        for route in exam_routes:
            print(f"  - {route}")
    else:
        print("\n❌ Aucune route d'examen trouvée!")
        
except ImportError as e:
    print(f"\n❌ Erreur d'importation du router: {e}")
except Exception as e:
    print(f"\n❌ Erreur lors de la vérification des routes: {e}")