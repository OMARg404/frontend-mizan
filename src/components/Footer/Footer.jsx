import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './Footer.css'; // Custom footer styles

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="container">
                {/* Footer Content */}
                <div className="row">
                    <div className="col-md-6">
                        <p className="mb-0">© 2024 MIZAN. All Rights Reserved.</p>
                    </div>
                </div>

                {/* Additional Links or Contact Information */}
                <div className="row mt-3">
                    <div className="col-md-12">
                        <p className="mb-0">
                            <a href="" className="text-white me-3">Privacy Policy</a>
                            <a href="" className="text-white">Terms of Service</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
