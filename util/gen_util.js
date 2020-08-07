module.exports.checkEmail = (email) => {
	const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return email.match(emailRegex);
};

module.exports.checkPass = (password) => {
	const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
	return password.match(passRegex);
}

// module.exports.saveToken = ()=>{

// };

module.exports.getSemAndYear = (enrollno) => {
	try {
		const regex = RegExp("[A-Z][1-2][0-9]");
		const charYear = enrollno.match(regex)[0];
		const enrollYear = parseInt("20" + charYear.substring(1));
		const curMonth = new Date().getMonth()
		const curYear = new Date().getFullYear();
		let year = curYear - enrollYear;
		if (curMonth >= 5 && curMonth < 12) {
			++year;
		}
		if (year > 4) return false;
		let sem;
		if (curMonth >= 0 && curMonth < 6)
			sem = 2 * year;
		else sem = 2 * year - 1;
		return {
			year,
			sem
		}
	} catch (error) {
		// console.log(error);
		throw new Error(error);
	}
};