import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <main style={{minHeight:"100vh",padding:"40px",fontFamily:"system-ui",background:"#080c18",color:"#edf2ff"}}>
          <h1>RSA Explorer could not start</h1>
          <p>The application hit a startup error. See the details below.</p>
          <pre style={{whiteSpace:"pre-wrap",padding:"16px",borderRadius:"10px",background:"#101827",color:"#ffb4bf",overflow:"auto"}}>{this.state.error?.stack || String(this.state.error)}</pre>
        </main>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
