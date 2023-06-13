import '../App.css';

function Loading() {
return (
    <div className="d-flex justify-content-center Center-item">
        <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);
}

export default Loading;