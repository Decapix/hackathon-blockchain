import React, { useState } from 'react';
import styles from './CompanyForm.module.css';

function CompanyForm() {
  const [form, setForm] = useState({
    position: '',
    startDate: '',
    endDate: '',
    contractType: '',
    hours: '',
    location: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send data to backend or store locally
    alert('Professional experience added!');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formCompany}>
      <h2>Add Professional Experience</h2>
      <input name="position" placeholder="Position" value={form.position} onChange={handleChange} required />
      <input name="startDate" type="date" placeholder="Start Date" value={form.startDate} onChange={handleChange} required />
      <input name="endDate" type="date" placeholder="End Date (or current)" value={form.endDate} onChange={handleChange} />
      <input name="contractType" placeholder="Contract Type" value={form.contractType} onChange={handleChange} required />
      <input name="hours" placeholder="Working Hours" value={form.hours} onChange={handleChange} />
      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
      <button type="submit" className={styles.submitBtn}>Add</button>
    </form>
  );
}

export default CompanyForm;
