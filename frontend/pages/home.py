import streamlit as st

# Configuration de la page
st.set_page_config(page_title="Dashboard", page_icon="🔗", layout="centered")

# Custom CSS
st.markdown("""
<style>
    .stButton > button {
        background: linear-gradient(45deg, #2C3E50, #3498DB);
        color: white;
        border: none;
        border-radius: 20px;
        padding: 0.5rem 2rem;
        transition: all 0.3s;
        width: 200px;
        margin: 0.5rem;
    }
    .stButton > button:hover {
        background: linear-gradient(45deg, #3498DB, #2C3E50);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    }
    .block-chain-title {
        background: linear-gradient(45deg, #3498DB, #2ECC71);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 3em;
        font-weight: bold;
        text-align: center;
        margin-bottom: 2rem;
    }
    .dashboard-stats {
        background: rgba(44, 62, 80, 0.1);
        padding: 20px;
        border-radius: 15px;
        margin-bottom: 2rem;
    }
</style>
""", unsafe_allow_html=True)

# Vérification de la connexion
if not st.session_state.get('logged_in', False):
    st.switch_page("main.py")

# Interface principale avec style blockchain
st.markdown('<h1 class="block-chain-title">DecapiX Dashboard</h1>', unsafe_allow_html=True)

# Stats Dashboard
st.markdown('<div class="dashboard-stats">', unsafe_allow_html=True)
col1, col2, col3 = st.columns(3)

with col1:
    st.metric("Total Certifications", "42", "+3")
with col2:
    st.metric("Success Rate", "95%", "+2%")
with col3:
    st.metric("Active Users", "156", "+12")
st.markdown('</div>', unsafe_allow_html=True)

# Boutons de navigation avec style amélioré
col1, col2 = st.columns(2)

with col1:
    if st.button("🎓 Certifications"):
        st.switch_page("pages/certifications.py")

with col2:
    if st.button("📈 Pass an Exam"):
        st.write("Starting eye tracking exam...")
        st.switch_page("pages/exam.py")