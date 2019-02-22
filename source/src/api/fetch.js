import config from '../config/index';
import  'whatwg-fetch';
import {getSession} from '../utils/util';

export const get=(url)=>(
	fetch(config.requestPrefix+url,{
		method:'GET',
		credentials:'include',
		headers:{
			accept:"application/json",
			token:getSession('token')
		}
	}).then(res=>res.json())
);

export const post=(url,data)=>{

	if(config.changePost){
		console.log(data);
		return get(url)
	}

	return fetch(config.requestPrefix+url,{
			method:'POST',
			credentials:'include',
			headers:{
				'Content-Type':'application/json',
				accept:'application/json',
				token:getSession('token')
			},
			body:JSON.stringify(data)
		}).then(res=>res.json())
};

export const postForm=(url,data)=>{
	if(config.changePost){
		console.log(data);
		return get(url)
	}
	let formData=new FormData();
	for(let key in data){
		formData.append(key,data[key])
	}
	return fetch(config.requestPrefix+url,{
		method:'POST',
		credentials:'include',
		headers:{
			'Content-Type':'application/x-www-form-urlencoded',
			accept:'application/json',
			token:getSession('token')
		},
		body:formData
	}).then(res=>res.json())
}
