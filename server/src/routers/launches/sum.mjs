export default function (...nums) {
	return nums.reduce((acc, num) => acc + num, 0);
}
