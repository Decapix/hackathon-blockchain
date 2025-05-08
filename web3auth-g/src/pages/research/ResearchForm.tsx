import React, { useState, FormEvent, ChangeEvent } from 'react';
import styles from './ResearchForm.module.css';

// Interface pour les statistiques
interface Statistics {
  newCertificationsToday: number;
  totalCertifications: number;
  partners: string[];
}

// Composant principal de recherche
const ResearchForm: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<'diploma' | 'email'>('diploma');
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Statistiques fictives
  const statistics: Statistics = {
    newCertificationsToday: 127,
    totalCertifications: 24689,
    partners: ['Binance', 'Tezos', 'Ethereum Foundation', 'ConsenSys']
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    setErrorMessage(null);
  };

  const handleSearchTypeChange = (type: 'diploma' | 'email'): void => {
    setSearchType(type);
    setErrorMessage(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setErrorMessage('Veuillez saisir un terme de recherche');
      return;
    }
    
    setIsSearching(true);
    setSearchResults(null);
    
    // Simulation d'une recherche
    setTimeout(() => {
      if (searchType === 'diploma') {
        // Recherche de diplômes (simulée)
        if (searchQuery.toLowerCase().includes('blockchain')) {
          setSearchResults([
            { id: 1, name: 'Blockchain Fundamentals', institution: 'Blockchain Academy', issueDate: '2023-08-15' },
            { id: 2, name: 'Advanced Blockchain Development', institution: 'DApp University', issueDate: '2023-09-22' }
          ]);
        } else {
          setSearchResults([]);
        }
      } else {
        // Recherche par email (simulée)
        if (searchQuery.includes('@')) {
          setSearchResults([
            { id: 3, name: 'Ethereum Developer', email: searchQuery, issueDate: '2023-07-10' }
          ]);
        } else {
          setSearchResults([]);
        }
      }
      
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className={styles.researchContainer}>
      <div className={styles.header}>
        <h1>Vérification de Certifications</h1>
        <p className={styles.subtitle}>
          Vérifiez l'authenticité d'un diplôme ou trouvez toutes les certifications liées à une adresse email
        </p>
      </div>
      
      <div className={styles.statsContainer}>
        <div className={styles.statsCard}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{statistics.newCertificationsToday}</span>
            <span className={styles.statLabel}>nouvelles certifications aujourd'hui</span>
          </div>
          
          <div className={styles.statItem}>
            <span className={styles.statValue}>{statistics.totalCertifications.toLocaleString()}</span>
            <span className={styles.statLabel}>certifications au total</span>
          </div>
          
          <div className={styles.partnersSection}>
            <span className={styles.partnersLabel}>Nos partenaires :</span>
            <div className={styles.partnersList}>
              {statistics.partners.map((partner, index) => (
                <span key={index} className={styles.partner}>
                  {partner}{index < statistics.partners.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.searchSection}>
        <h2>Recherchez un diplôme ou une adresse e-mail</h2>
        
        <div className={styles.searchTypeToggle}>
          <button 
            className={`${styles.toggleButton} ${searchType === 'diploma' ? styles.active : ''}`}
            onClick={() => handleSearchTypeChange('diploma')}
          >
            Diplôme
          </button>
          <button 
            className={`${styles.toggleButton} ${searchType === 'email' ? styles.active : ''}`}
            onClick={() => handleSearchTypeChange('email')}
          >
            Email
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <div className={styles.searchInputContainer}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={searchType === 'diploma' 
                ? "Entrez le nom ou l'ID du diplôme..." 
                : "Entrez une adresse email..."}
              className={styles.searchInput}
            />
            <button 
              type="submit" 
              className={styles.searchButton}
              disabled={isSearching}
            >
              {isSearching ? 'Recherche...' : 'Rechercher'}
            </button>
          </div>
          
          {errorMessage && (
            <div className={styles.errorMessage}>
              {errorMessage}
            </div>
          )}
        </form>
      </div>
      
      {searchResults && (
        <div className={styles.resultsSection}>
          <h3>Résultats de recherche</h3>
          
          {searchResults.length === 0 ? (
            <div className={styles.noResults}>
              <p>Aucun résultat trouvé pour "{searchQuery}"</p>
              <p>Vérifiez l'orthographe ou essayez un autre terme de recherche.</p>
            </div>
          ) : (
            <ul className={styles.resultsList}>
              {searchResults.map(result => (
                <li key={result.id} className={styles.resultItem}>
                  <div className={styles.resultDetails}>
                    <h4>{result.name}</h4>
                    {result.institution && <p>Institution: {result.institution}</p>}
                    {result.email && <p>Email: {result.email}</p>}
                    <p>Date d'émission: {new Date(result.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div className={styles.resultActions}>
                    <button className={styles.viewButton}>Voir détails</button>
                    <button className={styles.verifyButton}>Vérifier</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      <div className={styles.infoSection}>
        <h3>Comment ça marche</h3>
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>1</div>
            <h4>Recherchez</h4>
            <p>Entrez un nom de diplôme ou une adresse email</p>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>2</div>
            <h4>Vérifiez</h4>
            <p>Consultez les détails du certificat et sa validité</p>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>3</div>
            <h4>Validez</h4>
            <p>Confirmez l'authenticité grâce à la blockchain</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchForm;