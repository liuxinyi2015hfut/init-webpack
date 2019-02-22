import cloneDeep from 'lodash.clonedeep';
import * as Types from '../actionTypes';
let initState={
	hash:'',
	pathname:'/',
	search:'',
	state:undefined
};

export default (state=cloneDeep(initState),action)=>{
	let {type,location}=action;
	switch (type){
		case Types.ROUTER_CHANGE:
			return {...state,
				...location
			};
		default:
			return state
	}
}