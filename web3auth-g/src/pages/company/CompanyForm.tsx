import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './CompanyForm.module.css';

// Interfaces
interface VerificationFormData {
  diplomaHash: string;
}

interface ExperienceFormData {
  studentEmail: string;
  position: string;
  startDate: string;
  endDate: string;
  contractType: string;
  hours: string;
  location: string;
  description: string;
}

interface VerificationResult {
  isVerified: boolean;
  diplomaData?: {
    studentName: string;
    universityName: string;
    diplomaName: string;
    level: string;
    graduationDate: string;
    status: string;
  };
}

// Composant pour la vérification d'un diplôme
const DiplomaVerificationForm: React.FC = () => {
  const [form, setForm] = useState<VerificationFormData>({
    diplomaHash: '',
  });
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!form.diplomaHash) return;

    setIsVerifying(true);
    setResult(null);

    // Simulation d'une vérification (dans un projet réel, ce serait un appel API)
    setTimeout(() => {
      // Exemple de réponse
      if (form.diplomaHash === '0x123456' || form.diplomaHash === '123456') {
        setResult({
          isVerified: true,
          diplomaData: {
            studentName: 'John Doe',
            universityName: 'University of Technology',
            diplomaName: 'Master of Computer Science',
            level: 'Master',
            graduationDate: '2023-05-15',
            status: 'obtained'
          }
        });
      } else {
        setResult({
          isVerified: false
        });
      }
      setIsVerifying(false);
    }, 1500);
  };

  // Style du bouton verify
  const verifyBtnStyle = {
    background: "#0097a7",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "10px 24px",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer"
  };

  return (
    <div className={styles.verificationContainer}>
      <form onSubmit={handleSubmit} className={styles.formVerification}>
        <input
          name="diplomaHash"
          placeholder="Enter diploma hash or ID"
          value={form.diplomaHash}
          onChange={handleChange}
          required
          style={{ padding: 12, fontSize: 16, marginBottom: 16 }}
        />
        <button 
          type="submit" 
          className={styles.mainBtn} 
          style={verifyBtnStyle}
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify Diploma'}
        </button>
      </form>

      {result && (
        <div className={`${styles.verificationResult} ${result.isVerified ? styles.verified : styles.notVerified}`}>
          {result.isVerified ? (
            <div className={styles.diplomaDetails}>
              <h3>✅ Verified Diploma</h3>
              <div className={styles.detailGrid}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Student:</span>
                  <span className={styles.detailValue}>{result.diplomaData?.studentName}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>University:</span>
                  <span className={styles.detailValue}>{result.diplomaData?.universityName}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Diploma:</span>
                  <span className={styles.detailValue}>{result.diplomaData?.diplomaName}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Level:</span>
                  <span className={styles.detailValue}>{result.diplomaData?.level}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Date:</span>
                  <span className={styles.detailValue}>
                    {new Date(result.diplomaData?.graduationDate || '').toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Status:</span>
                  <span className={styles.detailValue}>
                    {result.diplomaData?.status.charAt(0).toUpperCase() + result.diplomaData?.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.notVerifiedMessage}>
              <h3>❌ Diploma Not Found</h3>
              <p>The diploma hash or ID you entered could not be verified in our system.</p>
              <p>Please check the hash and try again, or contact support if you believe this is an error.</p>
            </div>
          )}
        </div>
      )}

      <div className={styles.verificationHelp}>
        <p>Enter the diploma hash provided by the student or university to verify its authenticity on the blockchain.</p>
        <p className={styles.testHint}>Try with example hash: <code>0x123456</code></p>
      </div>
    </div>
  );
};

// Composant pour ajouter une expérience professionnelle
const AddExperienceForm: React.FC = () => {
  const [form, setForm] = useState<ExperienceFormData>({
    studentEmail: '',
    position: '',
    startDate: '',
    endDate: '',
    contractType: '',
    hours: '',
    location: '',
    description: ''
  });
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // TODO: Send to backend
    setMessage("Professional experience added!");
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setForm({
        studentEmail: '',
        position: '',
        startDate: '',
        endDate: '',
        contractType: '',
        hours: '',
        location: '',
        description: ''
      });
      setMessage('');
    }, 2000);
  };

  // Style du bouton add
  const addBtnStyle = {
    background: "#0097a7",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "10px 24px",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer"
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formExperience}>
      <input 
        name="studentEmail" 
        placeholder="Student Email" 
        value={form.studentEmail} 
        onChange={handleChange} 
        required 
        style={{ marginBottom: 12, padding: 8 }}
      />
      <input 
        name="position" 
        placeholder="Position" 
        value={form.position} 
        onChange={handleChange} 
        required 
        style={{ marginBottom: 12, padding: 8 }}
      />
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="startDate" style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Start Date</label>
          <input 
            id="startDate"
            name="startDate" 
            type="date" 
            value={form.startDate} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="endDate" style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>End Date (leave empty if current)</label>
          <input 
            id="endDate"
            name="endDate" 
            type="date" 
            value={form.endDate} 
            onChange={handleChange} 
            style={{ width: '100%', padding: 8 }}
          />
        </div>
      </div>
      <input 
        name="contractType" 
        placeholder="Contract Type (e.g., Full-time, Part-time)" 
        value={form.contractType} 
        onChange={handleChange} 
        required 
        style={{ marginBottom: 12, padding: 8 }}
      />
      <input 
        name="hours" 
        placeholder="Working Hours (e.g., 40h/week)" 
        value={form.hours} 
        onChange={handleChange} 
        style={{ marginBottom: 12, padding: 8 }}
      />
      <input 
        name="location" 
        placeholder="Work Location" 
        value={form.location} 
        onChange={handleChange} 
        style={{ marginBottom: 12, padding: 8 }}
      />
      <textarea 
        name="description" 
        placeholder="Job Description and Responsibilities" 
        value={form.description} 
        onChange={handleChange} 
        style={{ marginBottom: 12, padding: 8, minHeight: 100, resize: 'vertical' }}
      />
      <button type="submit" className={styles.mainBtn} style={addBtnStyle}>Add Experience</button>
      {message && <div className={styles.successMessage}>{message}</div>}
    </form>
  );
};

// Composant principal de l'espace entreprise
function CompanyForm(): React.ReactElement {
  const [tab, setTab] = useState<'verify' | 'add'>('verify');

  // Thème forcé à "theme-ocean"
  const theme = "theme-ocean";

  // Styles pour le bouton non sélectionné
  const themeBtnInactive = {
    "theme-ocean": {
      background: "#e0f7fa",
      color: "var(--btn-active)",
      border: "2px solid #b3e5fc"
    }
  };

  return (
    <div className={styles.companyArea} style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <h2>Company Area</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button
          className={`${styles.mainBtn} ${tab === 'verify' ? styles.active : ''}`}
          style={{
            flex: 1,
            ...(tab !== 'verify'
              ? (themeBtnInactive[theme] || { background: '#e3eafc', color: '#1976d2', border: "none" })
              : {})
          }}
          onClick={() => setTab('verify')}
        >
          Verify Diploma
        </button>
        <button
          className={`${styles.mainBtn} ${tab === 'add' ? styles.active : ''}`}
          style={{
            flex: 1,
            ...(tab !== 'add'
              ? (themeBtnInactive[theme] || { background: '#e3eafc', color: '#1976d2', border: "none" })
              : {})
          }}
          onClick={() => setTab('add')}
        >
          Add Experience
        </button>
      </div>
      {tab === 'verify' && (
        <>
          <h3>Verify Student Diploma</h3>
          <DiplomaVerificationForm />
        </>
      )}
      {tab === 'add' && (
        <>
          <h3>Add Professional Experience</h3>
          <AddExperienceForm />
        </>
      )}
    </div>
  );
}

export default CompanyForm;