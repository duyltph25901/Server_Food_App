const formatPriceByVnd = (price) => {
    let vnd = new Intl.NumberFormat('VN', {
        style: 'currency',
        currency: 'VND',
    })

    return `${vnd.format(price)}`
}

export default formatPriceByVnd 