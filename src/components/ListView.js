import ListGroup from "react-bootstrap/ListGroup";

function Proposal(props) {
  const { proposal } = props;
  return (
    <ListGroup.Item action href={`/proposals/${proposal.pk}`}>
      {proposal.title} - {proposal.assigned}
    </ListGroup.Item>
  );
}

function ListView({ proposals }) {
  return (
    <ListGroup defaultActiveKey="#">
      {proposals?.map((item, index) => {
        return <Proposal proposal={item} key={index} />;
      })}
    </ListGroup>
  );
}

export default ListView;
