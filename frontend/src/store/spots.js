import { csrfFetch } from './csrf';

//ACTIONS------------------
const LOAD_SPOTS ='get/SPOTS';
const ADDSPOT = 'create/SPOT';
const SINGLESPOT ='get/SingleSpotbyId';
const LOAD_USERSPOTS= 'get/userSpots';
const UPDATE_SPOT ='put/spot'
const DELETE = 'spot/DELETE'

export const loadSpots = (spots) =>({
    type:LOAD_SPOTS,
    spots
})


export const addSpot = (spot) =>({
    type:ADDSPOT,
    spot
})

export const singleSpotDetails = (spotDetails) =>({
    type:SINGLESPOT,
    spotDetails
})

export const loadUserSpots = (spots) =>({
    type:LOAD_USERSPOTS,
    spots
})

export const updateSpot = spot =>({
    type:UPDATE_SPOT,
    spot
})

export const deleteSpot = spotId =>({
    type:DELETE,
    spotId
})





//ACTION THUNKS -------------------------------------

//getAllSpotsThunkAction
export const getSpots = () => async (dispatch) =>{
    const response = await csrfFetch('/api/spots')
    console.log('response',response)
    if(response.ok){
        const spotsList = await response.json();
        dispatch(loadSpots(spotsList.Spots))
        return spotsList
    }
}

export const createSpot = newSpot => async dispatch =>{
    const response = await csrfFetch('/api/spots',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(newSpot)

    })
    if(response.ok){
        const newAddedSpot = await response.json();
        const res = await csrfFetch(`/api/spots/${newAddedSpot.id}/images`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json' 
            },
            body:JSON.stringify({url:newSpot.imageUrl, preview:true})
        })
        if(res.ok){
            //newAddedSpot.previewImage
        console.log('newAddedSpot:',newAddedSpot)
        dispatch(addSpot(newAddedSpot));
        return newAddedSpot;
        }
    }
}

export const fetchSingleSpot = (spotId) => async dispatch =>{
    const response = await csrfFetch(`/api/spots/${spotId}`)
    if(response.ok){
        const spotDetails = await response.json()
        dispatch(singleSpotDetails(spotDetails))
    }
}

export const getCurrentUserSpots = () =>async dispatch =>{
    const response = await csrfFetch(`/api/spots/current`)
    if(response.ok){
        const userSpots = await response.json()
        dispatch(loadUserSpots(userSpots))
        return userSpots
    }

}

export const updateASpot = (spot, spotId) =>async dispatch =>{
    const response = await csrfFetch(`/api/spots/${spotId}`,{
        method:'PUT',
        header:{
            'Contetn-Type':'application/json'
        }
    })
    if(response.ok){
        const updatedSpot = await response.json()
        const res = await csrfFetch(`/api/spots/${updatedSpot.id}/images`,{
            method:'POST',
            headers:{
            'Content-Type': 'application/json' 
            },
            body:JSON.stringify({url:spot.imageUrl, preview:true})
        })
        if(res.ok){
        dispatch(updateASpot(updatedSpot))
        return updatedSpot
        }
    }
}

export const deleteASpot = (spotId) => async (dispatch) =>{
    const response = await  csrfFetch(`/api/spots/${spotId}`,{
        method:'DELETE'
    })
    if(response.ok){
        //const deletedSpot = await response.json()
        dispatch(deleteASpot(spotId))
    }
}



//REDUCERS--------------------
const initState = {spots:{}, singleSpot:{}}
export default function SpotsReducers (state=initState, action){
    switch(action.type){

        case LOAD_SPOTS:
            const newState={spots:{}, singleSpot:{} }
            action.spots.forEach(spot =>{
                newState.spots[spot.id] = spot
            });
            return newState;

        case ADDSPOT:{
            const newState = {...state}
            newState.spots[action.spot.id] = action.spot
            return newState;   
            }
        case SINGLESPOT:
            return {
                ...state,
                singleSpot:action.spotDetails
            }
        case UPDATE_SPOT:{
            const newState = {...state}
            newState.singleSpot = action.spot
            return newState;
        }
        case DELETE:{
            const newState = {
                ...state,
                spots:{...state.spots},
                singleSpot:{...state.singleSpot}
            };
            delete newState.spots[action.spotId]
            delete newState.singleSpot[action.spotId]
            return newState;
        }
            
        case LOAD_USERSPOTS:{
            const newState = {
                spots:{...state.spots},
                singleSpot:{
                    ...state.singleSpot
                }
            }
            newState.spots = action.spots
            return newState
        }
       
        default:
            return state; 
    }}