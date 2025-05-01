import React, { useState, useEffect } from 'react';
import styles from './StudentForm.module.css';

const ShareButton = ({ certificationId, certificateName }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleShare = (platform) => {
    // Get the share URL for the certification
    const certificateUrl = `${window.location.origin}/certificate/${certificationId}`;
    
    // Different sharing options
    switch(platform) {
      case 'email':
        window.open(`mailto:?subject=My ${certificateName} Certification&body=Check out my certification: ${certificateUrl}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=Check out my ${certificateName} certification!&url=${encodeURIComponent(certificateUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateUrl)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(certificateUrl)
          .then(() => alert('Link copied to clipboard!'))
          .catch(err => console.error('Failed to copy: ', err));
        break;
      default:
        break;
    }
    
    // Hide options after sharing
    setShowOptions(false);
  };

  const shareOptions = [
    { id: 'email', name: 'Email' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'copy', name: 'Copy Link' }
  ];

  return (
    <div className={styles.shareButtonContainer}>
      <button 
        className={styles.shareButton}
        onClick={() => setShowOptions(!showOptions)}
      >
        Share
      </button>
      
      {showOptions && (
        <div className={styles.shareOptions}>
          {shareOptions.map(option => (
            <button
              key={option.id}
              className={styles.shareOption}
              onClick={() => handleShare(option.id)}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CertificationsList = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch certifications from the API
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        
        // Replace with your actual API endpoint
        const response = await fetch('/api/certifications');
        
        if (!response.ok) {
          throw new Error('Failed to fetch certifications');
        }
        
        const data = await response.json();
        setCertifications(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        
        // For demonstration purposes, set mock data if API fails
        setCertifications([
          { id: 1, name: 'Blockchain Fundamentals', issueDate: '2023-04-15', issuer: 'Blockchain Academy' },
          { id: 2, name: 'Smart Contract Development', issueDate: '2023-06-20', issuer: 'DApp University' },
          { id: 3, name: 'Ethereum Developer Certification', issueDate: '2023-09-10', issuer: 'Ethereum Foundation' }
        ]);
      }
    };

    fetchCertifications();
  }, []);

  if (loading) {
    return <div className={styles.certificationsLoading}>Loading certifications...</div>;
  }

  if (error && certifications.length === 0) {
    return <div className={styles.certificationsError}>Error: {error}</div>;
  }

  return (
    <div className={styles.certificationsContainer}>
      <h3>My Certifications</h3>
      
      {certifications.length === 0 ? (
        <div className={styles.noCertifications}>
          <p>You don't have any certifications yet.</p>
        </div>
      ) : (
        <ul className={styles.certificationsList}>
          {certifications.map(cert => (
            <li key={cert.id} className={styles.certificationItem}>
              <div className={styles.certificationDetails}>
                <h3>{cert.name}</h3>
                <p>Issued by: {cert.issuer}</p>
                <p>Date: {new Date(cert.issueDate).toLocaleDateString()}</p>
              </div>
              <div className={styles.certificationActions}>
                <button className={styles.viewButton}>View</button>
                <ShareButton 
                  certificationId={cert.id} 
                  certificateName={cert.name} 
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const RequestCertification = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    certificationName: '',
    issuerName: '',
    comments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.certificationName || !formData.issuerName) {
      setSubmitMessage({
        type: 'error',
        text: 'Please fill in all required fields'
      });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/request-certification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit request');
      }
      
      // Success
      setSubmitMessage({
        type: 'success',
        text: 'Your certification request has been submitted successfully!'
      });
      
      // Reset form
      setFormData({
        certificationName: '',
        issuerName: '',
        comments: ''
      });
      
      // Close form after a delay
      setTimeout(() => {
        setShowForm(false);
        setSubmitMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting certification request:', err);
      setSubmitMessage({
        type: 'error',
        text: 'There was an error submitting your request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.requestCertificationContainer}>
      <button 
        className={styles.requestBtn}
        onClick={() => setShowForm(!showForm)}
      >
        Request New Certification
      </button>
      
      {showForm && (
        <div className={styles.formOverlay} onClick={() => setShowForm(false)}>
          <div className={styles.formContainer} onClick={(e) => e.stopPropagation()}>
            <h3>Request a New Certification</h3>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="certificationName">Certification Name *</label>
                <input
                  type="text"
                  id="certificationName"
                  name="certificationName"
                  value={formData.certificationName}
                  onChange={handleInputChange}
                  placeholder="e.g., Blockchain Development"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="issuerName">Issuer Name *</label>
                <input
                  type="text"
                  id="issuerName"
                  name="issuerName"
                  value={formData.issuerName}
                  onChange={handleInputChange}
                  placeholder="e.g., Blockchain Academy"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="comments">Additional Comments</label>
                <textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  placeholder="Any additional information about your request..."
                  rows={4}
                />
              </div>
              
              {submitMessage && (
                <div className={`${styles.submitMessage} ${styles[submitMessage.type]}`}>
                  {submitMessage.text}
                </div>
              )}
              
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function StudentForm() {
  const [tab, setTab] = useState('certifications');

  return (
    <div className={styles.formStudent} style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <h2>Student Area</h2>
      <div className={styles.tabButtons}>
        <button
          className={`${styles.tabButton} ${tab === 'certifications' ? styles.active : styles.inactive}`}
          onClick={() => setTab('certifications')}
        >
          My Certifications
        </button>
        <button
          className={`${styles.tabButton} ${tab === 'request' ? styles.active : styles.inactive}`}
          onClick={() => setTab('request')}
        >
          Request Certificate
        </button>
      </div>

      {tab === 'certifications' && (
        <>
          <CertificationsList />
        </>
      )}
      
      {tab === 'request' && (
        <>
          <h3>Request a New Certification</h3>
          <RequestCertification />
        </>
      )}
    </div>
  );
}

export default StudentForm;