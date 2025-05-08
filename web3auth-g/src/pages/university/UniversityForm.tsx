import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './UniversityForm.module.css';

// Interface pour le formulaire d'ajout d'étudiant
interface StudentFormData {
  lastName: string;
  firstName: string;
  email: string;
}

// Interface pour le formulaire d'ajout de diplôme
interface DiplomaFormData {
  email: string;
  diplomaName: string;
  level: string;
  specialty: string;
  graduationDate: string;
  status: string;
  honors: string;
  ects: string;
  courses: string;
  grades: string;
}

// Composant pour le drag & drop d'import Excel
interface ExcelImportProps {
  onFile?: (file: File) => void;
  label: string;
}

const ExcelImport: React.FC<ExcelImportProps> = ({ onFile, label }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleDrag = (e: React.DragEvent<HTMLFormElement | HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setMessage(`Selected file: ${e.dataTransfer.files[0].name}`);
      onFile && onFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(`Selected file: ${e.target.files[0].name}`);
      onFile && onFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select an Excel file.");
      return;
    }
    // TODO: Send file to backend
    setMessage("Batch import sent!");
  };

  // Style du bouton import
  const importBtnStyle = {
    background: "#0097a7",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "10px 24px",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 10
  };

  return (
    <div className={styles.excelImport}>
      <form
        onDragEnter={handleDrag}
        onSubmit={handleUpload}
        style={{
          border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
          padding: 20,
          borderRadius: 8,
          background: dragActive ? '#f0f8ff' : '#fafafa',
          textAlign: 'center',
          marginBottom: 16
        }}
      >
        <input
          type="file"
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
          id={`excel-upload-${label}`}
          onChange={handleFileChange}
        />
        <label htmlFor={`excel-upload-${label}`} style={{ cursor: 'pointer', color: '#1976d2' }}>
          {file ? file.name : `Drag & drop an Excel file here or click to select`}
        </label>
        <div
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          style={{ height: 60 }}
        />
        <button type="submit" className={styles.mainBtn} style={importBtnStyle}>Import</button>
      </form>
      {message && <div style={{ color: '#1976d2' }}>{message}</div>}
    </div>
  );
};

// Composant pour ajouter un étudiant manuellement
const AddStudentForm: React.FC = () => {
  const [form, setForm] = useState<StudentFormData>({
    lastName: '',
    firstName: '',
    email: '',
  });
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => 
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // TODO: Send to backend
    setMessage("Student added!");
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
    <form onSubmit={handleSubmit} className={styles.formFac} style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 12 }}>
        <input
          name="lastName"
          placeholder="Last name"
          value={form.lastName}
          onChange={handleChange}
          required
          style={{ marginRight: 12, padding: 8, flex: 1 }}
        />
        <input
          name="firstName"
          placeholder="First name"
          value={form.firstName}
          onChange={handleChange}
          required
          style={{ padding: 8, flex: 1 }}
        />
      </div>
      <input
        name="email"
        placeholder="Personal email"
        value={form.email}
        onChange={handleChange}
        required
        style={{ marginBottom: 12, padding: 8 }}
      />
      <button type="submit" className={styles.mainBtn} style={addBtnStyle}>Add</button>
      {message && <div style={{ color: '#1976d2' }}>{message}</div>}
    </form>
  );
};

// Composant pour ajouter un diplôme manuellement
const AddDiplomaForm: React.FC = () => {
  const [form, setForm] = useState<DiplomaFormData>({
    email: '',
    diplomaName: '',
    level: '',
    specialty: '',
    graduationDate: '',
    status: '',
    honors: '',
    ects: '',
    courses: '',
    grades: '',
  });
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => 
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // TODO: Send to backend
    setMessage("Diploma added!");
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
    <form onSubmit={handleSubmit} className={styles.formFac} style={{ marginBottom: 16 }}>
      <input 
        name="email" 
        placeholder="Student email" 
        value={form.email} 
        onChange={handleChange} 
        required 
        style={{ marginBottom: 12, padding: 8 }} 
      />
      <input 
        name="diplomaName" 
        placeholder="Diploma name" 
        value={form.diplomaName} 
        onChange={handleChange} 
        required 
        style={{ marginBottom: 12, padding: 8 }} 
      />
      <input 
        name="level" 
        placeholder="Diploma level" 
        value={form.level} 
        onChange={handleChange} 
        required 
        style={{ marginBottom: 12, padding: 8 }} 
      />
      <input 
        name="specialty" 
        placeholder="Specialty/Major" 
        value={form.specialty} 
        onChange={handleChange} 
        required 
        style={{ marginBottom: 12, padding: 8 }} 
      />
      <input 
        name="graduationDate" 
        type="date" 
        placeholder="Graduation date" 
        value={form.graduationDate} 
        onChange={handleChange} 
        required 
        style={{ marginBottom: 12, padding: 8 }} 
      />
      <select 
        name="status" 
        value={form.status} 
        onChange={handleChange} 
        required 
        style={{ marginBottom: 12, padding: 8 }}
      >
        <option value="">Status</option>
        <option value="in progress">In progress</option>
        <option value="obtained">Obtained</option>
        <option value="not obtained">Not obtained</option>
      </select>
      <input 
        name="honors" 
        placeholder="Honors" 
        value={form.honors} 
        onChange={handleChange} 
        style={{ marginBottom: 12, padding: 8 }} 
      />
      <input 
        name="ects" 
        placeholder="ECTS credits" 
        value={form.ects} 
        onChange={handleChange} 
        style={{ marginBottom: 12, padding: 8 }} 
      />
      <textarea 
        name="courses" 
        placeholder="Courses list" 
        value={form.courses} 
        onChange={handleChange} 
        style={{ marginBottom: 12, padding: 8 }} 
      />
      <textarea 
        name="grades" 
        placeholder="Grades" 
        value={form.grades} 
        onChange={handleChange} 
        style={{ marginBottom: 12, padding: 8 }} 
      />
      <button type="submit" className={styles.mainBtn} style={addBtnStyle}>Add</button>
      {message && <div style={{ color: '#1976d2' }}>{message}</div>}
    </form>
  );
};

// Composant principal pour l'espace université
function UniversityForm(): React.ReactElement {
  const [tab, setTab] = useState<'student' | 'diploma'>('student');

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
    <div className={styles.universityArea} style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <h2>University Area</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button
          className={`${styles.mainBtn} ${tab === 'student' ? styles.active : ''}`}
          style={{
            flex: 1,
            ...(tab !== 'student'
              ? (themeBtnInactive[theme] || { background: '#e3eafc', color: '#1976d2', border: "none" })
              : {})
          }}
          onClick={() => setTab('student')}
        >
          Add Student
        </button>
        <button
          className={`${styles.mainBtn} ${tab === 'diploma' ? styles.active : ''}`}
          style={{
            flex: 1,
            ...(tab !== 'diploma'
              ? (themeBtnInactive[theme] || { background: '#e3eafc', color: '#1976d2', border: "none" })
              : {})
          }}
          onClick={() => setTab('diploma')}
        >
          Add Diploma
        </button>
      </div>
      {tab === 'student' && (
        <>
          <h3>Add a student manually</h3>
          <AddStudentForm />
          <h3>Batch import students (Excel)</h3>
          <ExcelImport label="student" />
        </>
      )}
      {tab === 'diploma' && (
        <>
          <h3>Add a diploma manually</h3>
          <AddDiplomaForm />
          <h3>Batch import diplomas (Excel)</h3>
          <ExcelImport label="diploma" />
        </>
      )}
    </div>
  );
}

export default UniversityForm;