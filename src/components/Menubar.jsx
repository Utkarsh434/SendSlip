import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { SignedIn, SignedOut, useClerk, UserButton } from "@clerk/clerk-react";
import { useContext } from "react";
import { AppContext, initialInvoiceData } from "../context/AppContext";

const Menubar = () => {
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const {invoiceData,setInvoiceData,setSelectedTemplate,setInvoiceTitle} =  useContext(AppContext);

  const openLogin = () => {
    openSignIn({});
  };
  const handdleGenerateClick=()=>{
    setInvoiceTitle("New Invoice");
    setSelectedTemplate("template1");
    setInvoiceData(initialInvoiceData)

    navigate("/generate");
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container py-2">
          <Link className="navbar-brand d-flex align-item-center" to="/">
            <Logo></Logo>
            <span
              className="fw-bolder fs-4 mx-3"
              style={{ letterSpacing: "-0.5px", color: "#0D6EFDB2" }}
            >
              SendSlip
            </span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ui className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link className="nav-link fw-medium" to="/">
                  Home
                </Link>
              </li>
              <SignedIn>
                <li className="nav-item">
                  <Link className="nav-link fw-medium" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link fw-medium" onClick={handdleGenerateClick}>Generate</button>
                </li>
                <UserButton/>
              </SignedIn>
              <SignedOut>
                <li className="nav-item">
                  <button
                    className="btn btn-primary rounded-pill px-4"
                    onClick={openLogin}
                  >
                    Login/Signup
                  </button>
                </li>
              </SignedOut>
            </ui>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Menubar;
