import * as api from '../api'

import { AUTH } from '../constants/actionTypes'

import { toast } from 'react-toastify'

export const signin = (formData, history) => async(dispatch) => {
    try {
        const { data } = await api.signIn(formData);
        toast.success('You\'re successfully logged in!');

        dispatch({ type: AUTH, data });

        history.push('/');
    } catch(err) {
        if(err.response.data.message){
            toast.error(err.response.data.message);
        } else {
            console.log(err.message);
        }
    }
}

export const signup = (formData, history) => async(dispatch) => {
    try {
        const { data } = await api.signUp(formData);
        toast.success('You\'re successfully registered now!');

        dispatch({ type: AUTH, data });

        history.push('/');
    } catch(err) {
        if(err.response.data.message){
            toast.error(err.response.data.message);
        } else {
            console.log(err.message);
        }
    }
}
