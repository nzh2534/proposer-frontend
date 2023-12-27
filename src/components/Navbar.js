import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";

function CollapsibleNavbar({ count }) {
  const username = localStorage.getItem("username");

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      style={{ width: "100%", padding: "0px", height: "8vh" }}
    >
      <Container className="ms-0 w-auto">
        <Navbar.Brand href="/">
          <img
            src="/logo.png"
            width="120"
            height="60"
            className="rounded"
            alt="Proposer Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/proposals">
              Proposals{" "}
              {count?.length > 0 ? (
                <Badge bg="secondary">{count.length}</Badge>
              ) : null}
            </Nav.Link>
            <Nav.Link href="/proposals/create">Create</Nav.Link>
          </Nav>
          <Nav style={{ position: "absolute", right: "1vw" }}>
            {username ? (
              <Nav.Link href="#">{username}</Nav.Link>
            ) : (
              <Nav.Link href="/login/">Login</Nav.Link>
            )}
            <Nav.Link href="/logout/">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CollapsibleNavbar;
