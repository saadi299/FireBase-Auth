/* eslint-disable react/jsx-no-comment-textnodes */
/*https://firebase.google.com/docs/web/setup   */

import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './fireBase.config'
firebase.initializeApp(firebaseConfig);

function App() {
  var provider = new firebase.auth.GoogleAuthProvider();

  //------------------User state Declaration-----------------------
  const [user,setUser]=useState({

    isSignedIn:false,
    name : '',
    email : '',
    password :'',
    photo : '',
    error: '',
    isValid: false,
    existingUser: false,
  })

  //-------------------------HandleSignIn-----------------------------------

  const handleSignIn = () =>{

    firebase.auth().signInWithPopup(provider)
    .then(result=>{
      const {displayName,email,password,photoURL}=result.user;
      const signedInUser={
        isSignedIn:true,
        name : displayName,
        email : email,
        password: password,
        photo : photoURL
       }

      setUser(signedInUser);
      console.log(displayName,email,photoURL);
      })

    .catch(error =>{
      console.log(error);
      console.log(error.message);

    })
   
  }
   //-------------HndleSignOut------------------ 
   const handleSignOut = () =>{

    firebase.auth().signOut()
    .then( result =>{
      const singOutUser = {
        isSignedIn:false,
        name : '',
        email : '',
        password :'',
        photo : '',
        error: '',
        isValid:false

      }
      setUser(singOutUser);
      
    })
    .catch(error => {
      console.log(error);
      console.log(error.message);
      
    });

   }

   const is_valid_email =email =>/(.+)@(.+){2,}\.(.+){2,}/.test(email);
   const hasNumber =input =>/\d/.test(input);


   //----------SitchForm-------------

   const switchForm = event=>{
    // console.log(event.target.checked);
          const createUser={...user};
          createUser.existingUser=event.target.checked;
          setUser(createUser);

   }

   //-----------Submit Form-----------  https://console.firebase.google.com/u/0/project/ema-john-299/authentication/users
   const createAccount= (event) =>{
     if(user.isValid){
        firebase.auth().createUserWithEmailAndPassword(user.email,user.password)  //https://firebase.google.com/docs/auth/web/password-auth
        .then (res =>{
         console.log(res);
         const createUser={...user};
         createUser.isSignedIn=true;
         createUser.error='';
         //console.log(createUser);
         user.isSignedIn=true;
         setUser(createUser); 
         
        })
        
        .catch(error =>{
         //  console.log("Message",error.message);
          const createUser={...user};
          createUser.isSignedIn=false;
          createUser.error=error.message;
          //console.log(createUser);
          setUser(createUser);
         
        })
        
     }

  
     event.preventDefault();
     event.target.reset();

   }

   //---------------SignIn-------------------

   const signInUser = event =>{
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email,user.password)  //https://firebase.google.com/docs/auth/web/password-auth
      .then (res =>{
       console.log(res);
       const createUser={...user};
       createUser.isSignedIn=true;
       createUser.error='';
       //console.log(createUser);
       user.isSignedIn=true;
       setUser(createUser); 
       
      })
      
      .catch(error =>{
       //  console.log("Message",error.message);
        const createUser={...user};
        createUser.isSignedIn=false;
        createUser.error=error.message;
        //console.log(createUser);
        setUser(createUser);
       
      })
      
   }

    event.preventDefault();
    event.target.reset();
   }


     //-------------HandleChange--------------
    const handleChange = event =>{
     const newUserInfo ={
       ...user
     };

     let isValid=true;
     if(event.target.name === 'email'){
     isValid=is_valid_email(event.target.value);
     //console.log(isValid);
     }

      if(event.target.name === 'password'){
       isValid=event.target.value.length>8 && hasNumber(event.target.value)
     }

     newUserInfo[event.target.name]=event.target.value;
     newUserInfo.isValid=isValid;
     //console.log(newUserInfo.isValid );
    
     setUser(newUserInfo);
   }
  
    return (
    <div className="App">
     <h1>FireBase</h1>
     {
       user.isSignedIn && 
       <div>
         <p>Welcome,{user.name}</p>
         <p>Email:{user.email}</p>
         <img src={user.photo} alt=""></img>

        </div>
     }

       {
       user.isSignedIn ? <button onClick={handleSignOut}>Sign-out</button> : <button onClick={handleSignIn}>Sign-in with goggle</button>
       }<br/><br/>

      
       <label htmlFor="switchForm"> <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/><b>Returning User</b>   
       </label><br/><br/>
        
        
       <form style={{display:user.existingUser ?'block' : 'none'}} onSubmit={signInUser}>  
       <h1> Sign In:</h1>
       <input type="text" name="email" onBlur={handleChange} placeholder="Type your email" required/> <br/>
       <input type="password" onBlur={handleChange} name="password" placeholder="Type your password" required/> <br/><br/>
       <input type="submit" value="Sign In"/><br/>
       
       </form>

      

       <form style={{display:user.existingUser ?'none' : 'block'}} onSubmit={createAccount}>
       <h1> Our Authentication:</h1><br/>
       <input type="text" name="name" onBlur={handleChange} placeholder="Type your name" required/><br/> 
       <input type="text" name="email" onBlur={handleChange} placeholder="Type your email" required/> <br/>
      <input type="password" onBlur={handleChange} name="password" placeholder="Type your password" required/> <br/><br/>
       <input type="submit" value="Create Account"/>
       
       </form>
       {
         user.error && <p style={{color:'red'}}>{user.error}</p>
       }
     
    </div>
  );
}

export default App;
