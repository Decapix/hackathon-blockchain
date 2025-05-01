import React, { useState } from 'react';
import styles from './UniversityForm.module.css';

function UniversityForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    diplomaName: '',
    diplomaLevel: '',
    specialty: '',
    graduationDate: '',
    status: '',
    honors: '',
    ects: '',
    courses: '',
    grades: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send data to backend or store locally
    alert('Diploma added!');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formUniversity}>
      <h2>Add Student & Diploma</h2>
      <div className={styles.row}>
        <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
      </div>
      <input name="email" placeholder="Personal Email" value={form.email} onChange={handleChange} required />
      <input name="diplomaName" placeholder="Diploma Name" value={form.diplomaName} onChange={handleChange} required />
      <input name="diplomaLevel" placeholder="Diploma Level" value={form.diplomaLevel} onChange={handleChange} required />
      <input name="specialty" placeholder="Specialty/Major" value={form.specialty} onChange={handleChange} required />
      <input name="graduationDate" type="date" placeholder="Graduation Date" value={form.graduationDate} onChange={handleChange} required />
      <select name="status" value={form.status} onChange={handleChange} required>
        <option value="">Status</option>
        <option value="in progress">In Progress</option>
        <option value="obtained">Obtained</option>
        <option value="not obtained">Not Obtained</option>
      </select>
      <input name="honors" placeholder="Honors" value={form.honors} onChange={handleChange} />
      <input name="ects" placeholder="ECTS Credits" value={form.ects} onChange={handleChange} />
      <textarea name="courses" placeholder="Courses List" value={form.courses} onChange={handleChange} />
      <textarea name="grades" placeholder="Grades" value={form.grades} onChange={handleChange} />
      <button type="submit" className={styles.submitBtn}>Add</button>
    </form>
  );
}

export default UniversityForm;
