import {firebaseAuth, googleProvider} from '../config/constants'

export function loginWithGoogle() {
    return firebaseAuth().signInWithRedirect(googleProvider);
}

export function signOut() {
    return firebaseAuth().signOut(); 
}
