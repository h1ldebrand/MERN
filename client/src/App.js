import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { useRouter } from './routes'
import { useAuth } from './hooks';
import { AuthContext } from './context/AuthContext';
import { NavBar } from './component/Navbar'
import { Loader } from './component/Loader'
import 'materialize-css';


function App() {
    const {login, logout, token, userId, ready} = useAuth()
    const isAuthenticated = !!token
    const routes = useRouter(isAuthenticated)

    if(!ready){
        return <Loader/>
    }

    return (
        <AuthContext.Provider value={{
            login, logout, token, userId, isAuthenticated
        }} >
            <Router>
                { isAuthenticated && <NavBar/> }
                <div className="container">
                    { routes }
                </div>
            </Router>
        </AuthContext.Provider>
        
    );
}

export default App;
