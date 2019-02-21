export const setSession = (key, value) => {
	if (typeof value === 'object') {
		value = JSON.stringify(value);
	}
	sessionStorage.setItem(key, value);
};

export const getSession = (key) => {
	let value = sessionStorage.getItem(key);
	if (/^(\{|\[)/.test(value)) {
		value = JSON.parse(value);
	}
	return value
};

export const removeSession = (key) => {
	sessionStorage.removeItem(key);
};


// export const myFind=(ary,callback)=>{
// 	for(let i=0;i<ary.length;i++){
// 		if(callback(ary[i])){
// 			return ary[i]
// 		}
// 	}
// };
// export const myFindIndex=(ary,callback)=>{
// 	for(let i=0;i<ary.length;i++){
// 		if(callback(ary[i])){
// 			return i
// 		}
// 	}
// };

