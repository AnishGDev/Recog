import {firebaseAuth, googleProvider} from '../config/constants'

export function loginWithGoogle() {
    return firebaseAuth().signInWithPopup(googleProvider);
}

export function signOut() {
    return firebaseAuth().signOut(); 
}
