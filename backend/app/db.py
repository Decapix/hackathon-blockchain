from tinydb import TinyDB, Query

# Initialisez la base de données
db = TinyDB('db.json')
User = Query()

# Préparation des tables pour les examens
exam_sessions_table = db.table('exam_sessions')
exam_results_table = db.table('exam_results')

# Queries
Session = Query()
Result = Query()
