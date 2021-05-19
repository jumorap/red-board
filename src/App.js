import './App.css';
import Login from "./view/Login";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Admin from './view/Admin';
import Home from './view/Home';
import ProgrammeResults from "./view/ProgrammeResults";
import {createContext, useEffect} from 'react';
import ContextProvider from './view/ContextProvider';
import { AuthProvider } from "./model/firebaseAuthPersistence/AuthProvider";
import PrivateRoute from "./model/firebaseAuthPersistence/PrivateRoute";
import { firebaseAnalytics } from "./model/firebaseSelf/firebaseConfig";


export const contextProvider = createContext(undefined)

function App() {

    /*Google analytics*/
    useEffect(() => {
        firebaseAnalytics.logEvent("homepage_visited")
    })

    return (
        <Router>
            <AuthProvider>
            <ContextProvider>
                
                <Switch>
                            <PrivateRoute exact path="/materias/:idMateria" component={ ProgrammeResults} />
                            <PrivateRoute exact path="/results" component={ProgrammeResults} />
                            <PrivateRoute exact path="/admin" component={Admin} />
                            <PrivateRoute exact path="/home" component={Home} />
                            <Route exact path="/" component={Login} />
                </Switch>
                
            </ContextProvider>
            </AuthProvider>
        </Router>
    )
}

export default App;
