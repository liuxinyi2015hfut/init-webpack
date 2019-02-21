import develop from './develop';
import production from './production';
import test from './test';

let config={};
if(process.env.NODE_ENV==='production'){
	config=production;
}else if(process.env.NODE_ENV==='development'){
	config=develop;
}else if(process.env.NODE_ENV==='test'){
	config=test;
} else{
	throw new Error('请设置正确的NODE_ENV,为production或development或test');
}
export default config;