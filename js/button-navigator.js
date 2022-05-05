const mover = document.querySelector('.mover');

if (mover) {
    const numOfNavigartors = document.querySelector('.mover .middle-mover .les').children.length;
    const cur = document.querySelector('.mover .middle-mover .les .cur');
    const curNum = +cur.textContent;
    const curHref = cur.getAttribute('href');
    const nextHref = curHref.replace(`-${curNum}`, `-${curNum+1}`)
    const prevHref = curHref.replace(`-${curNum}`, `-${curNum-1}`)
    document.addEventListener('keyup', (e) => {
        if (e.key == "ArrowRight" && curNum < numOfNavigartors){
            location.assign(nextHref);
        }
        else if (e.key == "ArrowLeft" && curNum > 1){
            location.assign(prevHref);
        }
    })
}