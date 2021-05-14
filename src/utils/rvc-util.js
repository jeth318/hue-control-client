export const isOutsideOperationalHours = (() => {
    console.log('asd');
    const start = 8 * 60;
    const end =  19 * 60;
    const date = new Date(); 
    const now = date.getHours() * 60 + date.getMinutes();
    console.log({ start, end, now });
    return now >= start && now >= end;
})();