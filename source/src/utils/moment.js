import moment from 'moment';

export const handleMoment = (str) => {
	if (str) {
		let dateFormat = 'YYYY-MM-DD HH:mm';
		return moment(str.slice(0, -3), dateFormat)
	}
};

export const betweenMoment=(time,beginTime,endTime)=>{
	return moment(time).isBetween(beginTime, endTime,'second');
};
export const disabledDate=(current)=>{
	return current&&current > moment().endOf('day');
};
export const disabledDateBefore=(current)=>{
	return current&&current > moment().endOf('day');
};