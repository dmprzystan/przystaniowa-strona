import * as React from "react";

interface EmailTemplateProps {
  name: string;
  surname: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  name,
  surname,
  email,
  message,
}) => (
  <div style={styles.container}>
    <header style={styles.header}>
      <h1 style={styles.headerTitle}>Powiadomienie o nowej wiadomości</h1>
      <p style={styles.headerSubtitle}>
        Otrzymałeś nową wiadomość ze strony przystani.
      </p>
    </header>
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>Dane nadawcy</h2>
      <p style={styles.detail}>
        <strong>Imię:</strong> {name}
      </p>
      <p style={styles.detail}>
        <strong>Nazwisko:</strong> {surname}
      </p>
      <p style={styles.detail}>
        <strong>Email:</strong> {email}
      </p>
    </section>
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>Wiadomość</h2>
      <div style={styles.messageContainer}>
        <p style={styles.message}>{message}</p>
      </div>
    </section>
  </div>
);

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
    color: "#444",
    backgroundColor: "#fff",
    maxWidth: "600px",
    margin: "20px auto",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    border: "1px solid #eaeaea",
  },
  header: {
    borderBottom: "1px solid #eee",
    marginBottom: "20px",
    paddingBottom: "10px",
  },
  headerTitle: {
    fontSize: "24px",
    margin: "0",
    color: "#4F5D75", // Primary color
  },
  headerSubtitle: {
    fontSize: "14px",
    color: "#888",
    margin: "5px 0 0",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "18px",
    color: "#4F5D75", // Primary color
    margin: "0 0 10px",
  },
  detail: {
    fontSize: "16px",
    margin: "5px 0",
  },
  messageContainer: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  message: {
    whiteSpace: "pre-wrap",
    fontSize: "16px",
    color: "#333",
  },
  footer: {
    borderTop: "1px solid #eee",
    marginTop: "20px",
    paddingTop: "10px",
  },
  footerText: {
    fontSize: "14px",
    color: "#888",
    textAlign: "center",
  },
};
