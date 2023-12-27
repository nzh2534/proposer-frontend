import ListGroup from "react-bootstrap/ListGroup";
import "./ListView.css";

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
    <div className="list-view-container">
      <div className="list-view">
        Select a proposal to view
        <hr color="black" style={{ width: "11em" }} />
        <ListGroup defaultActiveKey="#">
          {proposals?.map((item, index) => {
            return <Proposal proposal={item} key={index} />;
          })}
        </ListGroup>
      </div>
    </div>
  );
}

export default ListView;
