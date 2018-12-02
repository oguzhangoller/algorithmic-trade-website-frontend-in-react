import React from 'react';
import {history} from '../routers/AppRouter.js';

export class SignUpSuccess extends React.Component{
    componentDidMount(){
        // Start counting when the page is loaded
        this.timeoutHandle = setTimeout(()=>{
             history.push('/login');
        }, 1500);
   }

   render() {
       return(
        <div>
            Successfull SignUp!
            <br/>
            Redirecting to Login Page
        </div>
       );
   }
    
}
