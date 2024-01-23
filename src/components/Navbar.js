import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import logo from '../img/globe1.png'; // Adjust the path as necessary

function CustomNavbar() {
    return (
        <Navbar collapseOnSelect expand="md" style={{ backgroundColor: "#00558C", boxShadow: "0px 0px 11px 2px rgba(33,37,41,0.25)" }}>
            <Container>
                <Navbar.Brand href="index.html">
                    <img src={logo} width="45" height="45" alt="Logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{ background: "var(--bs-secondary)" }} />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="about.html" style={{ color: "var(--bs-white)" }}>Recruiting</Nav.Link>
                        <Nav.Link href="careers.html" style={{ color: "var(--bs-white)" }}>Training</Nav.Link>
                        <Nav.Link href="locations.html" style={{ color: "var(--bs-white)" }}>Production</Nav.Link>
                        <Nav.Link href="products.html" style={{ color: "var(--bs-white)" }}>Leadership Development</Nav.Link>
                        <NavDropdown title="Agent Sites" id="collasible-nav-dropdown" style={{ color: "var(--bs-tertiary-bg)" }}>
                            <NavDropdown.Item href="https://arc.ailife.com/login.aspx?ReturnUrl=%2f" target="_blank">ARC</NavDropdown.Item>
                            <NavDropdown.Item href="https://login.ailife.com/ImpactMobile/" target="_blank">Impact Mobile</NavDropdown.Item>
                            <NavDropdown.Item href="https://login.ailife.com/ImpactPortal/" target="_blank">Impact AWS</NavDropdown.Item>
                            <NavDropdown.Item href="https://icmail.globelifeinc.com/login.html" target="_blank">ICM</NavDropdown.Item>
                            <NavDropdown.Item href="https://www.ailife.com/" target="_blank">Ailife</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link href="admin_login.html" style={{ background: "var(--bs-secondary)", color: "var(--bs-white)" }}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CustomNavbar;