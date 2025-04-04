import streamlit as st
import pandas as pd
import numpy as np
import time

# Configuration de la page
st.set_page_config(page_title="Bienvenue", page_icon="🏥", layout="wide")

# Titre principal
st.title("🏥 Démo Streamlit : Simplicité & Puissance")

# Introduction
st.markdown("""
Bienvenue sur cette démonstration **interactive** de Streamlit !  
Streamlit permet de créer facilement des applications web **data-driven** avec très peu de code Python.

---

""")

# Colonne de gauche : formulaire
st.header("📝 Saisie utilisateur")
with st.form("formulaire_utilisateur"):
    nom = st.text_input("Quel est votre nom ?")
    age = st.slider("Quel âge avez-vous ?", 0, 100, 25)
    humeur = st.selectbox("Comment vous sentez-vous aujourd'hui ?", ["😊 Bien", "😐 Moyen", "😞 Fatigué"])
    submit = st.form_submit_button("Envoyer")
    if submit:
        st.success(f"Bonjour **{nom}**, {age} ans. Contente de savoir que vous vous sentez *{humeur}* !")

# Colonne de droite : affichage dynamique
st.header("📊 Données aléatoires & visualisation")
df = pd.DataFrame(
    np.random.randn(100, 3),
    columns=["Capteurs A", "Capteurs B", "Capteurs C"]
)
st.line_chart(df)

# Progress bar pour effet waouh
st.header("⏳ Chargement simulé")
progress_bar = st.progress(0)
status_text = st.empty()
for i in range(100):
    status_text.text(f"Chargement… {i+1}%")
    progress_bar.progress(i + 1)
    time.sleep(0.01)
st.success("C'est prêt ! 🎉")

# Footer
st.markdown("---")
st.markdown("Réalisé avec ❤️ par [Streamlit](https://streamlit.io)")