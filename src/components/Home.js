function Home() {
const user = localStorage.getItem('username');
return (<>{user ? 
<header className="App-header">
    Welcome to the FH Proper Application <h1 style={{color: '#AEBC37'}}>{user}</h1>
</header>
:
<></>
}</>);
}

export default Home;