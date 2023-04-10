const getTimeNow = () => {
    const now = new Date();

    const currentYear = now.getFullYear(); // Lấy ra năm hiện tại
    const currentMonth = now.getMonth() + 1; // Lấy ra tháng hiện tại (phải cộng 1 vì các tháng được đánh số từ 0-11)
    const currentDate = now.getDate(); // Lấy ra ngày hiện tại
    const currentHour = now.getHours(); // Lấy ra giờ hiện tại
    const currentMinute = now.getMinutes(); // Lấy ra phút hiện tại
    const currentSecond = now.getSeconds(); // Lấy ra giây hiện tại

    return `${currentYear}-${currentMonth}-${currentDate} ${currentHour}:${currentMinute}:${currentSecond}`
}

export default getTimeNow