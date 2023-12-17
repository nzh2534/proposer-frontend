import Alert from "react-bootstrap/Alert";
import { Container } from "react-bootstrap";

function Home() {
  const user = localStorage.getItem("username");
  return (
    <>
      {user ? (
        <Container className="App-header">
          <header>Welcome to the Proposer Application</header>
          <Alert style={{ marginTop: "10px" }} variant="primary">
            {user}
          </Alert>
        </Container>
      ) : (
        <></>
      )}
    </>
  );
}

export default Home;
