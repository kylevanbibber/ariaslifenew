import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import logo from '../img/globe1.png'; // Adjust the path as necessary

function CustomNavbar() {
    
    return (
        <Navbar collapseOnSelect expand="md" style={{ backgroundColor: "#00558C", boxShadow: "0px 0px 11px 2px rgba(33,37,41,0.25)" }}>
            <Container>
                <Navbar.Brand href="/">
                    <img src={logo} width="45" height="45" alt="Logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{ background: "var(--bs-secondary)" }} />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="/recruiting" style={{ color: "var(--bs-white)" }}>Recruiting</Nav.Link>
                        <Nav.Link href="/training" style={{ color: "var(--bs-white)" }}>Training</Nav.Link>
                        <Nav.Link href="/production" style={{ color: "var(--bs-white)" }}>Production</Nav.Link>
                        <Nav.Link href="/leaders" style={{ color: "var(--bs-white)" }}>Leadership</Nav.Link>
                        <NavDropdown title="Agent Sites" id="collasible-nav-dropdown" style={{ color: "var(--bs-white)" }}>
                            <NavDropdown.Item href="https://arc.ailife.com/login.aspx?ReturnUrl=%2f" target="_blank">ARC</NavDropdown.Item>
                            <NavDropdown.Item href="https://login.ailife.com/ImpactMobile/" target="_blank">Impact Mobile</NavDropdown.Item>
                            <NavDropdown.Item href="https://login.ailife.com/ImpactPortal/" target="_blank">Impact AWS</NavDropdown.Item>
                            <NavDropdown.Item href="https://icmail.globelifeinc.com/login.html" target="_blank">ICM</NavDropdown.Item>
                            <NavDropdown.Item href="https://www.ailife.com/" target="_blank">Ailife</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link href="ariaslife.com/agents/login.html" style={{ background: "var(--bs-secondary)", color: "var(--bs-white)" }}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CustomNavbar;