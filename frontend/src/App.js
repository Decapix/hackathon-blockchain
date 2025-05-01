import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import CompanyForm from './company/CompanyForm';
import StudentForm from './student/StudentForm';

// Drag & drop Excel import component (reusable)
function ExcelImport({ onFile, label }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setMessage(`Selected file: ${e.dataTransfer.files[0].name}`);
      onFile && onFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(`Selected file: ${e.target.files[0].name}`);
      onFile && onFile(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select an Excel file.");
      return;
    }
    // TODO: Send file to backend
    setMessage("Batch import sent!");
  };

  return (
    <div className="excel-import">
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
        <button type="submit" style={{ marginTop: 10 }}>Import</button>
      </form>
      {message && <div style={{ color: '#1976d2' }}>{message}</div>}
    </div>
  );
}

// Add Student manually
function AddStudentForm() {
  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    email: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send to backend
    setMessage("Student added!");
  };

  return (
    <form onSubmit={handleSubmit} className="form-fac" style={{ marginBottom: 16 }}>
      <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
      <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
      <input name="email" placeholder="Personal email" value={form.email} onChange={handleChange} required />
      <button type="submit">Add</button>
      {message && <div style={{ color: '#1976d2' }}>{message}</div>}
    </form>
  );
}

// Add Diploma manually
function AddDiplomaForm() {
  const [form, setForm] = useState({
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
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send to backend
    setMessage("Diploma added!");
  };

  return (
    <form onSubmit={handleSubmit} className="form-fac" style={{ marginBottom: 16 }}>
      <input name="email" placeholder="Student email" value={form.email} onChange={handleChange} required />
      <input name="diplomaName" placeholder="Diploma name" value={form.diplomaName} onChange={handleChange} required />
      <input name="level" placeholder="Diploma level" value={form.level} onChange={handleChange} required />
      <input name="specialty" placeholder="Specialty/Major" value={form.specialty} onChange={handleChange} required />
      <input name="graduationDate" type="date" placeholder="Graduation date" value={form.graduationDate} onChange={handleChange} required />
      <select name="status" value={form.status} onChange={handleChange} required>
        <option value="">Status</option>
        <option value="in progress">In progress</option>
        <option value="obtained">Obtained</option>
        <option value="not obtained">Not obtained</option>
      </select>
      <input name="honors" placeholder="Honors" value={form.honors} onChange={handleChange} />
      <input name="ects" placeholder="ECTS credits" value={form.ects} onChange={handleChange} />
      <textarea name="courses" placeholder="Courses list" value={form.courses} onChange={handleChange} />
      <textarea name="grades" placeholder="Grades" value={form.grades} onChange={handleChange} />
      <button type="submit">Add</button>
      {message && <div style={{ color: '#1976d2' }}>{message}</div>}
    </form>
  );
}

// University area with tabs
function UniversityForm() {
  const [tab, setTab] = useState('student');

  return (
    <div className="university-area" style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <h2>University Area</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button
          className={`main-btn${tab === 'student' ? ' active' : ''}`}
          style={{ flex: 1, background: tab === 'student' ? '#1976d2' : '#e3eafc', color: tab === 'student' ? '#fff' : '#1976d2' }}
          onClick={() => setTab('student')}
        >
          Add Student
        </button>
        <button
          className={`main-btn${tab === 'diploma' ? ' active' : ''}`}
          style={{ flex: 1, background: tab === 'diploma' ? '#1976d2' : '#e3eafc', color: tab === 'diploma' ? '#fff' : '#1976d2' }}
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

function Home() {
  return (
    <div className="home-buttons" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 24,
      marginTop: 60
    }}>
      <h1>Diplomas & Professional Experiences Platform</h1>
      <Link to="/university" style={{ textDecoration: 'none' }}>
        <button className="main-btn">University Area</button>
      </Link>
      <Link to="/company" style={{ textDecoration: 'none' }}>
        <button className="main-btn">Company Area</button>
      </Link>
      <Link to="/student" style={{ textDecoration: 'none' }}>
        <button className="main-btn">Student Area</button>
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/university" element={<UniversityForm />} />
            <Route path="/company" element={<CompanyForm />} />
            <Route path="/student" element={<StudentForm />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
