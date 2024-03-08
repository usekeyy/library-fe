import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import {userIsNotAuthenticatedRedir, userIsAdminRedir} from './config/auth';
import Loading from './components/loading/Loading';

const DefaultLayout = React.lazy(() => import('./containers/layout/Layout'));
const Beranda = React.lazy(() => import('./containers/beranda/Beranda'));

const Home = userIsAdminRedir(DefaultLayout);
const Sign = userIsNotAuthenticatedRedir(Beranda);

const loading = () => <Loading/>

class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <React.Suspense fallback={loading()}>
                        <Route exact path="/beranda" name="Login Page" label="Login Page" render={(props) => <Sign {...props}/>} />
                        <Route path="/" name="Home" render={(props) => <Home {...props}/>}></Route>
                    </React.Suspense>
                </BrowserRouter>
            </React.Fragment>
        )
    }
}

export default App;
