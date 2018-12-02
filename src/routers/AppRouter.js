import {Router, Route, Switch} from 'react-router-dom';
import React from 'react';
import {connect} from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import Login from '../components/Login';
import {SignUp} from '../components/SignUp';
import {NotFoundPage} from '../components/NotFoundPage';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {Kesfet} from '../components/Kesfet';
import {Failed} from '../components/Failed';
import { Yatirimlarim } from '../components/Yatirimlarim';
import { MiksDetayi } from '../components/MiksDetayi.js';
import { SignUpSuccess } from '../components/SignUpSuccess';
import { ToplamPortfoyum } from '../components/Toplam-Portfoyum';
import { Emirlerim } from '../components/Emirlerim';
import { Islemlerim } from '../components/Islemlerim';
import { Favorilerim } from '../components/Favorilerim';
import { MiksOlustur } from '../components/MiksOlustur';
import { OlusturdugumMiksler } from '../components/OlusturdugumMiksler';
import {SatinAlinanMiks} from '..//components/SatinAlinanMiks';
import {SatinAlmaEmriOnayla} from '../components/SatinAlmaEmriOnayla';
import { EmirOnayla } from '../components/EmirOnayla';
import { SatisEmriOnayla } from '../components/SatisEmriOnayla';
import {EmirTakibi} from '../components/EmirTakibi';
import {EmirDetayi} from '../components/EmirDetayi';
import {TamaminiSat} from '../components/TamaminiSat';
import {DuzenlemeEmriOnayla} from '../components/DuzenlemeEmriOnayla';


export const history = createHistory();

class AppRouter extends React.Component {
    
    render() {
        
      return(
          
            
    <Router history={history}>
    <div className='ui container'>
        <Header />
        <div style={{margin:"0 auto", overflow: "auto"}}>
    <Switch>
        <Route path="/login" component = {Login} />
        <Route path="/signup" component = {SignUp}/>
        <Route path="/signUpSuccess" component = {SignUpSuccess}/>
        <Route path="/kesfet" component = {Kesfet} exact={true}/>
        <Route path="/failed" component = {Failed}/>
        <Route path="/hesabim/yatirimlarim" component = {Yatirimlarim}/>
        <Route path="/hesabim/toplam-portfoyum" component = {ToplamPortfoyum}/>
        <Route path="/hesabim/emirlerim" component = {Emirlerim}/>
        <Route path="/hesabim/islemlerim" component = {Islemlerim}/>
        <Route path="/kesfet/favorilerim" component = {Favorilerim}/>
        <Route path="/olustur/miks-olustur" component = {MiksOlustur}/>
        <Route path="/olustur/olusturdugum-miksler" component = {OlusturdugumMiksler}/>
        <Route path="/miks-detayi/:id" component = {MiksDetayi}/>
        <Route path="/satin-alinan-miks/:id" component = {SatinAlinanMiks}/>
        <Route path="/emir/satin-alma-emri-onayla/:id" component = {SatinAlmaEmriOnayla}/>
        <Route path="/emir/emir-onayla/:id" component = {EmirOnayla}/>
        <Route path="/emir/satis-emri-onayla/:id" component = {SatisEmriOnayla}/>
        <Route path="/emir/emir-takibi/:id1/:id2" component = {EmirTakibi}/>
        <Route path="/emir/emir-detayi/:id1/:id2" component = {EmirDetayi}/>
        <Route path="/emir/tamamini-sat-emri-onayla/:id1/:id2" component = {TamaminiSat}/>
        <Route path="/emir/duzenleme-emri-onayla/:id1/:id2" component = {DuzenlemeEmriOnayla}/>
        <Route component = {NotFoundPage} />

    </Switch>
    </div>

    <div>
    <Footer/>
    </div>
     </div>
    </Router>
        )
      }
    
};


const mapStateToProps = (state) =>{
    return {
        login: state.login
    };
};


export default connect(mapStateToProps)(AppRouter);